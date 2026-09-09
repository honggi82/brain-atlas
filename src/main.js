import './style.css';
import { CATEGORIES, SOURCES, searchParts, tractKnowledge } from './knowledge.js';
import { connectionsForTract, connectionsForRegion, percent } from './connectome.js';
import { getLanguage, setLanguage, localize, ui, partName, partSummary, regionName } from './i18n.js';

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
let parts = [], connectome, scene;
const state = {
  mode: 'anatomy', selected: 284, hemisphere: 'both', opacity: 1,
  categories: new Set(Object.keys(CATEGORIES).filter(k => k !== 'tracts' && k !== 'white_matter')),
  hidden: new Set(), isolate: false, query: '', category: 'all', tract: 'L_AF', threshold: 0.05,
  regionQuery: '', region: null,
};

$('#app').innerHTML = `
  <a class="skip-link" href="#search">구조 검색으로 이동</a>
  <header class="topbar">
    <a class="brand" href="./" aria-label="Brain Atlas 처음으로"><span class="brand-icon">${icon('brain', 28)}</span><span><strong>Brain Atlas<span class="brand-dot">.</span></strong><small>뇌의 구조와 연결</small></span></a>
    <nav class="modes" aria-label="탐색 모드"><button data-mode="anatomy" class="active" aria-pressed="true">${icon('brain')} 해부학</button><button data-mode="connectome" aria-pressed="false">${icon('network')} Connectome</button></nav>
    <div class="header-end"><div class="language-switch" role="group" aria-label="Language"><button data-language="ko" lang="ko" aria-label="한국어 Kr">Kr</button><button data-language="en" lang="en" aria-label="English En">En</button></div><span class="review-badge">검토본</span><button class="icon-button" id="about" aria-label="데이터 출처와 사용 안내">${icon('info')}</button></div>
  </header>
  <main class="workbench">
    <aside class="library" aria-label="구조 목록">
      <div class="panel-heading"><div><span class="eyebrow" id="library-kicker">ANATOMY LIBRARY</span><h1 id="library-title">뇌 구조 탐색</h1></div><span class="count-chip" id="library-total">—</span></div>
      <label class="searchbox">${icon('search')}<input type="search" id="search" placeholder="부위 이름·기능 검색" aria-label="부위 이름 또는 기능 검색"/><kbd>/</kbd></label>
      <div id="category-filters" class="category-filters"></div>
      <div class="list-caption"><span id="list-caption">구조를 선택하세요</span><button id="clear-search" class="text-button">초기화</button></div>
      <div id="structure-list" class="structure-list" aria-label="검색 결과"></div>
      <div class="library-foot"><span class="status-dot"></span><span id="list-foot">모델을 불러오는 중</span></div>
    </aside>
    <section class="visual" aria-label="3D 탐색 화면">
      <div class="stage-heading"><div><span class="eyebrow" id="stage-kicker">HUMAN NEUROANATOMY</span><h2 id="stage-title">구조를 이해하고,<br/>연결을 발견하세요.</h2></div><span class="view-tag" id="view-tag">좌측 사선 보기</span></div>
      <div id="scene-host"><div class="hover-label" hidden></div><div class="floating-label" hidden><span id="floating-name"></span><small id="floating-en"></small></div></div>
      <div class="load-state" role="status"><span class="loader-ring"></span><strong id="load-label">해부 모델 준비 중</strong><span id="load-detail">실제 분할 형상을 불러오고 있습니다.</span><progress id="load-progress" max="100" value="0"></progress></div>
      <div class="camera-bar" aria-label="카메라 방향"><button data-view="oblique" class="active" title="사선 보기">3/4</button><button data-view="front">앞</button><button data-view="back">뒤</button><button data-view="left">좌</button><button data-view="right">우</button><button data-view="top">위</button><span></span><button id="zoom-in" aria-label="확대">＋</button><button id="zoom-out" aria-label="축소">−</button></div>
      <div class="stage-bottom"><div class="hemisphere-controls" role="group" aria-label="표시할 반구"><button data-side="both" class="active" aria-pressed="true">양쪽</button><button data-side="left" aria-pressed="false">좌뇌</button><button data-side="right" aria-pressed="false">우뇌</button></div><button id="reset" class="reset-button">${icon('reset', 16)} 전체 복원</button></div>
      <div class="opacity-box"><label for="opacity">피질 투명도 <span id="opacity-value">0%</span></label><input id="opacity" type="range" min="0" max="100" value="0"/><div><span>표면 보기</span><span>내부 보기</span></div></div>
      <p class="gesture-hint">드래그하여 회전 · 휠로 확대 · 구조를 클릭하여 선택</p>
      <div id="connection-graph" class="connection-graph" hidden></div>
    </section>
    <aside class="inspector" aria-label="선택한 구조 설명"><div id="inspector-content"></div></aside>
  </main>
  <footer class="footer"><span>교육용 참조 해부도 · 구조의 모양과 기능 경계는 다를 수 있습니다.</span><button id="credits" class="text-button">출처 · 모델의 범위 ${icon('arrow', 14)}</button></footer>
  <div id="live-status" class="sr-only" aria-live="polite"></div>
  <dialog id="about-dialog" aria-labelledby="about-title"><button id="close-about" class="dialog-close" aria-label="닫기">×</button><span class="eyebrow">SOURCES & METHODS</span><h2 id="about-title">이 아틀라스에 대하여</h2><p>대학·의학 학습을 위한 뇌 해부도와 구조적 연결 탐색 도구입니다. 한국어 요약은 학습을 돕기 위한 설명이며 각 구조는 여러 기능과 연결망에 참여합니다.</p><h3>해부학</h3><p>Brain Project의 Z-Anatomy / BodyParts3D 모델에서 뇌 구조와 백질 경로 325개 형상을 선택했습니다. 좌우·세부 조각을 포함하며, 서로 다른 영문 이름은 174개입니다. 혈관·말초 뇌신경은 이 버전의 범위에서 제외했습니다.</p><p>추가된 영상 아틀라스 기반 핵과 신경로는 약 7 mm 정합 오차가 보고된 교육용 근사 형상입니다. 신경로의 가느다란 관은 전체 섬유다발을 대표하는 단순화이며, 연구 좌표·MRI 단면·수술 계획용 모델이 아닙니다.</p><h3>구조적 Connectome</h3><p>Yeh (2022)의 HCP1065 신경로–피질영역 표를 사용합니다. 180개 HCP-MMP 영역 × 좌우 52개 열의 9,360개 값을 보존했습니다. 수치는 신경로 마스크가 영역과 겹치는 피험자 비율로, 축삭 수·신호 방향·영역 간 연결 강도·기능적 상관이 아닙니다. 통과 섬유 및 tractography의 오차가 포함될 수 있습니다.</p><p>HCP-MMP 영역과 해부 모델의 이랑은 서로 다른 구획입니다. 영역 ID를 3D 피질에 임의 대응시키지 않습니다. 표의 36개 열은 HCP 유래 근사 신경로, 2개 뇌궁 열은 별도 Z-Anatomy 형상에 이름·좌우 기준으로 대응합니다. 나머지 14개 열은 표로만 제공합니다.</p><p>원본의 PTAT/TPAT 및 C_R/C_PR 약어 차이를 보존했습니다. 전체 연구 대상은 1,065명이지만 일부 열의 분모가 다르므로 확률을 인원수로 환산하지 않습니다. 0은 원본의 0이며, 화면 임계값은 데이터 자체를 바꾸지 않습니다.</p><div class="source-links">${Object.values(SOURCES).map(s => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title} ↗</a>`).join('')}<a href="https://www.nature.com/articles/s41467-022-32595-4" target="_blank" rel="noreferrer">Yeh 2022 · 연구 방법 및 한계 ↗</a><a href="https://www.humanconnectome.org/" target="_blank" rel="noreferrer">Human Connectome Project ↗</a><a href="data/tract_to_region_connectome_MMP.xlsx" download>원본 연결 확률 표 다운로드</a><a href="ATTRIBUTION.md" target="_blank">저작권·라이선스·HCP 감사 문구</a></div></dialog>
