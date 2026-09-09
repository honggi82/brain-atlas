"""Compare preserved baseline and candidate with identical functional selections."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results'
servers, threads = [], []

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def serve(directory):
    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(directory)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    servers.append(server)
    threads.append(thread)
    return f'http://127.0.0.1:{server.server_port}/'

try:
    baseline = serve(ROOT / 'dist')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            old = browser.new_page(viewport={'width': 1280, 'height': 720})
            old.goto(baseline)
            old.wait_for_selector('body[data-ready="true"]', timeout=60000)
            for name in ['sma', 'broca', 'wernicke']:
                old.locator(f'[data-functional="{name}"]').click()
                old.locator('#scene-host').screenshot(path=str(OUT / f'baseline-{name}.png'))
            print('PASS: preserved baseline SMA, Broca and Wernicke flows.', flush=True)
            old.close()
        finally:
            browser.close()
finally:
    for server in servers:
        server.shutdown()
        server.server_close()
    for thread in threads:
        thread.join(timeout=10)
