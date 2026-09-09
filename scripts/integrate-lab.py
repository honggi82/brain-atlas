"""Prepare the validated Pages build inside the lab's shared navigation shell."""
import argparse
from pathlib import Path
import re
import shutil

parser = argparse.ArgumentParser()
parser.add_argument('site', type=Path)
args = parser.parse_args()
site = args.site.resolve()
atlas = Path(__file__).resolve().parents[1]
stamp = '.bak-20260910-shell'

def write(path, text):
    raw = path.read_bytes() if path.exists() else b''
    backup = path.with_name(path.name + stamp)
    if raw and not backup.exists():
        backup.write_bytes(raw)
    data = text.replace('\r\n', '\n')
    if b'\r\n' in raw:
        data = data.replace('\n', '\r\n')
    path.write_bytes(data.encode('utf-8'))
    assert not re.search(r'[\uFFFD\u3000]|\?{3}|\r\r\n', path.read_bytes().decode('utf-8')), path

for path in site.glob('*.html'):
    text = path.read_text(encoding='utf-8')
    match = re.search(r'<nav\b[\s\S]*?</nav>', text)
    assert match
    nav = match.group(0)
    nav = re.sub(r'\s*<a href="about_brain/">뇌 해부도</a>', '', nav)
    nav, count = re.subn(r'(<a href="about.html"[^>]*>)(?:소개|연구 분야)(</a>)', r'\1연구 분야\2<a href="about_brain/">뇌 해부도</a>', nav)
    assert count == 1
    text = text[:match.start()] + nav + text[match.end():]
    text = text.replace('site.js?v=20260910-brain-atlas', 'site.js?v=20260910-lab-shell')
    write(path, text)

path = site / 'assets/js/i18n.js'
text = path.read_text(encoding='utf-8')
if '"연구 분야":' not in text:
    text = text.replace('var translations = {', 'var translations = {\n  "연구 분야": "Research Areas",', 1)
if '"뇌 해부도로 이동":' not in text:
    text = text.replace('var translations = {', 'var translations = {\n  "뇌 해부도로 이동": "Skip to brain atlas",\n  "뇌 해부도 — BRAIN Lab.": "Brain Atlas — BRAIN Lab.",', 1)
write(path, text)
path = site / 'assets/js/site.js'
text = path.read_text(encoding='utf-8').replace('i18n.js?v=20260910-brain-atlas', 'i18n.js?v=20260910-lab-shell')
text = text.replace("script.src = 'assets/js/i18n.js?v=20260910-lab-shell';", "script.src = new URL('i18n.js?v=20260910-lab-shell', document.currentScript.src).href;")
write(path, text)

output = atlas / 'dist-pages'
destination = site / 'about_brain'
assert (output / 'index.html').is_file() and destination.is_dir()
for source in output.rglob('*'):
    if not source.is_file():
        continue
    assert '.bak-' not in source.name and source.suffix != '.map'
    relative = source.relative_to(output)
    target = destination / ('viewer.html' if str(relative) == 'index.html' else relative)
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists() and target.read_bytes() != source.read_bytes():
        # Public output must not include local backup files.
        backup = atlas / 'test-results' / ('shell-' + target.name + stamp)
        if not backup.exists():
            backup.write_bytes(target.read_bytes())
    shutil.copyfile(source, target)

home = (site / 'index.html').read_text(encoding='utf-8')
header = re.search(r'<header class="site-header">[\s\S]*?</header>', home).group(0)
header = header.replace(' class="is-active"', '').replace('href="about_brain/"', 'href="about_brain/" class="is-active" aria-current="page"')
header = re.sub(r'(href|src)="(?!https:|data:|#)([^"]+)"', r'\1="../\2"', header)
shell = '''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>뇌 해부도 — BRAIN Lab.</title>
<link rel="stylesheet" href="../assets/css/site.css?v=20260831-equipment">
<link rel="stylesheet" href="lab-shell.css?v=20260910-shell">
<link rel="icon" href="favicon.svg">
</head>
<body>
<a class="skip" href="#atlas-frame">뇌 해부도로 이동</a>
HEADER
<main id="main" class="atlas-page">
<iframe id="atlas-frame" src="viewer.html?embed=lab" title="Brain Atlas — interactive anatomy" allow="fullscreen"></iframe>
</main>
<script src="../assets/js/site.js?v=20260910-lab-shell"></script>
<script src="lab-shell.js?v=20260910-shell"></script>
</body>
</html>
'''.replace('HEADER', header)
index = destination / 'index.html'
backup = atlas / 'test-results' / ('pages-index.html' + stamp)
if not backup.exists():
    backup.write_bytes(index.read_bytes())
# Keep the previous standalone page outside the published directory.
index.write_bytes(shell.encode('utf-8'))
assert not re.search(r'[\uFFFD\u3000]|\?{3}', index.read_text(encoding='utf-8'))
print('Updated navigation on 10 pages and prepared the shared atlas shell.')
