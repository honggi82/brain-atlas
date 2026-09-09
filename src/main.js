import './style.css';
import './tractography.css';
import './lobes.css';
import { CATEGORIES, SOURCES, searchParts, tractKnowledge } from './knowledge.js';
import { connectionsForTract, connectionsForRegion, percent } from './connectome.js';
import { getLanguage, setLanguage, localize, ui, partName, partSummary, regionName } from './i18n.js';
import { makeCatalogue, bundleForTract } from './streamlines.js';
import { LOBES, lobeForPart, partsInLobe } from './lobes.js';
import { FUNCTIONAL_AREAS, functionalParts } from './functional.js';

const icon = (name, size = 20) => {
  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    reset: '<path d="M4 9a8 8 0 1 1 0 6M4 3v6h6"/>',
    focus: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><circle cx="12" cy="12" r="3"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    hide: '<path d="m3 3 18 18M10 5c7-1 12 7 12 7a20 20 0 0 1-4 4M6 6c-3 2-4 6-4 6s3 7 10 7c2 0 3 0 4-1"/>',
    expand: '<path d="M9 3H3v6m0-6 7 7m5-7h6v6m0-6-7 7M3 15v6h6m-6 0 7-7m11 1v6h-6m6 0-7-7"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/>',
    network: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="9" r="3"/><circle cx="9" cy="19" r="3"/><path d="m9 7 6 1M7 9l1 7m4 1 4-5"/>',
    brain: '<path d="M12 4C7-1 1 7 5 10c-5 5 0 12 6 9m2-15c5-5 11 3 7 6 5 5 0 12-6 9M12 4v16M7 6c-2 2 2 4 0 6m10-6c2 2-2 4 0 6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.brain}</svg>`;
};
const $ = selector => document.querySelector(selector);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sideName = side => ui({ left: '좌측', right: '우측', median: '정중선', both: '양쪽' }[side]);
let parts = [], connectome, scene, fiberManifest, bundles = [], fiberStatus = 'idle';
const state = {
  mode: 'anatomy', selected: 284, hemisphere: 'both', opacity: 1,
  categories: new Set(Object.keys(CATEGORIES).filter(k => k !== 'tracts' && k !== 'white_matter')),
  hidden: new Set(), isolate: false, query: '', category: 'all', tract: null, threshold: 0.05,
  regionQuery: '', region: null, showConnections: false,
  selectedFunction: null, referenceIds: new Set(), selectedLobe: null, lobeExpanded: new Set(),
  expanded: new Set(), fiberExpanded: new Set(['commissural']),
  representation: 'streamlines', fiber: 'CC', fiberContext: true, fiberDensity: 1, fiberHidden: new Set(),
};

