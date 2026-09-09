"""Compare every exported value to the pinned local GIFTI/CIFTI source."""
from pathlib import Path
import sys
import json
import hashlib

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'reference/py'))
import nibabel as nib
import numpy as np

src = ROOT / 'reference/hcp-functional'
manifest = json.loads((ROOT / 'public/functional/manifest.json').read_text())
raw = (ROOT / 'public/functional/cortex.bin').read_bytes()
for source in manifest['sources']:
    assert hashlib.sha256((src / source['file']).read_bytes()).hexdigest() == source['sha256']
image = nib.load(src / manifest['sources'][0]['file'])
for name, slc, model in image.header.get_axis(1).iter_structures():
    if 'CORTEX' not in name:
        continue
    side, letter = ('left', 'L') if name.endswith('LEFT') else ('right', 'R')
    surface = next(s for s in manifest['surfaces'] if s['side'] == side)
    original = nib.load(src / f'S1200.{letter}.pial_MSMAll.32k_fs_LR.surf.gii')
    positions = np.frombuffer(raw, dtype='<f4', count=surface['vertexCount'] * 3, offset=surface['positions']).reshape(-1, 3)
    indices = np.frombuffer(raw, dtype='<u4', count=surface['indexCount'], offset=surface['indices']).reshape(-1, 3)
    labels = np.frombuffer(raw, dtype='<u4', count=surface['vertexCount'], offset=surface['labels'])
    np.testing.assert_array_equal(positions, original.agg_data('pointset'))
    np.testing.assert_array_equal(indices, original.agg_data('triangle'))
    np.testing.assert_array_equal(labels[model.vertex], np.asarray(image.dataobj)[0, slc])
    excluded = np.ones(surface['vertexCount'], dtype=bool)
    excluded[model.vertex] = False
    assert not labels[excluded].any()
    print(f'PASS: {side}: every coordinate, face, cortical label and medial-wall exclusion matches source.')
