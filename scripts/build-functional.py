"""Export native fs_LR32k HCP cortical coordinates and labels; no registration.

Run with numpy and nibabel installed. The five source files must be in
reference/hcp-functional. See the exported manifest for pinned source URLs.
"""
from pathlib import Path
import csv
import hashlib
import json
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'reference/py'))
import nibabel as nib
import numpy as np

REV = 'e4ea9fd709ead8616843924b717c6abce62ea05c'
BASE = f'https://raw.githubusercontent.com/ColeLab/ColeAnticevicNetPartition/{REV}/'
SRC = ROOT / 'reference/hcp-functional'
OUT = ROOT / 'public/functional'
OUT.mkdir(exist_ok=True)
label_file = 'CortexSubcortex_ColeAnticevic_NetPartition_wSubcorGSR_parcels_LR.dlabel.nii'
key_file = 'CortexSubcortex_ColeAnticevic_NetPartition_wSubcorGSR_parcels_LR_LabelKey.txt'
rows = list(csv.DictReader((SRC / key_file).open(), delimiter='\t'))
parcels = {int(r['KEYVALUE']): r['GLASSERLABELNAME'] for r in rows
           if r['GLASSERLABELNAME'].endswith('_ROI')}
assert len(parcels) == 360
image = nib.load(SRC / label_file)
values = np.asarray(image.dataobj)[0]
table = image.header.get_axis(0).label[0]
chunks, surfaces, offset = [], [], 0
files = [label_file, key_file, 'LICENSE']

def append(array):
    global offset
    position = offset
    raw = array.tobytes()
    chunks.append(raw)
    offset += len(raw)
    return position

for name, slc, model in image.header.get_axis(1).iter_structures():
    if name not in ('CIFTI_STRUCTURE_CORTEX_LEFT', 'CIFTI_STRUCTURE_CORTEX_RIGHT'):
        continue
    side, letter = ('left', 'L') if name.endswith('LEFT') else ('right', 'R')
    filename = f'S1200.{letter}.pial_MSMAll.32k_fs_LR.surf.gii'
    files.append(filename)
    surface = nib.load(SRC / filename)
    positions = np.asarray(surface.agg_data('pointset'), dtype='<f4')
    indices = np.asarray(surface.agg_data('triangle'), dtype='<u4')
    assert len(positions) == model.nvertices[name] == 32492
    assert indices.max() < len(positions) and np.isfinite(positions).all()
    labels = np.zeros(len(positions), dtype='<u4')
    labels[model.vertex] = values[slc].astype('<u4')
    ids = sorted(set(labels.tolist()) - {0})
    assert len(ids) == 180
    for key in ids:
        assert parcels[key].startswith(letter + '_')
        row = next(r for r in rows if int(r['KEYVALUE']) == key)
        assert table[key][0] == row['LABEL']
    surfaces.append(dict(side=side, vertexCount=len(positions), indexCount=indices.size,
                         positions=append(positions), indices=append(indices), labels=append(labels),
                         parcels=[dict(id=k, name=parcels[k][2:-4], vertices=int((labels == k).sum()),
                                       centroidRAS=positions[labels == k].mean(0).tolist()) for k in ids]))

raw = b''.join(chunks)
(OUT / 'cortex.bin').write_bytes(raw)
manifest = dict(schema=1, atlas='HCP-MMP1.0', surface='HCP S1200 pial MSMAll fs_LR32k',
                coordinates='Native source RAS millimetres; no spatial registration or resampling',
                revision=REV, sha256=hashlib.sha256(raw).hexdigest(), surfaces=surfaces,
                sources=[dict(file=f, url=BASE + f, sha256=hashlib.sha256((SRC / f).read_bytes()).hexdigest()) for f in files])
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
shutil.copy2(SRC / 'LICENSE', OUT / 'LICENSE.txt')
shutil.copy2(Path(__file__), OUT / 'build-functional.py')
print(f'Exported {len(surfaces)} surfaces, 360 parcels, {len(raw):,} bytes; {manifest["sha256"]}')