`;

function sync() {
  scene?.update(state);
  $('.floating-label').hidden = state.selected == null;
  const part = parts.find(p => p.id === state.selected);
  $('#floating-name').textContent = part ? `${partName(part)} · ${sideName(part.side)}` : '';
  $('#floating-en').textContent = '';
  $('#opacity').value = Math.round((1 - state.opacity) * 100);
  $('#opacity-value').textContent = `${$('#opacity').value}%`;
  document.querySelectorAll('[data-side]').forEach(b => { b.classList.toggle('active', b.dataset.side === state.hemisphere); b.setAttribute('aria-pressed', b.dataset.side === state.hemisphere); });
  $('#live-status').textContent = part ? `${sideName(part.side)} ${partName(part)} 선택됨` : '선택 해제';
  localize();
}

function renderList() {
  if (!parts.length) return;
  const connect = state.mode === 'connectome';
  $('#library-kicker').textContent = connect ? 'HCP1065 CONNECTOME' : 'ANATOMY LIBRARY';
  $('#library-title').textContent = connect ? '연결 경로 탐색' : '뇌 구조 탐색';
  $('#library-total').textContent = connect ? '52' : '325';
  $('#search').placeholder = connect ? '신경로 이름·약어 검색' : '부위 이름·기능 검색';
  $('#category-filters').hidden = connect;
  $('#list-foot').textContent = connect ? 'HCP-MMP · 좌우 각 26종' : '174개 이름 · 325개 형상';
  if (connect) {
    const query = state.query.toLowerCase();
    const results = connectome.tracts.filter(t => (state.hemisphere === 'both' || state.hemisphere === t.side) && [t.id, t.fullName, tractKnowledge(t)?.ko, tractKnowledge(t)?.en].join(' ').toLowerCase().includes(query));
    $('#list-caption').textContent = `${results.length}개 경로 열`;
    $('#structure-list').innerHTML = results.length ? results.map(t => {
      const knowledge = tractKnowledge(t);
      const ko = knowledge ? partName(knowledge) : t.fullName || `${t.code} · 원본 약어`;
      return `<button class="structure ${state.tract === t.id ? 'selected' : ''}" data-tract="${t.id}" aria-pressed="${state.tract === t.id}"><span class="structure-dot" style="--dot:#549e96"></span><span><strong>${escape(ko)}</strong><small>${escape(t.code)} · ${sideName(t.side)}${t.modelMapping ? '' : ' · 표 전용'}</small></span><span class="side-letter">${t.side === 'left' ? 'L' : 'R'}</span></button>`;
    }).join('') : '<p class="empty">검색 결과가 없습니다.<br/>이름이나 약어를 바꿔보세요.</p>';
    return;
  }
  const results = searchParts(parts, state.query).filter(p => (state.category === 'all' || state.category === p.category) && (state.hemisphere === 'both' || p.side === 'median' || state.hemisphere === p.side));
  $('#list-caption').textContent = `${results.length}개 형상`;
  $('#structure-list').innerHTML = results.length ? results.map(p => `<button class="structure ${state.selected === p.id ? 'selected' : ''} ${state.hidden.has(p.id) ? 'muted' : ''}" data-part="${p.id}" aria-pressed="${state.selected === p.id}"><span class="structure-dot" style="--dot:${CATEGORIES[p.category].color}"></span><span><strong>${escape(partName(p))}</strong><small>${escape(ui(CATEGORIES[p.category].name))} &middot; ${sideName(p.side)}</small></span><span class="side-letter">${{left:'L',right:'R',median:'M'}[p.side]}</span></button>`).join('') : '<p class="empty">검색 결과가 없습니다.<br/>다른 이름이나 기능으로 찾아보세요.</p>';
}

function renderCategories() {
  $('#category-filters').innerHTML = `<button class="filter ${state.category === 'all' ? 'active' : ''}" data-category="all">전체</button>${Object.entries(CATEGORIES).map(([id, c]) => `<button class="filter ${state.category === id ? 'active' : ''}" data-category="${id}">${c.short}</button>`).join('')}`;
}

function selectPart(id, focus = false) {
  const p = parts.find(p => p.id === id);
  if (!p) return;
  state.selected = id;
  state.hidden.delete(id);
  state.categories.add(p.category);
  if (state.hemisphere !== 'both' && p.side !== 'median' && state.hemisphere !== p.side) state.hemisphere = p.side;
  sync(); renderList(); renderInspector(); localize();
  if (focus) scene?.focus(id);
}

function renderInspector() {
  if (state.mode === 'connectome') { renderConnectome(); return; }
  const p = parts.find(p => p.id === state.selected);
  if (!p) { $('#inspector-content').innerHTML = '<div class="inspector-empty">뇌 또는 목록에서 구조를 선택하세요.</div>'; return; }
  const approximate = p.source !== 'Z-Anatomy / BodyParts3D';
  $('#inspector-content').innerHTML = `<div class="detail-kicker"><span class="structure-dot" style="--dot:${CATEGORIES[p.category].color}"></span>${CATEGORIES[p.category].name}<span>${sideName(p.side)}</span></div><h2 class="detail-name">${escape(partName(p))}</h2><p class="latin-name">${escape(p.label)}</p><div class="detail-divider"></div><span class="eyebrow">FUNCTION & ANATOMY</span><h3>이 구조의 역할</h3><p class="summary">${escape(partSummary(p))}</p><div class="selection-actions"><button id="focus-part">${icon('focus', 16)} 가까이</button><button id="isolate-part" class="${state.isolate ? 'active' : ''}" aria-pressed="${state.isolate}">${icon('eye', 16)} 단독 보기</button><button id="hide-part">${icon('hide', 16)} 숨기기</button></div><div class="fact-row"><span>영역</span><strong>${escape(regionName(p.parent || p.region))}</strong></div><div class="fact-row"><span>반구</span><strong>${sideName(p.side)}</strong></div>${approximate ? `<p class="method-note"><strong>영상 아틀라스 기반 근사 형상</strong>${escape(p.source)}에서 유래했습니다. 해부 모델에 맞춘 위치·경로에는 오차가 있습니다.</p>` : ''}<section class="layers"><span class="eyebrow">LAYERS</span><h3>표시할 구조</h3>${Object.entries(CATEGORIES).map(([id, c]) => `<label class="layer-row"><span><i style="background:${c.color}"></i>${c.name}</span><input type="checkbox" data-layer="${id}" ${state.categories.has(id) ? 'checked' : ''}/></label>`).join('')}</section><div class="detail-source"><span>모델 출처</span><p>${escape(p.source)}</p><a href="${SOURCES.anatomy.url}" target="_blank" rel="noreferrer">신경해부학 배경 읽기 ↗</a><a href="${SOURCES.atlas.url}" target="_blank" rel="noreferrer">형상·명칭의 출처 ↗</a></div>`;
}

function selectTract(id) {
  const tract = connectome.tracts.find(t => t.id === id);
  if (!tract) return;
  state.tract = id; state.region = null; state.regionQuery = '';
  state.selected = tract.modelMapping?.modelNodeId ?? null;
  state.isolate = false;
  if (state.hemisphere !== 'both') state.hemisphere = tract.side;
  if (state.selected != null) { const p = parts.find(p => p.id === state.selected); state.categories.add(p.category); state.hidden.delete(p.id); }
  sync(); renderList(); renderConnectome();
}

function renderConnectome() {
  const t = connectome.tracts.find(t => t.id === state.tract);
  if (!t) return;
  const mapped = t.modelMapping;
  const knowledge = tractKnowledge(t);
  const title = knowledge ? partName(knowledge) : t.fullName || t.code;
  $('#inspector-content').innerHTML = `<div class="detail-kicker">STRUCTURAL CONNECTOME<span>${sideName(t.side)}</span></div><h2 class="detail-name">${escape(title)}</h2><p class="latin-name">${escape(t.fullName || '원본 표의 약어를 보존했습니다.')} · ${escape(t.id)}</p>${knowledge ? `<p class="summary compact">${escape(partSummary(knowledge))}</p>` : ''}<p class="method-note">${mapped ? (mapped.modelSource.startsWith('HCP') ? '3D에는 이름·좌우가 대응하는 HCP 유래 근사 경로를 표시합니다.' : '3D는 별도 Z-Anatomy 뇌궁 형상입니다. HCP 경로와 동일한 형상은 아닙니다.') : '이 경로의 대응 3D 형상은 없습니다. 아래 원자료 표에서 연결 영역을 탐색할 수 있습니다.'}</p><div class="probability-heading"><span class="eyebrow">TRACT ↔ CORTICAL REGION</span><h3>피질 영역별 겹침 확률</h3><p>신경로 마스크가 해당 영역과 겹친 비율입니다. 연결 강도나 신호 방향을 의미하지 않습니다.</p></div><label class="threshold-label" for="threshold">최소 표시 확률 <strong id="threshold-value">${Math.round(state.threshold * 100)}%</strong></label><input type="range" id="threshold" min="0" max="100" step="1" value="${Math.round(state.threshold * 100)}"/><label class="region-search">${icon('search', 16)}<input id="region-search" type="search" placeholder="HCP-MMP 영역 ID 검색" aria-label="HCP-MMP 영역 ID 검색" value="${escape(state.regionQuery)}"/></label><div id="region-summary"></div><div id="region-connections"></div><div id="region-detail"></div><p class="table-note">영역 ID는 ${sideName(t.side)} HCP-MMP 구획입니다. 이랑 형상에 일대일 대응하지 않습니다. 0% 임계값에서는 원본의 0도 표시합니다.</p><a class="data-download" href="data/tract_to_region_connectome_MMP.xlsx" download>${icon('download',16)} 원본 확률 표 다운로드</a>`;
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

function setMode(mode) {
  state.mode = mode; state.query = ''; state.isolate = false; state.hidden.clear(); $('#search').value = '';
  document.body.dataset.mode = mode;
  document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', b.dataset.mode === mode); });
  $('#connection-graph').hidden = mode !== 'connectome';
  $('#stage-kicker').textContent = mode === 'connectome' ? 'STRUCTURAL CONNECTIVITY' : 'HUMAN NEUROANATOMY';
  $('#stage-title').innerHTML = mode === 'connectome' ? '뇌를 잇는<br/>백질의 경로.' : '구조를 이해하고,<br/>연결을 발견하세요.';
  if (mode === 'connectome') {
    state.categories = new Set(Object.keys(CATEGORIES)); state.opacity = 0.06;
    const currentTract = connectome.tracts.find(t => t.id === state.tract);
    if (state.hemisphere !== 'both' && currentTract.side !== state.hemisphere) state.tract = connectome.tracts.find(t => t.code === currentTract.code && t.side === state.hemisphere).id;
    selectTract(state.tract);
  } else { state.opacity = 1; state.categories = new Set(Object.keys(CATEGORIES).filter(c => c !== 'tracts' && c !== 'white_matter')); selectPart(parts.find(p => p.label === 'Precentral gyrus' && p.side === (state.hemisphere === 'right' ? 'right' : 'left')).id); }
  sync(); renderList(); renderInspector(); scene?.view('oblique');
  $('#view-tag').textContent = '좌측 사선 보기';
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === 'oblique'));
}

$('#search').addEventListener('input', e => { state.query = e.target.value; renderList(); localize(); });
$('#opacity').addEventListener('input', e => { state.opacity = 1 - Number(e.target.value) / 100; sync(); });
$('#app').addEventListener('click', event => {
  const b = event.target.closest('button'); if (!b) return;
  if (b.dataset.language) { setLanguage(b.dataset.language); sync(); renderCategories(); renderList(); renderInspector(); }
  if (b.dataset.part) selectPart(Number(b.dataset.part));
  if (b.dataset.tract) selectTract(b.dataset.tract);
  if (b.dataset.mode && connectome) setMode(b.dataset.mode);
  if (b.dataset.category) { state.category = b.dataset.category; renderCategories(); renderList(); }
  if (b.dataset.view) { scene?.view(b.dataset.view); $('#view-tag').textContent = { front: '앞쪽 보기', back: '뒤쪽 보기', left: '좌측 보기', right: '우측 보기', top: '위쪽 보기', oblique: '좌측 사선 보기' }[b.dataset.view]; document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x === b)); }
  if (b.dataset.side) {
    state.hemisphere = b.dataset.side;
    if (state.mode === 'connectome' && state.hemisphere !== 'both') {
      const t = connectome.tracts.find(t => t.id === state.tract);
      selectTract(connectome.tracts.find(x => x.code === t.code && x.side === state.hemisphere).id);
    } else {
      const p = parts.find(p => p.id === state.selected);
      if (p && state.hemisphere !== 'both' && p.side !== 'median' && p.side !== state.hemisphere) state.selected = parts.find(x => x.label === p.label && x.side === state.hemisphere)?.id ?? null;
      sync(); renderList(); renderInspector();
    }
  }
  if (b.dataset.region) { state.region = b.dataset.region; renderConnections(); }
  if (b.id === 'focus-part') scene?.focus(state.selected);
  if (b.id === 'isolate-part') { state.isolate = !state.isolate; sync(); renderInspector(); if (state.isolate) scene?.focus(state.selected); else scene?.view('oblique'); }
  if (b.id === 'hide-part') { state.hidden.add(state.selected); state.selected = null; state.isolate = false; sync(); renderList(); renderInspector(); }
  if (b.id === 'reset') { state.hemisphere = 'both'; state.category = 'all'; state.regionQuery = ''; state.threshold = 0.05; setMode(state.mode); renderCategories(); }
  if (b.id === 'clear-search') { state.query = ''; state.category = 'all'; $('#search').value = ''; renderCategories(); renderList(); }
  if (b.id === 'zoom-in') scene?.zoom(0.8);
  if (b.id === 'zoom-out') scene?.zoom(1.25);
  if (b.id === 'about' || b.id === 'credits') $('#about-dialog').showModal();
  if (b.id === 'close-about') $('#about-dialog').close();
  localize();
});
$('#app').addEventListener('change', event => {
  if (event.target.dataset.layer) { const layer = event.target.dataset.layer; if (event.target.checked) state.categories.add(layer); else state.categories.delete(layer); sync(); }
});
$('#app').addEventListener('input', event => {
  if (event.target.id === 'threshold') { state.threshold = Number(event.target.value) / 100; $('#threshold-value').textContent = `${event.target.value}%`; renderConnections(); }
  if (event.target.id === 'region-search') { state.regionQuery = event.target.value; renderConnections(); }
  localize();
});
document.addEventListener('keydown', e => { if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && !$('#about-dialog').open) { e.preventDefault(); $('#search').focus(); } });

async function getJSON(url) { const response = await fetch(`${import.meta.env.BASE_URL}${url}`); if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`); return response.json(); }
async function start() {
  try {
    [parts, connectome] = await Promise.all([getJSON('models/parts.json'), getJSON('data/hcp-connectome.json')]);
    renderCategories(); renderList(); renderInspector(); localize();
    const { createScene } = await import('./scene.js');
    scene = await createScene($('#scene-host'), parts, {
      onSelect(id) {
        if (state.mode === 'connectome') { const t = connectome.tracts.find(t => t.modelMapping?.modelNodeId === id); if (t) selectTract(t.id); else { setMode('anatomy'); selectPart(id); } }
        else selectPart(id);
      },
      onProgress(value) { $('#load-progress').value = value; $('#load-label').textContent = value < 100 ? `해부 모델 불러오는 중 · ${value}%` : '준비 완료'; },
    });
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
