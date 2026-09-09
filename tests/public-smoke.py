"""Verify an anonymous visitor can use the deployed static app."""
import sys
from playwright.sync_api import sync_playwright

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
            assert page.locator('#scene-host').get_attribute('data-structures') == '325'
            assert page.locator('#lobe-legend [data-lobe]').count() == 7
            page.locator('#lobe-legend [data-lobe="frontal"]').click()
            assert page.locator('#scene-host').get_attribute('data-selected-structures') == '42'
            page.locator('[data-language="en"]').click()
            assert page.locator('.detail-name').inner_text() == 'Frontal lobe'
            page.locator('[data-mode="tractography"]').click()
            page.wait_for_selector('#scene-host[data-fiber-state="ready"]', timeout=60000)
            page.locator('#fiber-context').uncheck()
            page.wait_for_function('document.querySelector("#scene-host").dataset.visibleFibers === "2000"')
            page.locator('[data-mode="connectome"]').click()
            page.wait_for_selector('#scene-host[data-fiber-state="ready"]', timeout=60000)
            assert page.locator('.probability-table tbody tr').count() == 67
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
            assert not errors, errors
            context.close()
            print(f'PASS: anonymous HTTPS visitor at {width} x {height}; anatomy, lobes, En, native tractography and connectome.', flush=True)
    finally:
        browser.close()
