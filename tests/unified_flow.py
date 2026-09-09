"""Exercise the integrated flow on a supplied Playwright page."""

def verify_unified(page, capture_dir=None):
    assert page.locator('.modes [data-mode]').count() == 2
    assert page.locator('[data-mode="connectome"]').count() == 0
    page.locator('[data-language="ko"]').click()
    page.locator('[data-side="both"]').click()
    page.locator('#lobe-legend [data-lobe="insula"]').click()
    assert page.locator('.detail-name').inner_text() == '뇌섬엽 (Insula)'
    assert page.locator('#scene-host').get_attribute('data-selected-structures') == '2'
    assert page.locator('#opacity').input_value() == '85'
    assert page.locator('[data-part="1001"]').count() == 1
    if capture_dir and page.viewport_size['width'] == 1280:
        page.locator('#scene-host').screenshot(path=str(capture_dir / 'insula-1280.png'))
    assert page.locator('[data-functional]').count() == 22
    topics = {'m1': ['4'], 's1': ['3a', '3b', '1', '2'], 'v1': ['V1'], 'v2': ['V2'], 'v3': ['V3'], 'v4': ['V4'],
              'a1': ['A1'], 'auditory-belt': ['LBelt', 'MBelt', 'PBelt'], 's2': ['OP1', 'OP4'], 'mt': ['MT', 'MST'],
              'fef': ['FEF'], 'sma': ['6ma', '6mp'], 'premotor': ['6a', '6d', '6v', '6r'], 'broca': ['44', '45'],
              'wernicke': ['PSL', 'STV'], 'dlpfc': ['46', '9-46d', 'p9-46v', 'a9-46v'],
              'parietal-attention': ['LIPd', 'LIPv', 'IPS1'], 'acc': ['a24', 'p24', 'a32pr', 'p32pr'],
              'anterior-insula': ['AVI', 'AAIC'], 'entorhinal': ['EC'], 'retrosplenial': ['RSC']}
    for area, parcels in topics.items():
        page.locator(f'[data-functional="{area}"]').click()
        assert page.locator('#scene-host').get_attribute('data-selected-function') == area
        assert page.locator('#scene-host').get_attribute('data-renderer') == 'functional'
        assert page.locator('#scene-host').get_attribute('data-selected-structures') == str(len(parcels))
        assert set(page.locator('#scene-host').get_attribute('data-functional-parcels').split(',')) == {f'left:{p}' for p in parcels}
        assert set(page.locator('.parcel-chip').all_text_contents()) == set(parcels)
        assert page.locator('.functional-scope').is_visible()
        if capture_dir and area in ['sma', 'm1', 'v1', 'a1', 'wernicke'] and page.viewport_size['width'] == 1280:
            page.locator('#scene-host').screenshot(path=str(capture_dir / f'functional-{area}.png'))
        page.locator('[data-language="en"]').click()
        assert not page.locator('#inspector-content').evaluate('(e) => /[가-힣]/.test(e.innerText)')
        for side in ['right', 'both', 'left']:
            page.locator(f'[data-side="{side}"]').click()
            sides = ['left', 'right'] if side == 'both' else [side]
            assert set(page.locator('#scene-host').get_attribute('data-functional-parcels').split(',')) == {f'{s}:{p}' for s in sides for p in parcels}
        page.locator('#isolate-part').click()
        assert page.locator('#isolate-part').get_attribute('aria-pressed') == 'true'
        page.locator('#focus-part').click()
        page.locator('#isolate-part').click()
        page.locator('[data-language="ko"]').click()
    page.locator('#search').fill('V1')
    assert page.locator('[data-functional]').count() == 1
    page.locator('[data-functional="v1"]').click()
    page.locator('#opacity').fill('0')
    assert page.locator('#scene-host').get_attribute('data-renderer') == 'functional'
    page.locator('[data-functional="hippocampus"]').click()
    assert page.locator('#scene-host').get_attribute('data-renderer') == 'anatomy'
    assert page.locator('#scene-host').get_attribute('data-selected-structures') == '2'
    page.locator('[data-side="right"]').click()
    assert page.locator('#scene-host').get_attribute('data-selected-structures') == '1'
    page.locator('[data-side="both"]').click()
    page.locator('[data-mode="tractography"]').click()
    assert page.locator('#stage-kicker').inner_text() == 'DIFFUSION MRI · HCP1065'
    page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
    page.locator('#search').fill('Corpus callosum')
    page.locator('[data-fiber="CC"]').click()
    page.locator('#show-connections').check()
    assert '연결표에 없습니다' in page.locator('#connection-details').inner_text()
    page.locator('#search').fill('Arcuate')
    page.locator('[data-fiber="AF_L"]').click()
    page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
    assert page.locator('.probability-table tbody tr').count() == 67
    page.locator('[data-view="top"]').click()
    page.locator('#fiber-context').uncheck()
    page.locator('#threshold').press('Home')
    assert page.locator('.probability-table tbody tr').count() == 180
    page.locator('#region-search').fill('V1')
    name = page.locator('.detail-name').inner_text()
    view = page.locator('#view-tag').inner_text()
    count = page.locator('#scene-host').get_attribute('data-visible-fibers')
    page.locator('#show-connections').uncheck()
    assert page.locator('#connection-details').is_hidden()
    page.locator('#show-connections').check()
    assert page.locator('.detail-name').inner_text() == name
    assert page.locator('#view-tag').inner_text() == view
    assert page.locator('#scene-host').get_attribute('data-visible-fibers') == count
    assert page.locator('#region-search').input_value() == 'V1'
    assert page.locator('#threshold').input_value() == '0'
    assert page.locator('#search').input_value() == 'Arcuate'
    page.locator('[data-region="V1"]').click()
    page.locator('#region-detail [data-tract="L_OR"]').click()
    assert '시각방사' in page.locator('.detail-name').inner_text()
    page.locator('[data-side="right"]').click()
    assert '우측' in page.locator('#region-summary').inner_text()
    page.locator('[data-representation="anatomy"]').click()
    assert page.locator('#scene-host').get_attribute('data-renderer') == 'anatomy'
    page.locator('[data-representation="streamlines"]').click()
    page.locator('[data-language="en"]').click()
    assert not page.locator('.inspector').evaluate('(e) => /[가-힣]/.test(e.innerText)')
    page.locator('#search').fill('PTAT')
    page.locator('[data-tract="R_PTAT"]').click()
    page.wait_for_selector('#scene-host[data-fiber-state="unavailable"]')
    assert page.locator('#scene-host').get_attribute('data-visible-fibers') == '0'
    assert page.locator('.floating-label').is_hidden()
    page.locator('#show-connections').uncheck()
    page.locator('#show-connections').check()
    page.locator('#fiber-all').click()
    page.wait_for_selector('#scene-host[data-fiber-state="ready"]')
    assert 'Select a pathway' in page.locator('#connection-details').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
