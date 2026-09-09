import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { KNOWLEDGE, CATEGORIES, searchParts, tractKnowledge } from '../src/knowledge.js';
import { setLanguage, partName, partSummary, english } from '../src/i18n.js';
import { connectionsForTract, connectionsForRegion, percent } from '../src/connectome.js';
import { PointerTap } from '../src/pointer-tap.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url));
const parts = JSON.parse(read('public/models/parts.json'));
const data = JSON.parse(read('public/data/hcp-connectome.json'));

test('325 anatomical identities and 174 descriptions match the pinned GLB, including multi-primitive cortex', () => {
  const raw = read('public/models/brain.glb');
  assert.equal(raw.toString('ascii', 0, 4), 'glTF');
  const glb = JSON.parse(raw.toString('utf8', 20, 20 + raw.readUInt32LE(12)));
  assert.equal(parts.length, 325);
  assert.equal(new Set(parts.map(p => p.id)).size, 325);
  assert.equal(new Set(parts.map(p => p.label)).size, 174);
  for (const part of parts) {
    const node = glb.nodes.find(n => n.extras?.bx_id === part.id);
    assert.ok(node, part.label);
    assert.ok(glb.meshes[node.mesh].primitives.length);
    assert.ok(KNOWLEDGE[part.label]);
    assert.equal(part.ko, KNOWLEDGE[part.label].ko);
    assert.equal(part.summary, KNOWLEDGE[part.label].summary);
    assert.ok(part.summary.length > 20);
    assert.ok(!/[\uFFFD\u3000]|\?{3}/.test(part.ko + part.summary));
  }
  const precentral = glb.nodes.find(n => n.extras?.bx_id === 284);
  assert.equal(glb.meshes[precentral.mesh].primitives.length, 2);
  const primitiveCount = parts.reduce((sum, p) => sum + glb.meshes[glb.nodes.find(n => n.extras?.bx_id === p.id).mesh].primitives.length, 0);
  assert.ok(primitiveCount > parts.length);
  console.log(`GLB: ${parts.length} structures, ${primitiveCount} render primitives`);
});

test('all anatomical and tract entries have Korean and English terms and summaries', () => {
  for (const part of [...parts, ...data.tracts.map(tractKnowledge)]) {
    assert.ok(part && /[가-힣]/.test(part.ko));
    assert.ok(part.en && !/[가-힣]/.test(part.en));
    assert.ok(part.summaryEn.length > 25 && !/[가-힣]/.test(part.summaryEn));
    setLanguage('ko'); assert.equal(partName(part), `${part.ko} (${part.en})`);
    setLanguage('en'); assert.equal(partName(part), part.en); assert.equal(partSummary(part), part.summaryEn);
  }
  setLanguage('ko');
  assert.equal(KNOWLEDGE['Gracile lobule'].ko, '널판소엽');
  assert.equal(KNOWLEDGE['Biventral lobule'].ko, '볼록소엽');
  assert.equal(KNOWLEDGE['Mamillary body'].en, 'Mammillary body');
  assert.ok(parts.filter(p => p.label === 'Base of peduncle').every(p => p.category === 'brainstem'));
  assert.ok(searchParts(parts, '중심전회').some(p => p.label === 'Precentral gyrus'));
  assert.ok(searchParts(parts, 'episodic').some(p => p.label === 'Hippocampus'));
});

test('interface translations preserve counts and probability semantics', () => {
  assert.equal(english('67 / 180개 영역 · 좌측'), '67 / 180 areas · Left');
  assert.equal(english('325개 형상'), '325 structures');
  assert.equal(english('표의 상위 6개 연결 · 도식'), 'Top 6 values · schematic');
  assert.match(english('신경로 마스크가 해당 영역과 겹친 비율입니다. 연결 강도나 신호 방향을 의미하지 않습니다.'), /not connection strength/);
});

test('bundled anatomy and source workbook hashes are locked', () => {
  const lock = JSON.parse(read('public/data/asset-lock.json'));
  for (const [path, hash] of Object.entries(lock.sha256).filter(([p]) => p.startsWith('public/'))) {
    assert.equal(createHash('sha256').update(read(path)).digest('hex'), hash, path);
  }
  assert.equal(createHash('sha256').update(read('public/data/tract_to_region_connectome_MMP.xlsx')).digest('hex'), data.provenance.sourceSha256);
});

