import { KNOWLEDGE, tractKnowledge } from './knowledge.js';

const labels = {
  AF: 'Arcuate fasciculus', FAT: 'Frontal aslant tract', IFOF: 'Inferior fronto-occipital fasciculus',
  ILF: 'Inferior longitudinal fasciculus', MdLF: 'Middle longitudinal fasciculus', UF: 'Uncinate fasciculus',
  SLF1: 'Superior longitudinal fasciculus I', SLF2: 'Superior longitudinal fasciculus II', SLF3: 'Superior longitudinal fasciculus III',
  AC: 'Anterior commissure', CC: 'Corpus callosum', AR: 'Acoustic radiation', CBT: 'Corticobulbar tract',
  CPT_F: 'Corticopontine tract (frontal)', CPT_P: 'Corticopontine tract (parietal)', CPT_O: 'Corticopontine tract (occipital)',
  CST: 'Corticospinal tract', CS_A: 'Corticostriatal tract (anterior)', CS_P: 'Corticostriatal tract (posterior)', CS_S: 'Corticostriatal tract (superior)',
  DRTT: 'Dentatorubrothalamic tract', F: 'Fornix', ICP: 'Inferior cerebellar peduncle', MCP: 'Middle cerebellar peduncle', SCP: 'Superior cerebellar peduncle',
  ML: 'Medial lemniscus', OR: 'Optic radiation', RST: 'Reticulospinal tract',
  TR_A: 'Anterior thalamic radiation', TR_P: 'Posterior thalamic radiation', TR_S: 'Superior thalamic radiation',
};
const tableCodes = { SLF_I: 'SLF1', SLF_II: 'SLF2', SLF_III: 'SLF3', CStr_A: 'CS_A', CStr_P: 'CS_P', CStr_S: 'CS_S', CTh_A: 'TR_A', CTh_P: 'TR_P', CTh_S: 'TR_S' };

export function bundleForTract(tract, bundles) {
  const code = tableCodes[tract.code] || tract.code;
  return bundles.find(b => b.code === code && b.side === tract.side) || null;
}

export function makeCatalogue(manifest, parts, connectome) {
  return manifest.bundles.map(bundle => {
    const knowledge = KNOWLEDGE[labels[bundle.code]] || tractKnowledge({ code: bundle.code });
    if (!knowledge) throw new Error(`Missing streamline terminology: ${bundle.code}`);
    const matchedParts = parts.filter(p => p.label === labels[bundle.code] && (p.side === bundle.side || ['median', 'both'].includes(bundle.side)));
    const tract = connectome.tracts.find(t => bundleForTract(t, [bundle]));
    return { ...bundle, ...knowledge, modelNodeId: matchedParts[0]?.id ?? null, modelNodeIds: matchedParts.map(p => p.id), tractId: tract?.id ?? null };
  });
}

export function decodeStreamlines(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength < 20 || view.getUint32(0, true) !== 0x54534142 || view.getUint32(4, true) !== 1) throw new Error('Invalid streamline format');
  const count = view.getUint32(8, true), pointCount = view.getUint32(12, true);
  const start = 16 + (count + 1) * 4;
  if (!count || start + pointCount * 12 !== buffer.byteLength) throw new Error('Invalid streamline length');
  const offsets = new Uint32Array(buffer, 16, count + 1);
  const points = new Float32Array(buffer, start, pointCount * 3);
  if (offsets[0] !== 0 || offsets[count] !== pointCount) throw new Error('Invalid streamline offsets');
  for (let i = 0; i < count; i++) if (offsets[i + 1] - offsets[i] < 2 || offsets[i + 1] > pointCount) throw new Error('Invalid streamline range');
  if (!points.every(Number.isFinite)) throw new Error('Invalid streamline coordinates');
  return { count, pointCount, offsets, points };
}

export function directionRGB(dx, dy, dz) {
  const length = Math.hypot(dx, dy, dz) || 1;
  return [Math.abs(dx) / length, Math.abs(dy) / length, Math.abs(dz) / length];
}

export function segmentData(data, first = 0, count = data.count) {
  const segments = data.offsets[first + count] - data.offsets[first] - count;
  const positions = new Float32Array(segments * 6), colors = new Float32Array(segments * 6), ends = [];
  let output = 0;
  for (let line = first; line < first + count; line++) {
    for (let i = data.offsets[line]; i < data.offsets[line + 1] - 1; i++) {
      const a = i * 3, b = a + 3;
      const color = directionRGB(data.points[b] - data.points[a], data.points[b + 1] - data.points[a + 1], data.points[b + 2] - data.points[a + 2]);
      for (const point of [a, b]) {
        positions.set(data.points.subarray(point, point + 3), output);
        colors.set(color, output);
        output += 3;
      }
    }
    ends.push(output / 3);
  }
  return { positions, colors, ends };
}