$('#app').innerHTML = `
  <a class="skip-link" href="#search">구조 검색으로 이동</a>
  <header class="topbar">
    <a class="brand" href="./" aria-label="Brain Atlas 처음으로"><span class="brand-icon">${icon('brain', 28)}</span><span><strong>Brain Atlas<span class="brand-dot">.</span></strong><small>뇌의 구조와 연결</small></span></a>
    <nav class="modes" aria-label="탐색 모드"><button data-mode="anatomy" class="active" aria-pressed="true">${icon('brain')} 해부학</button><button data-mode="tractography" aria-pressed="false">${icon('network')} 백질 연결 탐색</button></nav>
    <div class="header-end"><div class="language-switch" role="group" aria-label="Language"><button data-language="ko" lang="ko" aria-label="한국어 Kr">Kr</button><button data-language="en" lang="en" aria-label="English En">En</button></div><span class="review-badge">검토본</span><button class="icon-button" id="about" aria-label="데이터 출처와 사용 안내">${icon('info')}</button></div>
  </header>
  <main class="workbench">
    <aside class="library" aria-label="구조 목록">
      <div class="panel-heading"><div><span class="eyebrow" id="library-kicker">ANATOMY LIBRARY</span><h1 id="library-title">뇌 구조 탐색</h1></div><span class="count-chip" id="library-total">—</span></div>
      <label class="searchbox">${icon('search')}<input type="search" id="search" placeholder="부위 이름·기능 검색" aria-label="부위 이름 또는 기능 검색"/><kbd>/</kbd></label>
      <section id="functional-library" class="functional-library" aria-label="기능 탐색"></section>
      <div id="category-filters" class="category-filters"></div>
      <div class="list-caption"><span id="list-caption">구조를 선택하세요</span><button id="clear-search" class="text-button">초기화</button></div>
      <div id="structure-list" class="structure-list" aria-label="검색 결과"></div>
      <div class="library-foot"><span class="status-dot"></span><span id="list-foot">모델을 불러오는 중</span></div>
    </aside>
    <section class="visual" aria-label="3D 탐색 화면">
      <div class="stage-heading"><div><span class="eyebrow" id="stage-kicker">HUMAN NEUROANATOMY</span><h2 id="stage-title">구조를 이해하고,<br/>연결을 발견하세요.</h2></div><span class="view-tag" id="view-tag">좌측 사선 보기</span></div>
      <div id="lobe-legend" class="lobe-legend" role="group" aria-label="뇌엽 색상 · 선택하여 설명 보기"></div>
      <div id="scene-host"><div class="hover-label" hidden></div><div class="floating-label" hidden><span id="floating-name"></span><small id="floating-en"></small></div></div>
      <div class="load-state" role="status"><span class="loader-ring"></span><strong id="load-label">해부 모델 준비 중</strong><span id="load-detail">실제 분할 형상을 불러오고 있습니다.</span><progress id="load-progress" max="100" value="0"></progress></div>
      <div class="camera-bar" aria-label="카메라 방향"><button data-view="oblique" class="active" title="사선 보기">3/4</button><button data-view="front">앞</button><button data-view="back">뒤</button><button data-view="left">좌</button><button data-view="right">우</button><button data-view="top">위</button><span></span><button id="zoom-in" aria-label="확대">＋</button><button id="zoom-out" aria-label="축소">−</button></div>
      <div class="stage-bottom"><div class="hemisphere-controls" role="group" aria-label="표시할 반구"><button data-side="both" class="active" aria-pressed="true">양쪽</button><button data-side="left" aria-pressed="false">좌뇌</button><button data-side="right" aria-pressed="false">우뇌</button></div><button id="reset" class="reset-button">${icon('reset', 16)} 전체 복원</button></div>
      <div class="opacity-box"><label for="opacity">피질 투명도 <span id="opacity-value">0%</span></label><input id="opacity" type="range" min="0" max="100" value="0"/><div><span>표면 보기</span><span>내부 보기</span></div></div>
      <div class="fiber-controls" hidden><div class="fiber-control-row"><label for="fiber-density">표시 밀도 <strong id="fiber-density-value">100%</strong></label><label><input type="checkbox" id="fiber-context" checked/> 주변 경로</label><button id="fiber-all">전체 섬유</button></div><input id="fiber-density" type="range" min="10" max="100" step="10" value="100"/><div class="direction-legend"><span><i class="red"></i>좌우</span><span><i class="green"></i>앞뒤</span><span><i class="blue"></i>위아래</span><small>색상 = 섬유 방향</small></div><div id="fiber-status" role="status"></div><button id="retry-fibers" hidden>다시 불러오기</button></div>
      <p class="gesture-hint">드래그하여 회전 · 휠로 확대 · 구조를 클릭하여 선택</p>
    </section>
    <aside class="inspector" aria-label="선택한 구조 설명"><div class="connection-options" hidden><label><input type="checkbox" id="show-connections" aria-controls="connection-details"/> 피질 연결 정보</label><small>선택한 경로의 피질 영역별 겹침 확률</small></div><div id="inspector-content"></div></aside>
  </main>
  <footer class="footer"><span>교육용 참조 해부도 · 구조의 모양과 기능 경계는 다를 수 있습니다.</span><button id="credits" class="text-button">출처 · 모델의 범위 ${icon('arrow', 14)}</button></footer>
  <div id="live-status" class="sr-only" aria-live="polite"></div>
  <dialog id="about-dialog" aria-labelledby="about-title"><button id="close-about" class="dialog-close" aria-label="닫기">×</button><span class="eyebrow">SOURCES & METHODS</span><h2 id="about-title">이 아틀라스에 대하여</h2><p>대학·의학 학습을 위한 뇌 해부도와 구조적 연결 탐색 도구입니다. 한국어 요약은 학습을 돕기 위한 설명이며 각 구조는 여러 기능과 연결망에 참여합니다.</p><h3>해부학</h3><p>Brain Project의 Z-Anatomy / BodyParts3D 모델에서 뇌 구조와 백질 경로 325개 형상을 선택하고 BodyParts3D의 좌우 뇌섬엽 2개를 추가했습니다. 총 327개 형상이며, 서로 다른 영문 이름은 175개입니다. 혈관·말초 뇌신경은 이 버전의 범위에서 제외했습니다.</p><p>추가된 영상 아틀라스 기반 핵과 신경로는 약 7 mm 정합 오차가 보고된 교육용 근사 형상입니다. 신경로의 가느다란 관은 전체 섬유다발을 대표하는 단순화이며, 연구 좌표·MRI 단면·수술 계획용 모델이 아닙니다.</p><h3>구조적 Connectome</h3><p>Yeh (2022)의 HCP1065 신경로–피질영역 표를 사용합니다. 180개 HCP-MMP 영역 × 좌우 52개 열의 9,360개 값을 보존했습니다. 수치는 신경로 마스크가 영역과 겹치는 피험자 비율로, 축삭 수·신호 방향·영역 간 연결 강도·기능적 상관이 아닙니다. 통과 섬유 및 tractography의 오차가 포함될 수 있습니다.</p><p>HCP-MMP 영역과 해부 모델의 이랑은 서로 다른 구획입니다. 영역 ID를 3D 피질에 임의 대응시키지 않습니다. 표의 36개 열은 HCP 유래 근사 신경로, 2개 뇌궁 열은 별도 Z-Anatomy 형상에 이름·좌우 기준으로 대응합니다. 나머지 14개 열은 표로만 제공합니다.</p><p>원본의 PTAT/TPAT 및 C_R/C_PR 약어 차이를 보존했습니다. 전체 연구 대상은 1,065명이지만 일부 열의 분모가 다르므로 확률을 인원수로 환산하지 않습니다. 0은 원본의 0이며, 화면 임계값은 데이터 자체를 바꾸지 않습니다.</p><div class="source-links">${Object.values(SOURCES).map(s => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title} ↗</a>`).join('')}<a href="https://www.nature.com/articles/s41467-022-32595-4" target="_blank" rel="noreferrer">Yeh 2022 · 연구 방법 및 한계 ↗</a><a href="https://www.humanconnectome.org/" target="_blank" rel="noreferrer">Human Connectome Project ↗</a><a href="data/tract_to_region_connectome_MMP.xlsx" download>원본 연결 확률 표 다운로드</a><a href="ATTRIBUTION.md" target="_blank">저작권·라이선스·HCP 감사 문구</a></div></dialog>