test('the whole matrix retains 9360 finite probabilities and all 7044 zeros', () => {
  assert.equal(data.regions.length, 180);
  assert.equal(data.tracts.length, 52);
  assert.deepEqual(data.regions.map(r => r.rowIndex), Array.from({length:180}, (_, i) => i));
  assert.deepEqual(data.tracts.map(t => t.columnIndex), Array.from({length:52}, (_, i) => i));
  const values = data.values.flat();
  assert.equal(values.length, 9360);
  assert.ok(data.values.every(row => row.length === 52));
  assert.ok(values.every(v => Number.isFinite(v) && v >= 0 && v <= 1));
  assert.equal(values.filter(v => v === 0).length, 7044);
  assert.equal(values.filter(v => v === 1).length, 131);
  assert.equal(data.tracts.filter(t => t.side === 'left').length, 26);
  assert.equal(data.tracts.filter(t => t.side === 'right').length, 26);
});

test('threshold zero includes true zeros; filtering never mutates the source', () => {
  const before = JSON.stringify(data.values);
  const all = connectionsForTract(data, 'L_AF');
  assert.equal(all.length, 180);
  assert.equal(all.filter(r => r.probability === 0).length, 98);
  assert.equal(connectionsForTract(data, 'L_AF', 0.05).length, 67);
  assert.deepEqual(connectionsForTract(data, 'L_AF', 1).map(r => r.region.id), ['6r']);
  assert.equal(all.find(r => r.region.id === '44').probability, 0.9981220657277);
  assert.equal(percent(all.find(r => r.region.id === '44').probability), '99.8%');
  assert.equal(connectionsForTract(data, 'L_AF', 0, 'v1').find(r => r.region.id === 'V1').probability, 0);
  assert.deepEqual(connectionsForTract(data, 'missing'), []);
  assert.equal(JSON.stringify(data.values), before);
});

test('region lookup preserves laterality and links V1 to left optic radiation', () => {
  const left = connectionsForRegion(data, 'V1', 'left');
  assert.equal(left.length, 26);
  assert.ok(left.every(r => r.tract.side === 'left'));
  assert.equal(left.find(r => r.tract.id === 'L_OR').probability, 1);
  const right = connectionsForRegion(data, 'V1', 'right');
  assert.equal(right.length, 26);
  assert.ok(right.every(r => r.tract.side === 'right'));
  assert.deepEqual(connectionsForRegion(data, 'missing', 'left'), []);
});

test('38 semantic model links match name and hemisphere; 14 remain unmapped', () => {
  const mapped = data.tracts.filter(t => t.modelMapping);
  assert.equal(mapped.length, 38);
  assert.equal(data.tracts.filter(t => !t.modelMapping).length, 14);
  for (const tract of mapped) {
    const part = parts.find(p => p.id === tract.modelMapping.modelNodeId);
    assert.ok(part, tract.id);
    assert.equal(part.side, tract.side);
    assert.equal(part.label, tract.modelMapping.modelLabel);
  }
  assert.equal(data.tracts.find(t => t.id === 'L_PTAT').fullName, null);
  assert.equal(data.tracts.find(t => t.id === 'L_PTAT').modelMapping, null);
  assert.ok(data.regions.some(r => r.id === '52'));
});

test('Korean, English and function searches reach the hippocampus', () => {
  for (const query of ['해마', 'HIPPOCAMPUS', '일화']) assert.ok(searchParts(parts, query).some(p => p.label === 'Hippocampus'), query);
  assert.equal(searchParts(parts, 'no-such-brain-region').length, 0);
});

test('pointer selection accepts taps, rejects drags, cancellation and pinch remnants', () => {
  const tap = new PointerTap();
  tap.down(1, 0, 0, 5); assert.equal(tap.up(1, 2, 2), true);
  tap.down(1, 0, 0, 5); tap.move(1, 10, 0); assert.equal(tap.up(1, 0, 0), false);
  tap.down(1, 0, 0, 12); tap.down(2, 10, 0, 12);
  assert.equal(tap.up(2, 10, 0), false); assert.equal(tap.up(1, 0, 0), false);
  tap.down(1, 0, 0, 5); tap.cancel(1); assert.equal(tap.up(1, 0, 0), false);
  tap.down(1, 0, 0, 5); assert.equal(tap.up(1, 0, 0), true);
});
