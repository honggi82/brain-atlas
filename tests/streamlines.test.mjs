import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { decodeStreamlines, directionRGB, segmentData, bundleForTract, makeCatalogue } from '../src/streamlines.js';
import { partName, setLanguage } from '../src/i18n.js';
import * as T from 'three';
import { streamlineGeometry } from '../src/tract-layer.js';

const read = name => fs.readFileSync(new URL(`../${name}`, import.meta.url));
const manifest = JSON.parse(read('public/tractography/manifest.json'));
const table = JSON.parse(read('public/data/hcp-connectome.json'));
const parts = JSON.parse(read('public/models/parts.json'));
const decode = bytes => decodeStreamlines(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));

test('68 bundled tract files and overview retain their hashes, offsets and original source-index identities', () => {
  assert.equal(manifest.bundles.length, 68);
  assert.equal(manifest.bundles.reduce((sum, b) => sum + b.count, 0), 98484);
  assert.equal(manifest.overview.count, 5434);
  for (const bundle of [...manifest.bundles, manifest.overview]) {
    const compressed = read(`public/tractography/${bundle.file}`);
    assert.equal(createHash('sha256').update(compressed).digest('hex'), bundle.sha256);
    const data = decode(gunzipSync(compressed));
    assert.equal(data.count, bundle.count);
    if (bundle.pointCount) assert.equal(data.pointCount, bundle.pointCount);
    assert.ok(data.points.every(v => Math.abs(v) < 200));
    if (bundle.sourceIndices) {
      assert.equal(new Set(bundle.sourceIndices).size, bundle.count);
      assert.ok(bundle.sourceIndices.every(i => i >= 0 && i < bundle.sourceCount));
      assert.ok(bundle.count <= 2000 && bundle.count <= bundle.sourceCount);
    }
  }
});

test('48 matrix columns map to the matching source code and hemisphere; ambiguous codes remain unmapped', () => {
  const catalogue = makeCatalogue(manifest, parts, table);
  assert.equal(catalogue.find(b => b.id === 'MCP').side, 'both');
  assert.equal(catalogue.find(b => b.id === 'SCP').side, 'both');
  const matched = table.tracts.map(t => [t, bundleForTract(t, catalogue)]);
  assert.equal(matched.filter(([, b]) => b).length, 48);
  assert.deepEqual(matched.filter(([, b]) => !b).map(([t]) => t.id).sort(), ['L_C_R', 'L_PTAT', 'R_C_R', 'R_PTAT']);
  for (const [tract, bundle] of matched) if (bundle) assert.equal(bundle.side, tract.side);
  assert.equal(bundleForTract(table.tracts.find(t => t.id === 'L_SLF_III'), catalogue).id, 'SLF3_L');
  assert.equal(bundleForTract(table.tracts.find(t => t.id === 'R_CTh_A'), catalogue).id, 'TR_A_R');
  for (const b of catalogue) {
    assert.ok(b.ko && b.en && b.summary && b.summaryEn);
    setLanguage('ko'); assert.equal(partName(b), `${b.ko} (${b.en})`);
    setLanguage('en'); assert.equal(partName(b), b.en);
  }
  setLanguage('ko');
});

test('orientation colours are axis-specific and independent of streamline traversal direction', () => {
  assert.deepEqual(directionRGB(1, 0, 0), [1, 0, 0]);
  assert.deepEqual(directionRGB(0, -4, 0), [0, 1, 0]);
  assert.deepEqual(directionRGB(0, 0, 6), [0, 0, 1]);
  assert.deepEqual(directionRGB(1, 2, 3), directionRGB(-1, -2, -3));
  assert.deepEqual(directionRGB(0, 0, 0), [0, 0, 0]);
});

test('separate streamlines do not acquire fictitious connecting segments', () => {
  const data = { count: 2, offsets: new Uint32Array([0, 2, 4]), points: new Float32Array([0, 0, 0, 1, 0, 0, 10, 10, 10, 10, 11, 10]) };
  const segments = segmentData(data);
  assert.deepEqual([...segments.positions], [...data.points]);
  assert.deepEqual(segments.ends, [2, 4]);
  assert.deepEqual([...segments.colors], [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0]);
});

test('corrupt streamline headers, offsets, values and truncation are rejected', () => {
  const compressed = read(`public/tractography/${manifest.bundles[0].file}`);
  const valid = gunzipSync(compressed);
  assert.throws(() => decode(valid.subarray(0, 12)));
  const version = Buffer.from(valid); version.writeUInt32LE(9, 4); assert.throws(() => decode(version));
  const offset = Buffer.from(valid); offset.writeUInt32LE(1, 16); assert.throws(() => decode(offset));
  const nan = Buffer.from(valid); nan.writeFloatLE(NaN, 16 + (nan.readUInt32LE(8) + 1) * 4); assert.throws(() => decode(nan));
});

test('streamline picking uses a half-millimetre tolerance after the display coordinate transform', () => {
  const data = { count: 1, offsets: new Uint32Array([0, 2]), points: new Float32Array([-10, 0, 0, 10, 0, 0]) };
  const { geometry } = streamlineGeometry(data);
  const material = new T.LineBasicMaterial();
  const line = new T.LineSegments(geometry, material);
  line.updateMatrixWorld(true);
  const ray = new T.Raycaster(new T.Vector3(0, 0.4 * 0.018, 1), new T.Vector3(0, 0, -1));
  ray.params.Line.threshold = 0.5 * 0.018;
  assert.equal(ray.intersectObject(line).length, 1);
  ray.ray.origin.y = 0.7 * 0.018;
  assert.equal(ray.intersectObject(line).length, 0);
  geometry.dispose(); material.dispose();
});
