"""Extract labelled BodyParts3D insulae and align shared, unchanged structures."""
import argparse
import hashlib
import json
from pathlib import Path
import struct

import numpy as np

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('human_atlas', type=Path)
args = parser.parse_args()
source = args.human_atlas.resolve() / 'public/models'
atlas_raw = (source / 'atlas.json').read_bytes()
atlas = json.loads(atlas_raw)
raw = (root / 'public/models/brain.glb').read_bytes()
glb = json.loads(raw[20:20 + struct.unpack_from('<I', raw, 12)[0]])
nodes = {n.get('extras', {}).get('bx_id'): n for n in glb['nodes']}
assert all(not any(k in n for k in ['translation', 'rotation', 'scale', 'matrix']) for n in glb['nodes'])

def centre(node_id):
    node = nodes[node_id]
    a = [glb['accessors'][p['attributes']['POSITION']] for p in glb['meshes'][node['mesh']]['primitives']]
    return (np.min([p['min'] for p in a], axis=0) + np.max([p['max'] for p in a], axis=0)) / 2

def source_part(source_id):
    return next(p for p in atlas['parts'] if p['id'] == source_id)

anchors = [(49, 'FJ1754'), (50, 'FJ1802'), (325, 'FJ1776'), (326, 'FJ1823'), (122, 'FJ1759'), (123, 'FJ1807')]
offsets = [centre(node_id) - np.mean(source_part(source_id)['bounds'], axis=0) for node_id, source_id in anchors]
translation = np.mean(offsets, axis=0)
controls = [(173, 'FJ1767'), (174, 'FJ1814'), (247, 'FJ1773'), (248, 'FJ1820'), (340, 'FJ1778')]
validation = [{'nodeId': n, 'sourceId': s, 'residualMm': float(np.linalg.norm(centre(n) - (np.mean(source_part(s)['bounds'], axis=0) + translation)) * 1000)} for n, s in controls]
assert max(p['residualMm'] for p in validation) < 1.0
binary = bytearray()
parts = []
for node_id, source_id, fma, side in [(1001, 'FJ1748', 'FMA72978', 'left'), (1002, 'FJ1749', 'FMA72977', 'right')]:
    p = source_part(source_id)
    assert p['conceptId'] == fma and p['name'].lower() == side + ' insula'
    chunk = (source / Path(atlas['chunks'][p['chunk']]['url']).name).read_bytes()
    vertices = np.frombuffer(chunk, dtype='<f4', count=p['vertexCount'] * 3, offset=p['positions']).reshape(-1, 3)
    indices = np.frombuffer(chunk, dtype='<u4', count=p['indexCount'], offset=p['indices'])
    assert np.isfinite(vertices).all() and indices.max() < len(vertices) and len(indices) % 3 == 0
    aligned = (vertices + translation).astype('<f4')
    position_offset = len(binary)
    binary.extend(aligned.tobytes())
    index_offset = len(binary)
    binary.extend(indices.tobytes())
    lo, hi = aligned.min(axis=0), aligned.max(axis=0)
    assert (lo[0] > 0) if side == 'left' else (hi[0] < 0)
    parts.append({'id': node_id, 'label': 'Insula', 'category': 'cortex', 'side': side, 'region': 'Insula',
                  'source': 'BodyParts3D 4.0 / Human Atlas', 'sourceId': source_id, 'fma': fma,
                  'geometryFile': 'insula.bin', 'positions': position_offset, 'indices': index_offset,
                  'vertexCount': len(vertices), 'indexCount': len(indices), 'bounds': [lo.tolist(), hi.tolist()],
                  'sourceChunkSha256': hashlib.sha256(chunk).hexdigest()})
manifest = {'repository': 'ashemag/human-atlas', 'revision': '1c38bf35c254a891200d3cedecfd57abebe83d8d',
            'sourceAtlasSha256': hashlib.sha256(atlas_raw).hexdigest(), 'file': 'insula.bin',
            'sha256': hashlib.sha256(binary).hexdigest(), 'parts': parts,
            'registration': {'method': 'Translation only, mean of six bilateral deep-structure bounding-box centres; no scaling or invented surface.',
                             'translationMetres': translation.tolist(), 'anchors': anchors, 'heldOutControls': validation}}
(root / 'public/models/insula.bin').write_bytes(binary)
(root / 'public/models/insula.json').write_bytes((json.dumps(manifest, indent=2) + '\n').encode('utf-8'))
print('Added two source-labelled insula meshes:', len(binary), 'bytes; maximum held-out landmark residual:', round(max(p['residualMm'] for p in validation), 3), 'mm.')
