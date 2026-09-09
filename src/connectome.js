export function connectionsForTract(data, tractId, threshold = 0, query = '') {
  const tract = data.tracts.find(t => t.id === tractId);
  if (!tract) return [];
  return data.regions.map((region, i) => ({ region, probability: data.values[i][tract.columnIndex] }))
    .filter(r => r.probability >= threshold && r.region.id.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.probability - a.probability || a.region.rowIndex - b.region.rowIndex);
}

export function connectionsForRegion(data, regionId, side) {
  const region = data.regions.find(r => r.id === regionId);
  if (!region) return [];
  return data.tracts.filter(t => t.side === side).map(tract => ({ tract, probability: data.values[region.rowIndex][tract.columnIndex] }))
    .sort((a, b) => b.probability - a.probability);
}

export function percent(value) { return `${(value * 100).toFixed(1)}%`; }
