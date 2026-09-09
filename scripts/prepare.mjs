import fs from 'node:fs';
import { KNOWLEDGE, CATEGORIES } from '../src/knowledge.js';
const manifest = JSON.parse(fs.readFileSync('public/models/manifest.json', 'utf8'));
const parts = manifest.nodes.filter(n => CATEGORIES[n.category]).map(n => {
  const correctedPeduncle = n.label === 'Base of peduncle';
  const correctedSubcentral = n.label === 'Insula (Subcentral gyrus and ant. and post. sulci)';
  const label = correctedSubcentral ? 'Subcentral gyrus and sulci' : n.label;
  if (!KNOWLEDGE[label]) throw new Error(`Missing knowledge: ${label}`);
  return { id: n.id, label, sourceLabel: n.label, category: correctedPeduncle ? 'brainstem' : n.category, side: n.side, region: correctedPeduncle ? 'Midbrain' : correctedSubcentral ? 'Telencephalon' : n.region,
    sourceCategory: n.category,
    source: n.source, parent: n.parent ?? null, ...KNOWLEDGE[label] };
});
const insula = JSON.parse(fs.readFileSync('public/models/insula.json', 'utf8'));
parts.push(...insula.parts.map(p => ({ ...p, sourceCategory: p.category, parent: null, ...KNOWLEDGE[p.label] })));
fs.writeFileSync('public/models/parts.json', JSON.stringify(parts), 'utf8');
console.log(`Prepared ${parts.length} selectable structures / ${new Set(parts.map(p => p.label)).size} unique labels.`);
