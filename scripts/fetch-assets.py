"""Fetch pinned public anatomy assets; no credentials or paid services."""
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
REV = '2929e94f521a8ddceab26bc100a98dc06b0da060'
BASE = f'https://raw.githubusercontent.com/itayinbarr/brainproject/{REV}/'
FILES = {
    'brain-atlas/models/brain.glb': 'public/models/brain.glb',
    'brain-atlas/models/manifest.json': 'public/models/manifest.json',
    'brain-atlas/data.js': 'reference/data.js',
    'brain-atlas/scene.js': 'reference/scene.js',
    'LICENSE': 'public/licenses/brainproject.txt',
    'docs/registration.md': 'reference/registration.md',
}

def main():
    lock = json.loads((ROOT / 'public/data/asset-lock.json').read_text(encoding='utf-8'))
    checksums = {}
    for remote, local in FILES.items():
        destination = ROOT / local
        if destination.exists():
            data = destination.read_bytes()
        else:
            with urllib.request.urlopen(BASE + remote, timeout=60) as response:
                data = response.read()
            if hashlib.sha256(data).hexdigest() != lock['sha256'][local]:
                raise ValueError(f'Checksum mismatch: {remote}')
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
        checksums[local] = hashlib.sha256(data).hexdigest()
        if checksums[local] != lock['sha256'][local]:
            raise ValueError(f'Existing file differs from the pinned source: {local}')
        print(local, len(data))
    (ROOT / 'reference' / 'asset-lock.json').write_text(
        json.dumps({'repository': 'itayinbarr/brainproject', 'revision': REV,
                    'sha256': checksums}, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
