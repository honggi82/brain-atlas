"""Download the public, population-averaged HCP1065 streamline archive."""
import hashlib
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://github.com/data-others/atlas/releases/download/hcp1065/hcp1065_avg_tracts_trk.zip'
SIZE = 587869457
SHA256 = '344aad4394f18b8926ed5e1bda911ad56e328c6cf75faa45e1302512ad779c67'


def main():
    target = ROOT / 'reference/hcp1065_avg_tracts_trk.zip'
    target.parent.mkdir(exist_ok=True)
    if not target.exists():
        request = urllib.request.Request(URL + '?download=1', headers={'User-Agent': 'Brain-Atlas-data-preparation'})
        temporary = target.with_suffix('.part')
        with urllib.request.urlopen(request, timeout=60) as response, temporary.open('wb') as output:
            total = 0
            while block := response.read(4 * 1024 * 1024):
                output.write(block)
                total += len(block)
                if total % (64 * 1024 * 1024) == 0:
                    print(f'Downloaded {total // 1048576} MiB', flush=True)
        if temporary.stat().st_size != SIZE:
            raise ValueError('Unexpected source archive size')
        temporary.replace(target)
    hasher = hashlib.sha256()
    with target.open('rb') as source:
        while block := source.read(4 * 1024 * 1024):
            hasher.update(block)
    digest = hasher.hexdigest()
    if digest != SHA256:
        raise ValueError('Source archive checksum mismatch')
    print(f'Archive: {target.stat().st_size} bytes; SHA256 {digest}', flush=True)


if __name__ == '__main__':
    main()
