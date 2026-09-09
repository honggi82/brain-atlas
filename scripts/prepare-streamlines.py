"""Deterministically subset original TRK trajectories in native RAS millimetres."""
import gzip
import hashlib
import io
import json
from pathlib import Path
import struct
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'reference/py'))
import nibabel as nib
import numpy as np

SOURCE_HASH = '344aad4394f18b8926ed5e1bda911ad56e328c6cf75faa45e1302512ad779c67'
CODES = set('AF FAT IFOF ILF MdLF SLF1 SLF2 SLF3 UF VOF C_FP C_FPH C_PHP C_PH AC CC AR CBT CPT_F CPT_O CPT_P CST CS_A CS_P CS_S DRTT F ICP MCP SCP ML OR RST TR_A TR_P TR_S'.split())
LIMIT = 2000
OVERVIEW = 80
TOLERANCE = 0.25


def simplify(points):
    keep = {0, len(points) - 1}
    pending = [(0, len(points) - 1)]
    while pending:
        first, last = pending.pop()
        if last - first < 2:
            continue
        start, end = points[first], points[last]
        direction = end - start
        squared_length = np.dot(direction, direction)
        section = points[first + 1:last] - start
        fractions = np.clip(section @ direction / squared_length, 0, 1) if squared_length else np.zeros(len(section))
        errors = np.linalg.norm(section - fractions[:, None] * direction, axis=1)
        offset = int(np.argmax(errors))
        if errors[offset] > TOLERANCE:
            pivot = first + 1 + offset
            keep.add(pivot)
            pending.extend([(first, pivot), (pivot, last)])
    return points[sorted(keep)].astype('<f4')


def pack(lines):
    offsets = np.cumsum([0] + [len(line) for line in lines], dtype=np.uint32)
    return struct.pack('<4sIII', b'BAST', 1, len(lines), int(offsets[-1])) + offsets.astype('<u4').tobytes() + np.concatenate(lines).astype('<f4').tobytes()


def main():
    source = ROOT / 'reference/hcp1065_avg_tracts_trk.zip'
    digest = hashlib.sha256()
    with source.open('rb') as stream:
        while block := stream.read(4 * 1024 * 1024):
            digest.update(block)
    if digest.hexdigest() != SOURCE_HASH:
        raise ValueError('Source archive checksum mismatch')
    out = ROOT / 'public/tractography'
    out.mkdir(exist_ok=True)
    entries, overview_lines = [], []
    with zipfile.ZipFile(source) as archive:
        for path in sorted(archive.namelist()):
            if not path.endswith('.trk.gz'):
                continue
            stem = Path(path).name.removesuffix('.trk.gz')
            code = stem[:-2] if stem.endswith(('_L', '_R')) else stem
            if code not in CODES:
                continue
            side = {'L': 'left', 'R': 'right'}.get(stem[-1], 'median') if stem.endswith(('_L', '_R')) else 'median'
            if code in {'MCP', 'SCP'}:
                side = 'both'
            compressed = archive.read(path)
            trk = nib.streamlines.load(io.BytesIO(gzip.decompress(compressed)), lazy_load=True)
            count = int(trk.header['nb_streamlines'])
            if not count or not np.isfinite(trk.header['voxel_to_rasmm']).all():
                raise ValueError(f'Invalid TRK header: {path}')
            seed = int(hashlib.sha256(path.encode()).hexdigest()[:8], 16)
            indices = np.random.default_rng(seed).permutation(count)[:min(LIMIT, count)]
            slots = {int(index): slot for slot, index in enumerate(indices)}
            selected = [None] * len(indices)
            source_point_count = 0
            seen = 0
            for index, line in enumerate(trk.streamlines):
                seen += 1
                if index not in slots:
                    continue
                if len(line) < 2 or not np.isfinite(line).all():
                    raise ValueError(f'Invalid selected streamline: {path} #{index}')
                source_point_count += len(line)
                selected[slots[index]] = simplify(line)
            if seen != count or any(line is None for line in selected):
                raise ValueError(f'TRK count mismatch: {path}')
            binary = pack(selected)
            payload = gzip.compress(binary, compresslevel=9, mtime=0)
            filename = stem + '.bin.gz'
            (out / filename).write_bytes(payload)
            overview_start = len(overview_lines)
            overview_lines.extend(selected[:OVERVIEW])
            points = np.concatenate(selected)
            entries.append({
                'id': stem, 'code': code, 'side': side, 'group': path.split('/')[0],
                'sourceFile': path, 'sourceFileSha256': hashlib.sha256(compressed).hexdigest(),
                'sourceCount': count, 'count': len(selected), 'sourceIndices': indices.tolist(),
                'selectedOriginalPointCount': source_point_count, 'pointCount': len(points),
                'file': filename, 'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest(),
                'boundsRAS': [points.min(axis=0).tolist(), points.max(axis=0).tolist()],
                'overviewStart': overview_start, 'overviewCount': min(OVERVIEW, len(selected)),
                'voxelOrder': trk.header['voxel_order'].decode(),
                'voxelToRASmm': trk.header['voxel_to_rasmm'].tolist(),
            })
            print(f'{stem}: {count} -> {len(selected)} streamlines, {len(points)} points, {len(payload)} bytes', flush=True)
    overview = gzip.compress(pack(overview_lines), compresslevel=9, mtime=0)
    (out / 'overview.bin.gz').write_bytes(overview)
    metadata = {
        'version': 1, 'sourceUrl': 'https://brain.labsolver.org/hcp_trk_atlas.html',
        'archiveUrl': 'https://github.com/data-others/atlas/releases/download/hcp1065/hcp1065_avg_tracts_trk.zip',
        'archiveSha256': SOURCE_HASH, 'license': 'CC-BY-SA-4.0',
        'coordinateSpace': 'ICBM 2009a Nonlinear Asymmetric, RAS+ millimetres',
        'parser': f'NiBabel {nib.__version__}; TrackVis voxel-mm to RAS+ mm including half-voxel convention',
        'selection': f'PCG64 permutation seeded by first 32 SHA256 bits of archive path; at most {LIMIT} original streamlines per bundle',
        'simplification': {'method': 'Ramer-Douglas-Peucker; original vertices only', 'maximumDeviationMm': TOLERANCE},
        'overview': {'file': 'overview.bin.gz', 'count': len(overview_lines), 'sha256': hashlib.sha256(overview).hexdigest(), 'bytes': len(overview)},
        'bundles': entries,
    }
    (out / 'manifest.json').write_text(json.dumps(metadata, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f'Prepared {len(entries)} bundles, {sum(e["count"] for e in entries)} detail streamlines, {len(overview_lines)} overview streamlines.', flush=True)


if __name__ == '__main__':
    main()
