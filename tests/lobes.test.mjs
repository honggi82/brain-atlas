import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LOBES, lobeForPart, partsInLobe } from '../src/lobes.js';
import { partName, partSummary, setLanguage } from '../src/i18n.js';

const parts = JSON.parse(fs.readFileSync(new URL('../public/models/parts.json', import.meta.url)));

test('lobe groups cover every cortical part once, preserving source regions and boundaries', () => {
  const ids = LOBES.flatMap(l => partsInLobe(parts, l.id).map(p => p.id));
  assert.equal(ids.length, 128);
  assert.equal(new Set(ids).size, 128);
  for (const part of parts) {
    assert.equal(Boolean(lobeForPart(part)), part.category === 'cortex');
    if (part.category === 'cortex') assert.equal(lobeForPart(part).region, part.region);
  }
  assert.equal(lobeForPart(parts.find(p => p.id === 56)).id, 'boundaries');
  assert.equal(lobeForPart(parts.find(p => p.id === 122)).id, 'limbic');
  assert.equal(lobeForPart(parts.find(p => p.id === 190)).id, 'temporal');
  assert.equal(partsInLobe(parts, 'insula').length, 2);
});

test('lobe colours are distinct; both languages have names, locations and sourced functions', () => {
  assert.equal(new Set(LOBES.map(l => l.color)).size, LOBES.length);
  for (const lobe of LOBES) {
    assert.match(lobe.color, /^#[0-9a-f]{6}$/);
    assert.ok(lobe.location && lobe.locationEn && lobe.source.url.startsWith('https://'));
    setLanguage('ko');
    assert.equal(partName(lobe), `${lobe.ko} (${lobe.en})`);
    assert.match(partSummary(lobe), /[가-힣]/);
    setLanguage('en');
    assert.equal(partName(lobe), lobe.en);
    assert.doesNotMatch(partSummary(lobe), /[가-힣]/);
  }
  setLanguage('ko');
});
