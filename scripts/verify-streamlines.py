"""Independently compare eight deterministic browser samples per bundle to source TRK."""
import gzip
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


def main():
    manifest = json.loads((ROOT / 'public/tractography/manifest.json').read_text(encoding='utf-8'))
    checked = 0
    max_deviation = 0
    with zipfile.ZipFile(ROOT / 'reference/hcp1065_avg_tracts_trk.zip') as archive:
        for bundle in manifest['bundles']:
            data = gzip.decompress((ROOT / 'public/tractography' / bundle['file']).read_bytes())
            _, _, count, _ = struct.unpack_from('<4sIII', data)
            offsets = np.frombuffer(data, '<u4', count + 1, 16)
            points = np.frombuffer(data, '<f4', offset=16 + (count + 1) * 4).reshape(-1, 3)
            chosen = np.linspace(0, count - 1, min(8, count), dtype=int)
            targets = {bundle['sourceIndices'][slot]: slot for slot in chosen}
            trk = nib.streamlines.load(io.BytesIO(gzip.decompress(archive.read(bundle['sourceFile']))), lazy_load=True)
            for source_index, original in enumerate(trk.streamlines):
                if source_index not in targets:
                    continue
                slot = targets[source_index]
                reduced = points[offsets[slot]:offsets[slot + 1]]
                assert np.array_equal(original[0], reduced[0]) and np.array_equal(original[-1], reduced[-1])
                cursor = 0
                for segment, (a, b) in enumerate(zip(reduced[:-1], reduced[1:])):
                    matches = np.flatnonzero(np.all(original[cursor + 1:] == b, axis=1))
                    assert len(matches), (bundle['id'], source_index, 'invented or reordered vertex')
                    # TRK files can repeat the terminal coordinate; verify the entire final segment.
                    end = len(original) - 1 if segment == len(reduced) - 2 else cursor + 1 + matches[0]
                    section, direction = original[cursor:end + 1] - a, b - a
                    length = np.dot(direction, direction)
                    fractions = np.clip(section @ direction / length, 0, 1) if length else np.zeros(len(section))
                    error = float(np.max(np.linalg.norm(section - fractions[:, None] * direction, axis=1)))
                    assert error <= 0.25002, (bundle['id'], source_index, error)
                    max_deviation = max(max_deviation, error)
                    cursor = end
                assert cursor == len(original) - 1, (bundle['id'], source_index, cursor, len(original), original[cursor:].tolist())
                checked += 1
            print(f'{bundle["id"]}: {len(targets)} original trajectories checked', flush=True)
    assert checked == 68 * 8
    print(f'PASS: {checked} source trajectories, all original vertices and endpoints; maximum deviation {max_deviation:.6f} mm', flush=True)


if __name__ == '__main__':
    main()
