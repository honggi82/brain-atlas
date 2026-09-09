import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { FUNCTIONAL_AREAS, functionalParts } from '../src/functional.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url));
const parts = JSON.parse(read('public/models/parts.json'));

test('two source-labelled insulae retain valid geometry, laterality and a deeper position than the opercula', () => {
  const manifest = JSON.parse(read('public/models/insula.json'));
  const raw = read('public/models/insula.bin');
  assert.equal(createHash('sha256').update(raw).digest('hex'), manifest.sha256);
  assert.deepEqual(manifest.parts.map(p => p.fma), ['FMA72978', 'FMA72977']);
  assert.ok(manifest.registration.heldOutControls.every(p => p.residualMm < 1));
  assert.equal(parts.find(p => p.id === 145).label, 'Subcentral gyrus and sulci');
  assert.equal(parts.find(p => p.id === 145).region, 'Telencephalon');
  for (const p of manifest.parts) {
    const vertices = Array.from({ length: p.vertexCount * 3 }, (_, i) => raw.readFloatLE(p.positions + i * 4));
    const indices = Array.from({ length: p.indexCount }, (_, i) => raw.readUInt32LE(p.indices + i * 4));
    assert.ok(vertices.every(Number.isFinite));
    assert.ok(indices.every(i => i < p.vertexCount));
    assert.equal(p.indexCount % 3, 0);
    const xs = vertices.filter((_, i) => i % 3 === 0);
    assert.ok(xs.every(x => p.side === 'left' ? x > 0 : x < 0));
    assert.ok(Math.max(...xs.map(Math.abs)) < 0.047);
    assert.equal(parts.find(a => a.id === p.id).label, 'Insula');
    assert.equal(parts.find(a => a.id === p.id).ko, '뇌섬엽');
  }
});

test('whole hippocampal geometry respects hemispheres; cortical functions do not select old gyral references', () => {
  const hippocampus = FUNCTIONAL_AREAS.find(a => a.id === 'hippocampus');
  for (const side of ['left', 'right']) {
    const references = functionalParts(parts, hippocampus, side);
    assert.equal(references.length, 1);
    assert.equal(references[0].side, side);
    assert.equal(references[0].label, 'Hippocampus');
  }
  assert.deepEqual(new Set(functionalParts(parts, hippocampus, 'both').map(p => p.side)), new Set(['left', 'right']));
  for (const area of FUNCTIONAL_AREAS.filter(a => a.id !== 'hippocampus')) assert.deepEqual(functionalParts(parts, area, 'both'), []);
});
