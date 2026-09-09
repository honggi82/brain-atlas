"""Exercise lab navigation and the atlas under the GitHub Pages URL prefix."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright
from unified_flow import verify_unified

parser = argparse.ArgumentParser()
choice = parser.add_mutually_exclusive_group(required=True)
choice.add_argument('--site-dir', type=Path)
choice.add_argument('--url')
args = parser.parse_args()
server = None
thread = None

class LanguageControl:
    def __init__(self, page, frame, selector):
        self.page, self.frame, self.selector = page, frame, selector

    def click(self):
        self.page.locator(self.selector).click()
        language = self.page.locator(self.selector).get_attribute('data-language')
        self.frame.wait_for_function('(language) => document.documentElement.lang === language', arg=language)

class EmbeddedPage:
    def __init__(self, page, frame):
        self.page, self.frame = page, frame
        self.viewport_size = page.viewport_size

    def locator(self, selector):
        if selector.startswith('[data-language='):
            return LanguageControl(self.page, self.frame, selector)
        return self.frame.locator(selector)

    def __getattr__(self, name):
        return getattr(self.frame, name)

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        assert path.startswith('/brain-lab/'), path
        return super().translate_path('/' + path[len('/brain-lab/'):])

    def do_GET(self):
        if not self.path.startswith('/brain-lab/'):
            self.send_error(404)
            return
        super().do_GET()

    def log_message(self, *args):
        pass

try:
    if args.site_dir:
        server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(args.site_dir.resolve())))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        url = f'http://127.0.0.1:{server.server_port}/brain-lab/'
    else:
        url = args.url.rstrip('/') + '/'
        assert url.startswith('https://')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            for width, height in [(1536, 864), (1280, 720), (390, 844)]:
                context = browser.new_context(viewport={'width': width, 'height': height}, reduced_motion='reduce')
                page = context.new_page()
                failures = []
                origin = urlsplit(url).netloc
                page.on('response', lambda response: failures.append((response.status, response.url))
                        if urlsplit(response.url).netloc == origin and response.status >= 400 else None)
                response = page.goto(url, wait_until='domcontentloaded', timeout=60000)
                assert response.status == 200
                page.locator('[data-language="en"]').wait_for()
                link = page.locator('#nav a[href="about_brain/"]')
                assert link.count() == 1
                hrefs = page.locator('#nav a').evaluate_all('(links) => links.map(a => a.getAttribute("href"))')
                assert hrefs[hrefs.index('about.html') + 1:hrefs.index('about.html') + 3] == ['about_brain/', 'professor.html']
                for language, name in [('ko', '뇌 해부도'), ('en', 'Brain Atlas')]:
                    page.locator(f'[data-language="{language}"]').click()
                    assert link.inner_text() == name
                    assert page.locator('#nav a[href="about.html"]').inner_text() == ('연구 분야' if language == 'ko' else 'Research Areas')
                    toggle = page.locator('[data-nav-toggle]')
                    if toggle.is_visible() and not page.locator('#nav').evaluate('(e) => e.classList.contains("is-open")'):
                        toggle.click()
                    box = link.bounding_box()
                    assert box and box['x'] >= 0 and box['x'] + box['width'] <= width, (width, box)
                    nav = page.locator('#nav').bounding_box()
                    tools = page.locator('.header-tools').bounding_box()
                    if not toggle.is_visible():
                        assert nav['x'] + nav['width'] <= tools['x'], (width, nav, tools)
                if width == 1536:
                    context.close()
                    print('PASS: desktop lab navigation in Korean and English.', flush=True)
                    continue
                link.click()
                frame = page.locator('#atlas-frame').element_handle().content_frame()
                frame.wait_for_selector('body[data-ready="true"]', timeout=60000)
                assert page.url == url + 'about_brain/'
                assert page.locator('#nav').is_visible()
                assert frame.locator('.language-switch').is_hidden()
                assert frame.locator('#scene-host').get_attribute('data-structures') == '327'
                page.on('pageerror', lambda error: failures.append(str(error)))
                frame.locator('[data-functional="broca"]').click()
                control = EmbeddedPage(page, frame)
                for language in ['ko', 'en']:
                    control.locator(f'[data-language="{language}"]').click()
                    assert frame.locator('#scene-host').get_attribute('data-selected-function') == 'broca'
                frame.locator('.modes [data-mode="anatomy"]').click()
                verify_unified(control)
                frame_box = page.locator('#atlas-frame').bounding_box()
                header_box = page.locator('.site-header').bounding_box()
                page.evaluate('window.scrollTo({top: 0, behavior: "instant"})')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                assert page.locator('#atlas-frame').bounding_box()['y'] >= header_box['height'], (width, page.locator('#atlas-frame').bounding_box(), header_box)
                if args.site_dir:
                    page.screenshot(path=str(Path(__file__).resolve().parents[1] / 'test-results' / f'lab-shell-{width}.png'))
                for path in ['ATTRIBUTION.md', 'TERMINOLOGY.md', 'ANATOMY_REVIEW.md', 'draco/draco_decoder.wasm', 'data/tract_to_region_connectome_MMP.xlsx']:
                    response = context.request.get(url + 'about_brain/' + path)
                    assert response.status == 200, (path, response.status)
                page.goto(url + 'about_brain', wait_until='domcontentloaded')
                frame = page.locator('#atlas-frame').element_handle().content_frame()
                frame.wait_for_selector('body[data-ready="true"]', timeout=60000)
                frame.wait_for_function('document.documentElement.lang === "en"')
                assert page.url == url + 'about_brain/'
                if page.locator('[data-nav-toggle]').is_visible():
                    page.locator('[data-nav-toggle]').click()
                page.locator('#nav a[href="../professor.html"]').click()
                page.wait_for_url(url + 'professor.html')
                page.wait_for_function('document.documentElement.lang === "en"')
                if page.locator('[data-nav-toggle]').is_visible():
                    page.locator('[data-nav-toggle]').click()
                page.locator('#nav a[href="about_brain/"]').click()
                frame = page.locator('#atlas-frame').element_handle().content_frame()
                frame.wait_for_selector('body[data-ready="true"]', timeout=60000)
                frame.wait_for_function('document.documentElement.lang === "en"')
                assert not failures, failures
                context.close()
                print(f'PASS: {width} x {height}; lab link, prefix assets, full anatomy/connectivity flow, downloads and slash redirect.', flush=True)
        finally:
            browser.close()
finally:
    if server:
        server.shutdown()
        server.server_close()
        thread.join(timeout=10)
    print('Browser and local server closed.', flush=True)
