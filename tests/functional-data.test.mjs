import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { FUNCTIONAL_AREAS } from '../src/functional.js';

const manifest = JSON.parse(fs.readFileSync('public/functional/manifest.json'));
const raw = fs.readFileSync('public/functional/cortex.bin');

test('native functional surfaces preserve valid topology, label counts and all 360 named parcels', () => {
  assert.equal(createHash('sha256').update(raw).digest('hex'), manifest.sha256);
  assert.equal(manifest.surfaces.length, 2);
  for (const surface of manifest.surfaces) {
    assert.equal(surface.vertexCount, 32492);
    assert.equal(surface.indexCount, 64980 * 3);
    assert.equal(surface.parcels.length, 180);
    const counts = new Map();
    for (let i = 0; i < surface.vertexCount; i++) {
      for (let j = 0; j < 3; j++) assert.ok(Number.isFinite(raw.readFloatLE(surface.positions + (i * 3 + j) * 4)));
      const label = raw.readUInt32LE(surface.labels + i * 4);
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    for (const parcel of surface.parcels) assert.equal(counts.get(parcel.id), parcel.vertices, `${surface.side}:${parcel.name}`);
    for (let i = 0; i < surface.indexCount; i++) assert.ok(raw.readUInt32LE(surface.indices + i * 4) < surface.vertexCount);
    const centroid = name => surface.parcels.find(p => p.name === name).centroidRAS;
    assert.ok(centroid('4')[1] > centroid('3b')[1], 'M1 is anterior to primary somatosensory area 3b');
    assert.ok(centroid('V1')[1] < -70, 'V1 is posterior');
    assert.ok(Math.abs(centroid('V1')[0]) < 20, 'V1 is near the medial surface');
    assert.ok(centroid('6mp')[2] > 50 && Math.abs(centroid('6mp')[0]) < 20, 'SMA is superior and medial');
    assert.ok(Math.abs(centroid('A1')[0]) > 30, 'A1 is lateral');
    for (const parcel of surface.parcels) assert.ok(surface.side === 'left' ? parcel.centroidRAS[0] < 0 : parcel.centroidRAS[0] > 0);
  }
});

test('all 22 bilingual functional topics use explicit native parcels or whole hippocampal anatomy', () => {
  assert.equal(FUNCTIONAL_AREAS.length, 22);
  assert.equal(new Set(FUNCTIONAL_AREAS.map(a => a.id)).size, 22);
  for (const area of FUNCTIONAL_AREAS) {
    for (const field of ['ko', 'en', 'location', 'locationEn', 'summary', 'summaryEn', 'scope', 'scopeEn', 'group']) assert.ok(area[field], `${area.id}.${field}`);
    if (area.id === 'hippocampus') { assert.deepEqual(area.labels, ['Hippocampus']); continue; }
    assert.deepEqual(area.labels, [], 'cortical function must not select whole Z-Anatomy gyri');
    assert.ok(area.parcels.length > 0);
    for (const surface of manifest.surfaces) for (const parcel of area.parcels) assert.ok(surface.parcels.some(p => p.name === parcel), `${area.id}:${parcel}`);
  }
  for (const [id, parcels] of Object.entries({ m1: ['4'], v1: ['V1'], a1: ['A1'], s1: ['3a', '3b', '1', '2'], broca: ['44', '45'], wernicke: ['PSL', 'STV'] })) assert.deepEqual(FUNCTIONAL_AREAS.find(a => a.id === id).parcels, parcels);
});
