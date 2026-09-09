"""Exercise the shipped UI in isolated headless Chromium; never control a user window."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results'
OUT.mkdir(exist_ok=True)
URL = 'http://127.0.0.1:4174/'


def run():
    completed = 0
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            baseline = browser.new_page(viewport={'width': 1280, 'height': 720})
            baseline.goto('http://127.0.0.1:4173/')
            baseline.wait_for_selector('body[data-ready="true"]')
            baseline.locator('[data-mode="connectome"]').click()
            for tract, name in [('L_AF', 'Arcuate fasciculus'), ('L_CST', 'Corticospinal tract'), ('L_OR', 'Optic radiation')]:
                baseline.locator(f'[data-tract="{tract}"]').click()
                assert name.lower() in baseline.locator('.detail-name').inner_text().lower()
            baseline.close()
            print('PASS: preserved baseline AF, CST and OR selections', flush=True)
            for width, height in [(1280, 720), (390, 844)]:
                page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
                errors = []
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.goto(URL)
                page.wait_for_selector('body[data-ready="true"]')
                assert page.evaluate('window.innerWidth') == width
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
                assert page.locator('.inspector [data-layer]').count() == 0
                assert page.locator('[data-expand]').count() == 8
                page.locator('#hide-all').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '0'
                page.locator('#search').fill('Hippocampus')
                page.locator('[data-part="122"]').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '1'
                assert page.locator('[data-visible="122"]').is_checked()
                assert not page.locator('[data-visible="123"]').is_checked()
                page.locator('[data-side="right"]').click()
                assert page.locator('[data-part="123"]').get_attribute('aria-pressed') == 'true'
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '1'
                page.locator('[data-side="both"]').click()
                page.locator('[data-layer="cortex"]').check()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '128'
                page.locator('[data-visible="122"]').uncheck()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '127'
                assert page.locator('[data-layer="cortex"]').evaluate('(e) => e.indeterminate')
                page.locator('[data-language="en"]').click()
                assert page.locator('.detail-name').inner_text() == 'Hippocampus'
                assert page.locator('#search').input_value() == 'Hippocampus'
                page.locator('[data-language="ko"]').click()
                assert page.locator('.detail-name').inner_text() == '해마 (Hippocampus)'
                page.locator('[data-mode="tractography"]').click()
                page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
                page.locator('#fiber-context').uncheck()
                page.wait_for_function('document.querySelector("#scene-host").dataset.visibleFibers === "2000"')
                page.locator('#fiber-density').press('Home')
                page.wait_for_function('document.querySelector("#scene-host").dataset.visibleFibers === "200"')
                page.locator('#fiber-density').press('End')
                page.locator('#zoom-in').click()
                page.locator('#zoom-out').click()
                page.locator('#fiber-all').click()
                page.wait_for_function('document.querySelector("#scene-host").dataset.visibleFibers === "5434"')
                assert page.locator('#scene-host').get_attribute('data-fiber-state') == 'ready'
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
                page.locator('#scene-host').scroll_into_view_if_needed()
                page.screenshot(path=str(OUT / f'fibres-{width}.png'))
                page.locator('[data-mode="connectome"]').click()
                page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
                assert page.locator('.probability-table tbody tr').count() == 67
                page.locator('[data-representation="anatomy"]').click()
                assert page.locator('#scene-host').get_attribute('data-renderer') == 'anatomy'
                page.locator('[data-representation="streamlines"]').click()
                page.locator('#search').fill('PTAT')
                page.locator('[data-tract="L_PTAT"]').click()
                page.wait_for_selector('#scene-host[data-fiber-state="unavailable"]')
                assert page.locator('.floating-label').is_hidden()
                page.locator('#fiber-all').click()
                page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
                assert 'unavailable' not in page.locator('#fiber-status').inner_text()
                assert not errors, errors
                completed += 1
                print(f'PASS: {width} x {height}; anatomy tree, side switching, bilingual state, fibres, density, cameras, whole brain, matrix and unmapped recovery', flush=True)
                page.close()
        finally:
            browser.close()
    print(f'PASS: {completed} complete browser flows across desktop and mobile; browser closed.', flush=True)


if __name__ == '__main__':
    run()
