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
                page.locator('#reset').click()
                assert page.locator('#lobe-legend [data-lobe]').count() == 7
                assert page.locator('#lobe-legend').bounding_box()['y'] + page.locator('#lobe-legend').bounding_box()['height'] <= page.locator('#scene-host').bounding_box()['y']
                page.locator('#lobe-legend [data-lobe="frontal"]').click()
                header = page.locator('.lobe-heading [data-lobe="frontal"]').bounding_box()
                library = page.locator('#structure-list').bounding_box()
                assert library['y'] <= header['y'] <= library['y'] + library['height'] - header['height']
                assert page.locator('.detail-name').inner_text() == '이마엽 (Frontal lobe)'
                assert page.locator('#scene-host').get_attribute('data-selected-structures') == '42'
                assert page.locator('[data-lobe-expand]').count() == 7
                page.locator('#isolate-part').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '42'
                for side in ['left', 'right']:
                    page.locator(f'[data-side="{side}"]').click()
                    assert page.locator('#scene-host').get_attribute('data-visible-structures') == '21'
                    assert page.locator('#scene-host').get_attribute('data-selected-lobe') == 'frontal'
                page.locator('[data-side="both"]').click()
                page.locator('[data-visible="284"]').uncheck()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '41'
                assert page.locator('[data-lobe-visible="frontal"]').evaluate('(e) => e.indeterminate')
                page.locator('[data-lobe-visible="frontal"]').check()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '42'
                page.locator('[data-language="en"]').click()
                assert page.locator('.detail-name').inner_text() == 'Frontal lobe'
                assert 'voluntary movement' in page.locator('.summary').inner_text()
                assert not page.locator('#inspector-content').evaluate('(e) => /[가-힣]/.test(e.innerText)'), page.locator('#inspector-content').inner_text()
                page.locator('[data-part="284"]').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '1'
                assert page.locator('#floating-en').inner_text() == 'Frontal lobe'
                page.locator('.inspector [data-lobe="frontal"]').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '42'
                page.locator('#isolate-part').click()
                page.locator('#hide-all').click()
                page.locator('[data-lobe-visible="parietal"]').check()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '14'
                page.locator('#lobe-legend [data-lobe="frontal"]').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '56'
                page.locator('#hide-part').click()
                assert page.locator('#scene-host').get_attribute('data-visible-structures') == '14'
                page.locator('#search').fill('두정엽')
                assert page.locator('.lobe-group:has([data-lobe-visible="parietal"]) [data-part]').count() == 14
                assert page.locator('[data-part="56"]').count() == 1
                page.locator('[data-language="ko"]').click()
                for lobe, count in [('frontal', 42), ('parietal', 14), ('temporal', 22), ('occipital', 18), ('insula', 2), ('limbic', 12), ('boundaries', 18)]:
                    page.locator(f'#lobe-legend [data-lobe="{lobe}"]').click()
                    assert page.locator('#search').input_value() == ''
                    assert page.locator('#scene-host').get_attribute('data-selected-structures') == str(count)
                    assert page.locator('.lobe-location').inner_text()
                    page.locator('[data-language="en"]').click()
                    assert not page.locator('#inspector-content').evaluate('(e) => /[가-힣]/.test(e.innerText)'), page.locator('#inspector-content').inner_text()
                    page.locator('[data-language="ko"]').click()
                page.locator('#reset').click()
                page.locator('#lobe-legend [data-lobe="frontal"]').click()
                page.locator('#scene-host').scroll_into_view_if_needed()
                page.wait_for_selector('.floating-label:not([hidden])')
                sides = page.locator('.hemisphere-controls').bounding_box()
                assert sides['y'] + sides['height'] <= page.locator('.opacity-box').bounding_box()['y']
                page.screenshot(path=str(OUT / f'lobes-{width}.png'))
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
                canvas = page.locator('#scene-host canvas')
                box = canvas.bounding_box()
                point = {'x': box['width'] * 0.5, 'y': box['height'] * 0.4}
                page.mouse.move(box['x'] + point['x'], box['y'] + point['y'])
                page.locator('.hover-label').wait_for(state='visible')
                assert 'Frontal lobe' in page.locator('.hover-label').inner_text()
                canvas.click(position=point)
                assert page.locator('#scene-host').get_attribute('data-selected-lobe') == ''
                assert 'Frontal lobe' in page.locator('#floating-en').inner_text()
                assert page.locator('.inspector [data-lobe="frontal"]').count() == 1
                print(f'PASS: {width} x {height}; 6 lobes and boundary group, source membership, labels, descriptions, child selection, visibility, isolation, hemispheres and Kr/En', flush=True)
                page.locator('[data-mode="tractography"]').click()
                assert page.locator('#lobe-legend').is_hidden()
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
                assert page.locator('#lobe-legend').is_hidden()
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