`;

$('#about-dialog .source-links').insertAdjacentHTML('beforebegin', '<h3>정밀 섬유 보기</h3><p>섬유 추적 보기에서는 HCP1065 원본의 68개 다발과 98,484개 궤적 표본을 제공합니다. 이 보기의 좌표계는 해부 모형과 별개입니다. 연결표 52개 열 중 48개가 원본 궤적에 대응하며, PTAT·C_R은 양쪽 모두 미대응으로 남겨두었습니다.</p><p><a href="TRACTOGRAPHY.md" target="_blank">섬유 자료의 처리 방법 ↗</a></p>');
for (const p of $('#about-dialog').querySelectorAll('p')) if (p.textContent.startsWith('HCP-MMP 영역과 해부 모델의 이랑')) p.prepend('해부 모형 기준: ');

function sync() {
  document.body.dataset.mode = state.mode;
  const fiberView = state.mode === 'tractography' && state.representation === 'streamlines';
  document.body.dataset.fiberView = fiberView;
  $('.connection-options').hidden = state.mode !== 'tractography';
  $('#show-connections').checked = state.showConnections;
  $('.opacity-box').hidden = fiberView;
  $('.fiber-controls').hidden = !fiberView;
  $('#fiber-density').value = state.fiberDensity * 100;
  $('#fiber-density-value').textContent = `${Math.round(state.fiberDensity * 100)}%`;
  $('#fiber-context').checked = state.fiberContext;
  scene?.update(state);
  const functional = FUNCTIONAL_AREAS.find(f => f.id === state.selectedFunction);
  $('#functional-library').hidden = state.mode !== 'anatomy';
  $('#functional-library').innerHTML = `<h2>${ui('기능 탐색')}</h2><div>${FUNCTIONAL_AREAS.map(f => `<button data-functional="${f.id}" aria-pressed="${state.selectedFunction === f.id}">${escape(getLanguage() === 'en' ? f.short : f.ko)}</button>`).join('')}</div>`;
  const lobe = state.mode === 'anatomy' ? LOBES.find(l => l.id === state.selectedLobe) : null;
  const part = functional || lobe || (fiberView ? bundles.find(b => b.id === state.fiber) : parts.find(p => p.id === state.selected));
  $('.floating-label').hidden = !part;
  $('#floating-name').textContent = part ? `${partName(part)} · ${functional ? ui('참조 해부구조') : sideName(lobe ? state.hemisphere : part.side)}` : '';
  $('#floating-en').textContent = !lobe && !fiberView && lobeForPart(part) ? partName(lobeForPart(part)) : '';
  $('#lobe-legend').hidden = state.mode !== 'anatomy';
  $('#lobe-legend').innerHTML = LOBES.map(l => `<button data-lobe="${l.id}" aria-pressed="${l.id === state.selectedLobe}" title="${escape(partSummary(l))}">${lobeSwatch(l)}${escape(partName(l))}</button>`).join('');
  $('#opacity').value = Math.round((1 - state.opacity) * 100);
  $('#opacity-value').textContent = `${$('#opacity').value}%`;
  document.querySelectorAll('[data-side]').forEach(b => { b.classList.toggle('active', b.dataset.side === state.hemisphere); b.setAttribute('aria-pressed', b.dataset.side === state.hemisphere); });
  $('#live-status').textContent = part ? `${functional ? ui('참조 해부구조') : sideName(lobe ? state.hemisphere : part.side)} ${partName(part)} 선택됨` : '선택 해제';
  localize();
  showFiberStatus();
}

function showFiberStatus() {
  const bundle = bundles.find(b => b.id === state.fiber);
  const visible = b => !state.fiberHidden.has(b.id) && (state.hemisphere === 'both' || ['median', 'both'].includes(b.side) || b.side === state.hemisphere);
  const count = bundle ? (visible(bundle) ? Math.ceil(bundle.count * state.fiberDensity) : 0) : bundles.filter(visible).reduce((sum, b) => sum + Math.ceil(b.overviewCount * state.fiberDensity), 0);
  const messages = { idle: '원본 섬유 궤적', loading: '섬유 궤적을 불러오는 중', error: '정밀 궤적을 불러오지 못했습니다. 다시 시도해주세요.', unavailable: '이 코드에 대응하는 원본 궤적이 없습니다.' };
  $('#fiber-status').textContent = fiberStatus === 'ready' ? `${ui(bundle ? '선택 다발' : '전체 섬유')}: ${count.toLocaleString('en-US')} ${ui('개 streamline · 표시용 표본')}` : ui(messages[fiberStatus]);
  $('#retry-fibers').hidden = fiberStatus !== 'error';
}

function renderList() {
  if (!parts.length) return;
  if (state.mode === 'tractography') { renderFiberList(); return; }
  $('#library-kicker').textContent = 'ANATOMY LIBRARY';
  $('#library-title').textContent = '뇌 구조 탐색';
  $('#library-total').textContent = parts.length;
  $('#search').placeholder = '부위 이름·기능 검색';
  $('#category-filters').hidden = false;
  $('#list-foot').textContent = '175개 이름 · 327개 형상';
  const results = searchParts(parts.map(p => { const lobe = lobeForPart(p); return lobe ? { ...p, aliases: [p.aliases, lobe.ko, lobe.en, lobe.aliases].join(' ') } : p; }), state.query).filter(p => (state.category === 'all' || state.category === p.category) && (state.hemisphere === 'both' || p.side === 'median' || state.hemisphere === p.side));
  $('#list-caption').textContent = `${results.length}개 형상`;
  $('#structure-list').innerHTML = results.length ? Object.entries(CATEGORIES).map(([category, meta]) => {
    const children = results.filter(p => p.category === category);
    if (!children.length) return '';
    const all = parts.filter(p => p.category === category);
    const visible = all.filter(p => state.categories.has(category) && !state.hidden.has(p.id)).length;
    const open = state.expanded.has(category) || Boolean(state.query);
    return `<section class="tree-group"><div class="tree-heading"><input type="checkbox" data-layer="${category}" aria-label="${escape(ui(meta.name))} ${ui('전체 표시')}" ${visible === all.length ? 'checked' : ''} data-mixed="${visible > 0 && visible < all.length}"/><button data-expand="${category}" aria-expanded="${open}"><span>${open ? '▾' : '▸'} ${ui(meta.name)}</span><small>${visible}/${all.length}</small></button></div>${open ? (category === 'cortex' ? renderLobeGroups(children) : children.map(partRow).join('')) : ''}</section>`;
  }).join('') : '<p class="empty">검색 결과가 없습니다.<br/>다른 이름이나 기능으로 찾아보세요.</p>';
  document.querySelectorAll('[data-mixed]').forEach(input => { input.indeterminate = input.dataset.mixed === 'true'; });
}

const lobeSwatch = lobe => `<i class="lobe-swatch" style="--lobe-color:${lobe.color}" aria-hidden="true"></i>`;
function partRow(p) {
  return `<div class="tree-row"><input type="checkbox" data-visible="${p.id}" aria-label="${ui('표시')}: ${escape(partName(p))} · ${sideName(p.side)}" ${state.categories.has(p.category) && !state.hidden.has(p.id) ? 'checked' : ''}/><button class="structure ${state.selected === p.id ? 'selected' : ''}" data-part="${p.id}" aria-pressed="${state.selected === p.id}"><span><strong>${escape(partName(p))}</strong><small>${sideName(p.side)}</small></span></button></div>`;
}

function renderLobeGroups(children) {
  return LOBES.map(lobe => {
    const matches = partsInLobe(children, lobe.id);
    if (!matches.length) return '';
    const all = partsInLobe(parts, lobe.id), visible = all.filter(p => state.categories.has('cortex') && !state.hidden.has(p.id)).length;
    const open = state.lobeExpanded.has(lobe.id) || Boolean(state.query);
    return `<section class="lobe-group" style="--lobe-color:${lobe.color}"><div class="lobe-heading"><input type="checkbox" data-lobe-visible="${lobe.id}" aria-label="${escape(partName(lobe))} ${ui('전체 표시')}" ${visible === all.length ? 'checked' : ''} data-mixed="${visible > 0 && visible < all.length}"/><button data-lobe="${lobe.id}" aria-pressed="${state.selectedLobe === lobe.id}">${lobeSwatch(lobe)}${escape(partName(lobe))}</button><button data-lobe-expand="${lobe.id}" aria-expanded="${open}" aria-label="${escape(partName(lobe))} ${ui('하위 구조')}">${open ? '▾' : '▸'}</button></div><p class="lobe-count">${visible}/${all.length} · ${ui('하위 구조')}</p>${open ? matches.map(partRow).join('') : ''}</section>`;
  }).join('');
}

function setLobeVisible(id, visible) {
  if (visible && !state.categories.has('cortex')) {
    parts.filter(p => p.category === 'cortex').forEach(p => state.hidden.add(p.id));
    state.categories.add('cortex');
  }
  partsInLobe(parts, id).forEach(p => { if (visible) state.hidden.delete(p.id); else state.hidden.add(p.id); });
}

function selectLobe(id) {
  if (!LOBES.some(l => l.id === id)) return;
  state.selectedFunction = null; state.referenceIds.clear();
  state.selectedLobe = id; state.selected = null;
  state.query = ''; $('#search').value = ''; state.category = 'all';
  state.expanded.add('cortex'); state.lobeExpanded.add(id);
  if (id === 'insula') state.opacity = 0.15;
  setLobeVisible(id, true);
  sync(); renderList(); renderInspector(); localize();
  const list = $('#structure-list'), heading = list.querySelector(`[data-lobe="${id}"]`);
  if (heading) list.scrollTop += heading.getBoundingClientRect().top - list.getBoundingClientRect().top - 8;
}

function renderLobeInspector(lobe) {
  const en = getLanguage() === 'en';
  const count = partsInLobe(parts, lobe.id).filter(p => state.hemisphere === 'both' || p.side === state.hemisphere).length;
  $('#inspector-content').innerHTML = `<div class="detail-kicker">${lobeSwatch(lobe)}${ui(lobe.id === 'boundaries' ? '해부학적 경계' : '뇌엽')}<span>${sideName(state.hemisphere)}</span></div><h2 class="detail-name">${escape(partName(lobe))}</h2><div class="detail-divider"></div><h3>${ui('위치와 경계')}</h3><p class="lobe-location">${escape(en ? lobe.locationEn : lobe.location)}</p><h3>${ui('주요 기능')}</h3><p class="summary">${escape(partSummary(lobe))}</p><div class="selection-actions"><button id="focus-part">${icon('focus', 16)} ${ui('가까이')}</button><button id="isolate-part" class="${state.isolate ? 'active' : ''}" aria-pressed="${state.isolate}">${icon('eye', 16)} ${ui('단독 보기')}</button><button id="hide-part">${ui('숨기기')}</button></div><p class="lobe-source-note">${count} · ${ui('현재 반구의 하위 구조 · 왼쪽 목록에서 선택')}</p>${lobe.note ? `<p class="method-note">${escape(en ? lobe.noteEn : lobe.note)}</p>` : ''}<p class="lobe-source-note">${ui('뇌엽은 여러 기능과 연결망에 참여합니다. 색상은 해부학적 분류이며 기능의 정확한 경계가 아닙니다.')}</p><div class="detail-source"><span>${ui('설명 출처')}</span><a href="${lobe.source.url}" target="_blank" rel="noreferrer">${lobe.source.title} ↗</a><a href="${SOURCES.atlas.url}" target="_blank" rel="noreferrer">${ui('형상·명칭의 출처 ↗')}</a></div>`;
}

function renderCategories() {
  $('#category-filters').innerHTML = '<button class="filter" id="show-all">전체 표시</button><button class="filter" id="hide-all">전체 숨기기</button><button class="filter" id="collapse-all">모두 접기</button>';
}

function selectPart(id, focus = false) {
  const p = parts.find(p => p.id === id);
  if (!p) return;
  state.selectedLobe = null; state.selectedFunction = null; state.referenceIds.clear();
  state.selected = id;
  if (p.label === 'Insula') state.opacity = 0.15;
  if (!state.categories.has(p.category)) parts.filter(x => x.category === p.category).forEach(x => state.hidden.add(x.id));
  state.hidden.delete(id);
  state.categories.add(p.category);
  state.expanded.add(p.category);
  if (lobeForPart(p)) state.lobeExpanded.add(lobeForPart(p).id);
  if (state.hemisphere !== 'both' && p.side !== 'median' && state.hemisphere !== p.side) state.hemisphere = p.side;
  sync(); renderList(); renderInspector(); localize();
  if (focus) scene?.focus(id);
}

function selectFunctional(id) {
  const area = FUNCTIONAL_AREAS.find(f => f.id === id);
  if (!area) return;
  const references = functionalParts(parts, area, state.hemisphere);
  state.selectedFunction = id; state.referenceIds = new Set(references.map(p => p.id));
  state.selectedLobe = null; state.selected = null; state.isolate = false; state.opacity = 0.12;
  state.query = ''; $('#search').value = ''; state.category = 'all';
  for (const p of references) {
    state.categories.add(p.category); state.hidden.delete(p.id); state.expanded.add(p.category);
    const lobe = lobeForPart(p); if (lobe) state.lobeExpanded.add(lobe.id);
  }
  sync(); renderList(); renderInspector(); localize();
  const side = state.hemisphere === 'both' ? area.defaultSide : state.hemisphere;
  const view = area.view === 'medial' ? (side === 'right' ? 'left' : 'right') : area.view === 'lateral' ? side : 'oblique';
  scene?.view(view);
  $('#view-tag').textContent = ui(area.view === 'medial' ? '안쪽면 참조 보기' : '기능 영역 참조 보기');
}

function renderFunctionalInspector(area) {
  const en = getLanguage() === 'en';
  const references = functionalParts(parts, area, state.hemisphere);
  $('#inspector-content').innerHTML = `<div class="detail-kicker">${ui('기능 탐색')}<span>${sideName(state.hemisphere === 'both' ? area.defaultSide : state.hemisphere)}</span></div><h2 class="detail-name">${escape(partName(area))}</h2><h3>${ui('대표 위치')}</h3><p class="lobe-location">${escape(en ? area.locationEn : area.location)}</p><h3>${ui('주요 기능')}</h3><p class="summary">${escape(partSummary(area))}</p><p class="method-note functional-scope">${escape(en ? area.scopeEn : area.scope)}</p><h3>${ui('참조 해부구조')}</h3><p class="method-note">${ui('강조 색은 아래 참조 구조의 전체 형상입니다. 기능 활성도나 정확한 기능 경계를 뜻하지 않습니다.')}</p><div class="functional-references">${references.map(p => `<button data-part="${p.id}">${escape(partName(p))} · ${sideName(p.side)}</button>`).join('')}</div><div class="selection-actions"><button id="focus-part">${icon('focus', 16)} ${ui('가까이')}</button><button id="isolate-part" aria-pressed="${state.isolate}">${ui('단독 보기')}</button></div><div class="detail-source"><span>${ui('설명 출처')}</span><a href="${area.source.url}" target="_blank" rel="noreferrer">${area.source.title} ↗</a></div>`;
}

function renderInspector() {
  if (state.mode === 'tractography') { renderFiberInspector(); return; }
  const functional = FUNCTIONAL_AREAS.find(f => f.id === state.selectedFunction);
  if (functional) { renderFunctionalInspector(functional); return; }
  const lobe = LOBES.find(l => l.id === state.selectedLobe);
  if (lobe) { renderLobeInspector(lobe); return; }
  const p = parts.find(p => p.id === state.selected);
  if (!p) { $('#inspector-content').innerHTML = '<div class="inspector-empty">뇌 또는 목록에서 구조를 선택하세요.</div>'; return; }
  const approximate = !p.geometryFile && p.source !== 'Z-Anatomy / BodyParts3D';
  $('#inspector-content').innerHTML = `<div class="detail-kicker"><span class="structure-dot" style="--dot:${CATEGORIES[p.category].color}"></span>${CATEGORIES[p.category].name}<span>${sideName(p.side)}</span></div><h2 class="detail-name">${escape(partName(p))}</h2><p class="latin-name">${escape(p.label)}</p><div class="detail-divider"></div><span class="eyebrow">FUNCTION & ANATOMY</span><h3>이 구조의 역할</h3><p class="summary">${escape(partSummary(p))}</p><div class="selection-actions"><button id="focus-part">${icon('focus', 16)} 가까이</button><button id="isolate-part" class="${state.isolate ? 'active' : ''}" aria-pressed="${state.isolate}">${icon('eye', 16)} 단독 보기</button><button id="hide-part">${icon('hide', 16)} 숨기기</button></div><div class="fact-row"><span>영역</span><strong>${escape(regionName(p.parent || p.region))}</strong></div><div class="fact-row"><span>반구</span><strong>${sideName(p.side)}</strong></div>${approximate ? `<p class="method-note"><strong>영상 아틀라스 기반 근사 형상</strong>${escape(p.source)}에서 유래했습니다. 해부 모델에 맞춘 위치·경로에는 오차가 있습니다.</p>` : ''}${bundles.some(b => b.modelNodeIds.includes(p.id)) ? `<button class="fiber-link" data-open-fiber="${bundles.find(b => b.modelNodeIds.includes(p.id)).id}">섬유 추적으로 보기</button>` : ''}<div class="detail-source"><span>모델 출처</span><p>${escape(p.source)}</p><a href="${SOURCES.anatomy.url}" target="_blank" rel="noreferrer">신경해부학 배경 읽기 ↗</a><a href="${SOURCES.atlas.url}" target="_blank" rel="noreferrer">형상·명칭의 출처 ↗</a></div>`;
  const parentLobe = lobeForPart(p);
  if (parentLobe) $('.detail-divider').insertAdjacentHTML('beforebegin', `<button class="lobe-link" data-lobe="${parentLobe.id}">${lobeSwatch(parentLobe)}${escape(partName(parentLobe))} · ${ui('설명 보기')}</button>`);
}

function selectTract(id) {
  const tract = connectome.tracts.find(t => t.id === id);
  if (!tract) return;
  state.tract = id; state.region = null; state.regionQuery = '';
  state.selected = tract.modelMapping?.modelNodeId ?? null;
  state.fiber = bundleForTract(tract, bundles)?.id ?? null;
  if (state.fiber) state.fiberHidden.delete(state.fiber);
  state.isolate = false;
  if (state.hemisphere !== 'both') state.hemisphere = tract.side;
  if (state.selected != null) { const p = parts.find(p => p.id === state.selected); state.categories.add(p.category); state.hidden.delete(p.id); }
  state.showConnections = true;
  if (state.fiber) state.fiberExpanded.add(bundles.find(b => b.id === state.fiber).group);
  sync(); renderList(); renderInspector();
}

function renderCorticalInfo() {
  const panel = $('#connection-details');
  panel.hidden = !state.showConnections;
  if (!state.showConnections) return;
  const t = connectome.tracts.find(t => t.id === state.tract);
  if (!t) {
    panel.innerHTML = `<p class="method-note">${ui(state.fiber ? '이 다발은 제공된 피질 연결표에 없습니다. 3D 경로는 볼 수 있지만 겹침 확률은 제공하지 않습니다.' : '왼쪽 목록에서 경로를 선택하면 피질 연결 정보를 볼 수 있습니다.')}</p>`;
    return;
  }
  panel.innerHTML = `<div class="probability-heading"><span class="eyebrow">TRACT ↔ CORTICAL REGION</span><h3>피질 영역별 겹침 확률</h3><p>신경로 마스크가 해당 영역과 겹친 비율입니다. 연결 강도나 신호 방향을 의미하지 않습니다.</p></div><label class="threshold-label" for="threshold">최소 표시 확률 <strong id="threshold-value">${Math.round(state.threshold * 100)}%</strong></label><input type="range" id="threshold" min="0" max="100" step="1" value="${Math.round(state.threshold * 100)}"/><label class="region-search">${icon('search', 16)}<input id="region-search" type="search" placeholder="HCP-MMP 영역 ID 검색" aria-label="HCP-MMP 영역 ID 검색" value="${escape(state.regionQuery)}"/></label><div id="region-summary"></div><div id="connection-graph" class="connection-graph"></div><div id="region-connections"></div><div id="region-detail"></div><p class="table-note">영역 ID는 ${sideName(t.side)} HCP-MMP 구획입니다. 이랑 형상에 일대일 대응하지 않습니다. 0% 임계값에서는 원본의 0도 표시합니다.</p><a class="data-download" href="data/tract_to_region_connectome_MMP.xlsx" download>${icon('download',16)} 원본 확률 표 다운로드</a>`;
  renderConnections();
}

function renderConnections() {
  const t = connectome.tracts.find(t => t.id === state.tract);
  const rows = connectionsForTract(connectome, state.tract, state.threshold, state.regionQuery);
  $('#region-summary').textContent = `${rows.length} / 180개 영역 · ${sideName(t.side)}`;
  $('#region-connections').innerHTML = rows.length ? `<table class="probability-table"><thead><tr><th scope="col">영역 ID</th><th scope="col">확률</th></tr></thead><tbody>${rows.map(r => `<tr><td><button data-region="${escape(r.region.id)}" class="${state.region === r.region.id ? 'active' : ''}" aria-label="${sideName(t.side)} ${escape(r.region.id)} 영역 연결 탐색">${escape(r.region.id)}</button></td><td><span class="probability-bar" style="--probability:${r.probability * 100}%">${percent(r.probability)}</span></td></tr>`).join('')}</tbody></table>` : '<p class="empty">조건에 맞는 영역이 없습니다.<br/>임계값을 낮추거나 검색어를 지워보세요.</p>';
  const top = rows.filter(r => r.probability > 0).slice(0, 6);
  $('#connection-graph').innerHTML = `<div class="graph-heading"><strong>${escape(t.code)} <span>${sideName(t.side)}</span></strong><small>표의 상위 ${top.length}개 연결 · 도식</small></div>${top.length ? `<svg viewBox="0 0 500 122" role="img" aria-label="${escape(t.id)} 신경로와 상위 피질 영역의 겹침 확률"><circle cx="54" cy="61" r="24" fill="#235c55"/><text x="54" y="65" fill="white" text-anchor="middle" font-size="12">${escape(t.code)}</text>${top.map((r, i) => { const y = 10 + i * 20; return `<path d="M78 61 C180 61 210 ${y} 290 ${y}" stroke="#6f9c8f" fill="none" stroke-opacity="${0.25 + r.probability * 0.75}" stroke-width="${1 + r.probability * 3}"/><circle cx="294" cy="${y}" r="3" fill="#42766a"/><text x="307" y="${y + 4}" fill="#2c4540" font-size="12">${escape(r.region.id)}</text><text x="468" y="${y + 4}" text-anchor="end" fill="#42766a" font-size="11">${percent(r.probability)}</text>`; }).join('')}</svg>` : '<p class="graph-empty">표시 조건에 맞는 양의 연결이 없습니다.</p>'}`;
  if (state.region) {
    const rows = connectionsForRegion(connectome, state.region, t.side).filter(r => r.probability > 0);
    $('#region-detail').innerHTML = `<h4>${sideName(t.side)} ${escape(state.region)}의 다른 경로</h4>${rows.map(r => `<button data-tract="${r.tract.id}" class="related-tract"><span>${escape(r.tract.code)}</span><strong>${percent(r.probability)}</strong></button>`).join('') || '<p>양의 값이 없습니다.</p>'}`;
  } else $('#region-detail').innerHTML = '';
}

const fiberGroups = { association: '연합 섬유', projection: '투사 섬유', commissural: '맞교차 섬유', cerebellum: '소뇌 연결' };

function renderFiberList() {
  $('#library-kicker').textContent = 'HCP1065 WHITE MATTER';
  $('#library-title').textContent = '백질 연결 탐색';
  const tableOnly = connectome.tracts.filter(t => !bundleForTract(t, bundles));
  $('#library-total').textContent = bundles.length + tableOnly.length;
  $('#search').placeholder = '신경로 이름·약어 검색';
  $('#category-filters').hidden = false;
  $('#list-foot').textContent = '집단 평균 · 원본 궤적 표본';
  const query = state.query.toLocaleLowerCase();
  const results = bundles.filter(b => (state.hemisphere === 'both' || ['median', 'both'].includes(b.side) || b.side === state.hemisphere) && [b.id, b.ko, b.en, b.summary, b.summaryEn].join(' ').toLocaleLowerCase().includes(query));
  const tables = tableOnly.filter(t => (state.hemisphere === 'both' || state.hemisphere === t.side) && [t.id, t.fullName, tractKnowledge(t)?.ko, tractKnowledge(t)?.en].join(' ').toLowerCase().includes(query));
  $('#list-caption').textContent = `${results.length} ${ui('개 섬유 다발')} · ${tables.length} ${ui('표 전용')}`;
  const groups = Object.entries(fiberGroups).map(([group, name]) => {
    const children = results.filter(b => b.group === group);
    if (!children.length) return '';
    const all = bundles.filter(b => b.group === group), visible = all.filter(b => !state.fiberHidden.has(b.id)).length;
    const open = state.fiberExpanded.has(group) || Boolean(query);
    return `<section class="tree-group"><div class="tree-heading"><input type="checkbox" data-fiber-group="${group}" aria-label="${ui(name)} ${ui('전체 표시')}" ${visible === all.length ? 'checked' : ''} data-mixed="${visible > 0 && visible < all.length}"/><button data-fiber-expand="${group}" aria-expanded="${open}"><span>${open ? '▾' : '▸'} ${ui(name)}</span><small>${visible}/${all.length}</small></button></div>${open ? children.map(b => `<div class="tree-row"><input type="checkbox" data-fiber-visible="${b.id}" aria-label="${ui('표시')}: ${escape(partName(b))} · ${sideName(b.side)}" ${!state.fiberHidden.has(b.id) ? 'checked' : ''}/><button class="structure ${state.fiber === b.id ? 'selected' : ''}" data-fiber="${b.id}" aria-pressed="${state.fiber === b.id}"><span><strong>${escape(partName(b))}</strong><small>${b.code} · ${sideName(b.side)}</small></span></button></div>`).join('') : ''}</section>`;
  }).join('');
  const tableRows = tables.length ? `<section class="tree-group table-only-group"><h2>${ui('연결표만 있는 경로')}</h2>${tables.map(t => `<button class="structure ${state.tract === t.id ? 'selected' : ''}" data-tract="${t.id}" aria-pressed="${state.tract === t.id}"><span><strong>${escape(partName(tractKnowledge(t)))}</strong><small>${escape(t.code)} · ${sideName(t.side)} · ${ui('표 전용')}</small></span></button>`).join('')}</section>` : '';
  $('#structure-list').innerHTML = groups + tableRows || `<p class="empty">${ui('검색 결과가 없습니다.')}</p>`;
  document.querySelectorAll('[data-mixed]').forEach(input => { input.indeterminate = input.dataset.mixed === 'true'; });
}

function selectFiber(id) {
  const bundle = bundles.find(b => b.id === id);
  if (!bundle) return;
  state.fiber = id;
  state.tract = bundle.tractId ?? null; state.region = null; state.regionQuery = '';
  state.selected = bundle.modelNodeId ?? null;
  state.fiberHidden.delete(id);
  state.fiberExpanded.add(bundle.group);
  if (state.hemisphere !== 'both' && !['median', 'both'].includes(bundle.side)) state.hemisphere = bundle.side;
  sync(); renderList(); renderInspector(); localize();
}

function renderFiberInspector() {
  const b = bundles.find(b => b.id === state.fiber);
  const t = connectome.tracts.find(t => t.id === state.tract);
  const knowledge = b || (t && tractKnowledge(t));
  const model = parts.find(p => p.id === state.selected);
  const note = state.representation === 'streamlines'
    ? (t && !b ? '원본 약어에 대응하는 궤적을 확인하지 못했습니다. 다른 경로로 대체하지 않습니다.' : 'HCP1065 집단 평균의 원본 궤적을 표시합니다. 해부 모형과 별도의 영상 좌표계입니다.')
    : model ? (model.source.startsWith('HCP') ? '3D에는 이름·좌우가 대응하는 HCP 유래 근사 경로를 표시합니다.' : '3D에는 별도 해부 모형의 대응 구조를 표시합니다. 원본 섬유 궤적과 동일한 형상은 아닙니다.') : '이 경로에 대응하는 해부 모형이 없습니다.';
  $('#inspector-content').innerHTML = `${knowledge ? `<div class="representation-switch" role="group" aria-label="경로 표현"><button data-representation="streamlines" aria-pressed="${state.representation === 'streamlines'}">섬유 추적</button><button data-representation="anatomy" aria-pressed="${state.representation === 'anatomy'}" ${model ? '' : 'disabled'} title="${model ? ui('해부 모형') : ui('이 경로에 대응하는 해부 모형이 없습니다.')}">해부 모형</button></div>` : ''}<div class="detail-kicker">HCP1065 WHITE MATTER</div><h2 class="detail-name">${knowledge ? escape(partName(knowledge)) : ui('전체 백질 섬유')}</h2>${knowledge ? `<p class="latin-name">${escape(b?.id || t.id)} · ${sideName(b?.side || t.side)}</p><p class="summary">${escape(partSummary(knowledge))}</p>` : `<p class="summary">${ui('전체 섬유에서 다발을 클릭하거나 왼쪽 목록에서 선택하세요.')}</p>`}${b ? `<div class="selection-actions"><button id="focus-part">${icon('focus', 16)} 가까이</button><button id="fiber-isolate" aria-pressed="${state.representation === 'streamlines' ? !state.fiberContext : state.isolate}">${icon('eye', 16)} 단독 보기</button></div><div class="fact-row"><span>원본 궤적 수</span><strong>${b.sourceCount.toLocaleString('en-US')}</strong></div><div class="fact-row"><span>제공하는 궤적 표본</span><strong>${b.count.toLocaleString('en-US')}</strong></div>` : ''}<p class="method-note">${ui(note)}</p><section id="connection-details" aria-label="피질 연결 정보" hidden></section><h3>방향 색상 읽기</h3><p class="summary">빨강은 좌우, 초록은 앞뒤, 파랑은 위아래 방향을 나타냅니다. 중간 방향은 혼합색입니다. 색은 신호의 진행 방향이나 연결 강도가 아닙니다.</p><p class="method-note">각 선은 확산 MRI에서 재구성한 궤적이며 축삭 하나를 뜻하지 않습니다. 실제 신경 분지·시냅스를 직접 측정한 자료가 아니며, 개인의 DTI 검사 결과도 아닙니다.</p><div class="detail-source"><span>원자료</span><a href="https://brain.labsolver.org/hcp_trk_atlas.html" target="_blank" rel="noreferrer">HCP1065 · Yeh 2022 ↗</a><a href="TRACTOGRAPHY.md" target="_blank">섬유 자료의 처리 방법 ↗</a></div>`;
  renderCorticalInfo();
}

function setMode(mode) {
  state.selectedLobe = null; state.selectedFunction = null; state.referenceIds.clear();
  state.mode = mode; state.query = ''; state.isolate = false; state.hidden.clear(); $('#search').value = '';
  document.body.dataset.mode = mode;
  document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', b.dataset.mode === mode); });
  if (mode === 'tractography') {
    state.categories = new Set(Object.keys(CATEGORIES)); state.opacity = 0.06;
    $('#stage-kicker').textContent = 'DIFFUSION MRI · HCP1065';
    $('#stage-title').innerHTML = '뇌를 잇는<br/>백질의 경로.';
    const bundle = bundles.find(b => b.id === state.fiber);
    if (bundle) {
      const id = state.hemisphere !== 'both' && !['median', 'both'].includes(bundle.side) && bundle.side !== state.hemisphere
        ? bundles.find(b => b.code === bundle.code && b.side === state.hemisphere)?.id : bundle.id;
      selectFiber(id || 'CC');
    } else if (state.tract) selectTract(state.tract);
  } else {
    $('#stage-kicker').textContent = 'HUMAN NEUROANATOMY';
    $('#stage-title').innerHTML = '구조를 이해하고,<br/>연결을 발견하세요.';
    state.opacity = 1; state.categories = new Set(Object.keys(CATEGORIES).filter(c => c !== 'tracts' && c !== 'white_matter'));
    selectPart(parts.find(p => p.label === 'Precentral gyrus' && p.side === (state.hemisphere === 'right' ? 'right' : 'left')).id);
  }
  sync(); renderList(); renderInspector(); scene?.view('oblique');
  $('#view-tag').textContent = '좌측 사선 보기';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'oblique'));
}

$('#search').addEventListener('input', e => { state.query = e.target.value; renderList(); localize(); });
$('#opacity').addEventListener('input', e => { state.opacity = 1 - Number(e.target.value) / 100; sync(); });
$('#app').addEventListener('click', event => {
  const b = event.target.closest('button'); if (!b) return;
  if (b.dataset.language) { setLanguage(b.dataset.language); sync(); renderCategories(); renderList(); renderInspector(); }
  if (b.dataset.functional) selectFunctional(b.dataset.functional);
  if (b.dataset.part) selectPart(Number(b.dataset.part));
  if (b.dataset.lobe) selectLobe(b.dataset.lobe);
  if (b.dataset.lobeExpand) { const id = b.dataset.lobeExpand; if (state.lobeExpanded.has(id)) state.lobeExpanded.delete(id); else state.lobeExpanded.add(id); renderList(); }
  if (b.dataset.fiber) selectFiber(b.dataset.fiber);
  if (b.dataset.openFiber) { state.fiber = b.dataset.openFiber; state.representation = 'streamlines'; setMode('tractography'); }
  if (b.dataset.representation) { state.representation = b.dataset.representation; sync(); renderList(); renderInspector(); }
  if (b.dataset.expand) { const key = b.dataset.expand; if (state.expanded.has(key)) state.expanded.delete(key); else state.expanded.add(key); renderList(); }
  if (b.dataset.fiberExpand) { const key = b.dataset.fiberExpand; if (state.fiberExpanded.has(key)) state.fiberExpanded.delete(key); else state.fiberExpanded.add(key); renderList(); }
  if (b.dataset.tract) selectTract(b.dataset.tract);
  if (b.dataset.mode && connectome) setMode(b.dataset.mode);
  if (b.dataset.category) { state.category = b.dataset.category; renderCategories(); renderList(); }
  if (b.dataset.view) { scene?.view(b.dataset.view); $('#view-tag').textContent = { front: '앞쪽 보기', back: '뒤쪽 보기', left: '좌측 보기', right: '우측 보기', top: '위쪽 보기', oblique: '좌측 사선 보기' }[b.dataset.view]; document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x === b)); }
  if (b.dataset.side) {
    state.hemisphere = b.dataset.side;
    if (state.selectedFunction) { selectFunctional(state.selectedFunction);
    } else if (state.mode === 'tractography') {
      const bundle = bundles.find(b => b.id === state.fiber);
      const tract = connectome.tracts.find(t => t.id === state.tract);
      if (bundle) {
        const counterpart = state.hemisphere !== 'both' && !['median', 'both'].includes(bundle.side)
          ? bundles.find(b => b.code === bundle.code && b.side === state.hemisphere) : bundle;
        if (counterpart) selectFiber(counterpart.id);
      } else if (tract && state.hemisphere !== 'both') selectTract(connectome.tracts.find(t => t.code === tract.code && t.side === state.hemisphere).id);
      sync(); renderList(); renderInspector();
    } else {
      const p = parts.find(p => p.id === state.selected);
      if (p && state.hemisphere !== 'both' && p.side !== 'median' && p.side !== state.hemisphere) {
        const counterpart = parts.find(x => x.label === p.label && x.side === state.hemisphere);
        if (counterpart) selectPart(counterpart.id); else state.selected = null;
      }
      sync(); renderList(); renderInspector();
    }
  }
  if (b.dataset.region) { state.region = b.dataset.region; renderConnections(); }
  if (b.id === 'focus-part') scene?.focus(state.selected);
  if (b.id === 'fiber-isolate') { if (state.representation === 'streamlines') state.fiberContext = !state.fiberContext; else state.isolate = !state.isolate; sync(); renderInspector(); }
  if (b.id === 'fiber-all') { state.fiber = null; state.tract = null; state.selected = null; state.region = null; state.regionQuery = ''; state.isolate = false; state.representation = 'streamlines'; state.fiberContext = true; sync(); renderList(); renderInspector(); scene?.view('oblique'); }
  if (b.id === 'retry-fibers') scene?.retryFibers();
  if (b.id === 'show-all' || b.id === 'hide-all') {
    const show = b.id === 'show-all';
    if (state.mode === 'tractography') state.fiberHidden = new Set(show ? [] : bundles.map(b => b.id));
    else { state.categories = new Set(show ? Object.keys(CATEGORIES) : []); state.hidden.clear(); }
    sync(); renderList();
  }
  if (b.id === 'collapse-all') { state.expanded.clear(); state.lobeExpanded.clear(); state.fiberExpanded.clear(); renderList(); }
  if (b.id === 'isolate-part') { state.isolate = !state.isolate; sync(); renderInspector(); if (state.isolate) scene?.focus(state.selected); else scene?.view('oblique'); }
  if (b.id === 'hide-part') { if (state.selectedLobe) setLobeVisible(state.selectedLobe, false); else state.hidden.add(state.selected); state.selectedLobe = null; state.selected = null; state.isolate = false; sync(); renderList(); renderInspector(); }
  if (b.id === 'reset') { state.hemisphere = 'both'; state.category = 'all'; state.regionQuery = ''; state.threshold = 0.05; state.fiberDensity = 1; state.fiberContext = true; state.fiberHidden.clear(); if (state.mode === 'tractography') { state.fiber = 'CC'; state.tract = null; state.representation = 'streamlines'; } setMode(state.mode); renderCategories(); }
  if (b.id === 'clear-search') { state.query = ''; state.category = 'all'; $('#search').value = ''; renderCategories(); renderList(); }
  if (b.id === 'zoom-in') scene?.zoom(0.8);
  if (b.id === 'zoom-out') scene?.zoom(1.25);
  if (b.id === 'about' || b.id === 'credits') $('#about-dialog').showModal();
  if (b.id === 'close-about') $('#about-dialog').close();
  localize();
});
$('#app').addEventListener('change', event => {
  const input = event.target;
  if (input.dataset.lobeVisible) { setLobeVisible(input.dataset.lobeVisible, input.checked); sync(); renderList(); }
  if (input.dataset.layer) { const layer = input.dataset.layer; if (input.checked) { state.categories.add(layer); parts.filter(p => p.category === layer).forEach(p => state.hidden.delete(p.id)); } else state.categories.delete(layer); sync(); renderList(); }
  if (input.dataset.visible) {
    const id = Number(input.dataset.visible), p = parts.find(p => p.id === id);
    if (input.checked) {
      if (!state.categories.has(p.category)) parts.filter(x => x.category === p.category).forEach(x => state.hidden.add(x.id));
      state.categories.add(p.category); state.hidden.delete(id);
    } else state.hidden.add(id);
    sync(); renderList();
  }
  if (input.dataset.fiberVisible) { if (input.checked) state.fiberHidden.delete(input.dataset.fiberVisible); else state.fiberHidden.add(input.dataset.fiberVisible); sync(); renderList(); }
  if (input.dataset.fiberGroup) { bundles.filter(b => b.group === input.dataset.fiberGroup).forEach(b => { if (input.checked) state.fiberHidden.delete(b.id); else state.fiberHidden.add(b.id); }); sync(); renderList(); }
  if (input.id === 'show-connections') { state.showConnections = input.checked; renderCorticalInfo(); }
  if (input.id === 'fiber-context') { state.fiberContext = input.checked; sync(); renderInspector(); localize(); }
  localize();
});
$('#app').addEventListener('input', event => {
  if (event.target.id === 'fiber-density') { state.fiberDensity = Number(event.target.value) / 100; sync(); }
  if (event.target.id === 'threshold') { state.threshold = Number(event.target.value) / 100; $('#threshold-value').textContent = `${event.target.value}%`; renderConnections(); }
  if (event.target.id === 'region-search') { state.regionQuery = event.target.value; renderConnections(); }
  localize();
});
document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !$('#about-dialog').open) { e.preventDefault(); $('#search').focus(); } });

async function getJSON(url) { const response = await fetch(`${import.meta.env.BASE_URL}${url}`); if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`); return response.json(); }
async function start() {
  try {
    [parts, connectome, fiberManifest] = await Promise.all([getJSON('models/parts.json'), getJSON('data/hcp-connectome.json'), getJSON('tractography/manifest.json')]);
    bundles = makeCatalogue(fiberManifest, parts, connectome);
    renderCategories(); renderList(); renderInspector(); localize();
    const { createScene } = await import('./scene.js');
    scene = await createScene($('#scene-host'), parts, {
      onSelect(id) {
        if (state.mode === 'tractography') { const b = bundles.find(b => b.modelNodeIds.includes(id)); if (b) selectFiber(b.id); else { setMode('anatomy'); selectPart(id); } }
        else selectPart(id);
      },
      onProgress(value) { $('#load-progress').value = value; $('#load-label').textContent = ui(value < 100 ? `해부 모델 불러오는 중 · ${value}%` : '준비 완료'); },
      onFiberStatus(status) { fiberStatus = status; $('#scene-host').dataset.fiberState = status; showFiberStatus(); },
      onFiberSelect(id) {
        selectFiber(id);
      },
    }, { ...fiberManifest, bundles });
    sync(); $('.load-state').hidden = true; document.body.dataset.ready = 'true'; localize();
  } catch (error) {
    console.error('Atlas load failed', error);
    $('.load-state').innerHTML = '<strong>3D 모델을 불러오지 못했습니다.</strong><span>연결 상태와 WebGL 지원을 확인한 뒤 새로고침해주세요. 부위 목록과 설명은 데이터가 로드된 경우 계속 사용할 수 있습니다.</span><button id="retry-load">다시 불러오기</button>';
    $('#retry-load').onclick = () => location.reload();
    $('.load-state').hidden = false;
    document.body.dataset.ready = 'error';
    localize();
  }
}
window.addEventListener('pagehide', () => scene?.dispose(), { once: true });
localize();
start();
