"""Verify an anonymous visitor can use the deployed static app."""
import sys
from playwright.sync_api import sync_playwright
from unified_flow import verify_unified

url = sys.argv[1]
if not url.startswith('https://'):
    raise ValueError('Public verification requires HTTPS')
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    try:
        for width, height in [(1280, 720), (390, 844)]:
            context = browser.new_context(viewport={'width': width, 'height': height})
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            response = page.goto(url, wait_until='domcontentloaded', timeout=60000)
            assert response.status == 200, response.status
            page.wait_for_selector('body[data-ready="true"]', timeout=60000)
            assert page.url.rstrip('/') == url.rstrip('/'), page.url
            assert page.locator('#scene-host').get_attribute('data-structures') == '327'
            assert page.locator('#lobe-legend [data-lobe]').count() == 7
            for lobe, ko, en, count in [
                ('frontal', '전두엽', 'Frontal lobe', 42),
                ('parietal', '두정엽', 'Parietal lobe', 14),
                ('occipital', '후두엽', 'Occipital lobe', 18),
                ('temporal', '측두엽', 'Temporal lobe', 22),
            ]:
                label = f'{ko} ({en})'
                legend = page.locator(f'#lobe-legend [data-lobe="{lobe}"]')
                assert label in legend.inner_text()
                legend.click()
                assert page.locator('.detail-name').inner_text() == label
                assert label in page.locator(f'.lobe-heading [data-lobe="{lobe}"]').inner_text()
                assert page.locator('#scene-host').get_attribute('data-selected-structures') == str(count)
                assert not any(old in page.locator('#inspector-content').inner_text()
                               for old in ['이마엽', '마루엽', '뒤통수엽', '관자엽'])
                page.locator('[data-language="en"]').click()
                assert page.locator('.detail-name').inner_text() == en
                page.locator('[data-language="ko"]').click()
                assert page.locator('.detail-name').inner_text() == label
            page.locator('[data-language="en"]').click()
            verify_unified(page)
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
            assert not errors, errors
            context.close()
            print(f'PASS: anonymous HTTPS visitor at {width} x {height}; four Korean lobe names, Kr/En switching, anatomy, native tractography and connectome.', flush=True)
    finally:
        browser.close()
