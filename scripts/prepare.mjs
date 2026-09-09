import fs from 'node:fs';
import { KNOWLEDGE, CATEGORIES } from '../src/knowledge.js';
const manifest = JSON.parse(fs.readFileSync('public/models/manifest.json', 'utf8'));
const parts = manifest.nodes.filter(n => CATEGORIES[n.category]).map(n => {
  if (!KNOWLEDGE[n.label]) throw new Error(`Missing knowledge: ${n.label}`);
  const correctedPeduncle = n.label === 'Base of peduncle';
  return { id: n.id, label: n.label, category: correctedPeduncle ? 'brainstem' : n.category, side: n.side, region: correctedPeduncle ? 'Midbrain' : n.region,
    sourceCategory: n.category,
    source: n.source, parent: n.parent ?? null, ...KNOWLEDGE[n.label] };
});
fs.writeFileSync('public/models/parts.json', JSON.stringify(parts), 'utf8');
console.log(`Prepared ${parts.length} selectable structures / ${new Set(parts.map(p => p.label)).size} unique labels.`);
