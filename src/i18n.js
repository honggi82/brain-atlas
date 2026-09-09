let language = 'ko';
try { language = localStorage.getItem('brain-atlas-language') === 'en' ? 'en' : 'ko'; } catch { /* Storage may be disabled by the browser. */ }
export const getLanguage = () => language;
export function setLanguage(value) {
  language = value === 'en' ? 'en' : 'ko';
  try { localStorage.setItem('brain-atlas-language', language); } catch { /* The current session still keeps the selection. */ }
}
export const partName = part => language === 'en' ? part.en : `${part.ko} (${part.en})`;
export const partSummary = part => language === 'en' ? part.summaryEn : part.summary;

const entries = {
  '기능 탐색': 'Functional anatomy', '대표 위치': 'Typical location', '참조 해부구조': 'Reference anatomy',
  '안쪽면 참조 보기': 'Medial reference view', '기능 영역 참조 보기': 'Functional reference view',
  '강조 색은 아래 참조 구조의 전체 형상입니다. 기능 활성도나 정확한 기능 경계를 뜻하지 않습니다.': 'Highlights show the complete reference structures below, not activation or exact functional boundaries.',
  '백질 연결 탐색': 'White matter explorer', '피질 연결 정보': 'Cortical connections',
  '선택한 경로의 피질 영역별 겹침 확률': 'Cortical overlap probabilities for the selected pathway',
  '연결표만 있는 경로': 'Pathways with table data only',
  '이 다발은 제공된 피질 연결표에 없습니다. 3D 경로는 볼 수 있지만 겹침 확률은 제공하지 않습니다.': 'This bundle is not in the supplied cortical table. Its 3D pathway is available, but overlap probabilities are not provided.',
  '왼쪽 목록에서 경로를 선택하면 피질 연결 정보를 볼 수 있습니다.': 'Select a pathway in the library to explore its cortical connections.',
  '3D에는 별도 해부 모형의 대응 구조를 표시합니다. 원본 섬유 궤적과 동일한 형상은 아닙니다.': 'The 3D view shows the corresponding structure from a separate anatomical model, not the original streamline geometry.',
  '이 경로에 대응하는 해부 모형이 없습니다.': 'No corresponding anatomical model is available for this pathway.',
  '뇌엽 색상 · 선택하여 설명 보기': 'Lobe colours · select for details',
  '뇌엽': 'Cerebral lobe', '해부학적 경계': 'Anatomical landmarks', '하위 구조': 'Substructures',
  '위치와 경계': 'Location & boundaries', '주요 기능': 'Main functions', '설명 보기': 'About this lobe', '설명 출처': 'Description sources',
  '현재 반구의 하위 구조 · 왼쪽 목록에서 선택': 'substructures in the current hemisphere view · select in the library',
  '뇌엽은 여러 기능과 연결망에 참여합니다. 색상은 해부학적 분류이며 기능의 정확한 경계가 아닙니다.': 'Each lobe participates in several functions and networks. Colours identify anatomical groups, not exact functional boundaries.',
  '섬유 추적': 'Tractography', '해부 모형': 'Anatomical model', '경로 표현': 'Pathway view',
  '전체 표시': 'Show all', '전체 숨기기': 'Hide all', '모두 접기': 'Collapse all', '표시': 'Visible',
  '표시 밀도': 'Display density', '주변 경로': 'Context tracts', '전체 섬유': 'All fibres',
  '좌우': 'Left–right', '앞뒤': 'Anterior–posterior', '위아래': 'Superior–inferior', '색상 = 섬유 방향': 'Colour = orientation',
  '원본 섬유 궤적': 'Source-derived streamlines', '섬유 궤적을 불러오는 중': 'Loading streamlines',
  '선택 다발': 'Selected bundle',
  '해부 모형 기준: ': 'For the anatomical model: ', '정밀 섬유 보기': 'Detailed streamline view',
  '섬유 추적 보기에서는 HCP1065 원본의 68개 다발과 98,484개 궤적 표본을 제공합니다. 이 보기의 좌표계는 해부 모형과 별개입니다. 연결표 52개 열 중 48개가 원본 궤적에 대응하며, PTAT·C_R은 양쪽 모두 미대응으로 남겨두었습니다.': 'The streamline view provides 68 source-derived HCP1065 bundles and 98,484 sampled trajectories in imaging coordinates separate from the anatomical illustration. Forty-eight of 52 table columns match source trajectories; PTAT and C_R remain unresolved in both hemispheres.',
  '정밀 궤적을 불러오지 못했습니다. 다시 시도해주세요.': 'Unable to load detailed streamlines. Please retry.',
  '이 코드에 대응하는 원본 궤적이 없습니다.': 'No verified source trajectory matches this code.',
  '개 streamline · 표시용 표본': 'streamlines · display subset',
  '백질 섬유 탐색': 'Explore white matter fibres', '집단 평균 · 원본 궤적 표본': 'Population average · source-derived subset',
  '개 섬유 다발': 'fibre bundles', '연합 섬유': 'Association fibres', '투사 섬유': 'Projection fibres',
  '맞교차 섬유': 'Commissural fibres', '소뇌 연결': 'Cerebellar connections',
  '전체 백질 섬유': 'Whole-brain white matter', '원본 궤적 수': 'Source streamlines', '제공하는 궤적 표본': 'Bundled streamline subset',
  '피질 연결 확률 보기': 'Explore cortical overlap', '섬유 추적으로 보기': 'View streamlines',
  '전체 섬유에서 다발을 클릭하거나 왼쪽 목록에서 선택하세요.': 'Select a bundle in the whole-brain view or the library on the left.',
  'HCP1065 집단 평균의 원본 궤적을 표시합니다. 해부 모형과 별도의 영상 좌표계입니다.': 'Original HCP1065 population-average trajectories are shown in native imaging coordinates, separate from the anatomical illustration.',
  '원본 약어에 대응하는 궤적을 확인하지 못했습니다. 다른 경로로 대체하지 않습니다.': 'No verified source trajectory matches this abbreviation. Another pathway is not substituted.',
  '방향 색상 읽기': 'Reading orientation colours',
  '빨강은 좌우, 초록은 앞뒤, 파랑은 위아래 방향을 나타냅니다. 중간 방향은 혼합색입니다. 색은 신호의 진행 방향이나 연결 강도가 아닙니다.': 'Red encodes left–right, green anterior–posterior, and blue superior–inferior orientation. Oblique orientations mix colours. Colours do not encode signal travel direction or connection strength.',
  '각 선은 확산 MRI에서 재구성한 궤적이며 축삭 하나를 뜻하지 않습니다. 실제 신경 분지·시냅스를 직접 측정한 자료가 아니며, 개인의 DTI 검사 결과도 아닙니다.': 'Each line is a trajectory reconstructed from diffusion MRI, not one axon. It does not directly measure neural branches or synapses and is not an individual DTI examination.',
  '원자료': 'Source data', '섬유 자료의 처리 방법 ↗': 'Streamline processing methods ↗',
  '백질의 섬유를,': 'White matter fibres.', '더 가까이.': 'A closer look.',
  '뇌의 구조와 연결': 'Brain anatomy & connectivity',
  '구조 검색으로 이동': 'Skip to structure search',
  'Brain Atlas 처음으로': 'Brain Atlas home',
  '탐색 모드': 'Exploration mode',
  '해부학': 'Anatomy', '검토본': 'Preview',
  '데이터 출처와 사용 안내': 'Data sources and guide',
  '구조 목록': 'Structure library', '뇌 구조 탐색': 'Explore anatomy', '연결 경로 탐색': 'Explore pathways',
  '부위 이름·기능 검색': 'Search names or functions', '부위 이름 또는 기능 검색': 'Search by name or function',
  '신경로 이름·약어 검색': 'Search tract names or codes', '구조를 선택하세요': 'Select a structure',
  '초기화': 'Clear', '검색 결과': 'Search results', '모델을 불러오는 중': 'Loading the model',
  '3D 탐색 화면': '3D exploration', '구조를 이해하고,': 'Explore anatomy.', '연결을 발견하세요.': 'Discover connections.',
  '좌측 사선 보기': 'Left oblique view', '앞쪽 보기': 'Anterior view', '뒤쪽 보기': 'Posterior view',
  '좌측 보기': 'Left lateral view', '우측 보기': 'Right lateral view', '위쪽 보기': 'Superior view',
  '해부 모델 준비 중': 'Preparing anatomy', '실제 분할 형상을 불러오고 있습니다.': 'Loading segmented anatomical geometry.',
  '카메라 방향': 'Camera orientation', '사선 보기': 'Oblique view',
  '앞': 'Ant', '뒤': 'Post', '좌': 'L', '우': 'R', '위': 'Sup', '확대': 'Zoom in', '축소': 'Zoom out',
  '표시할 반구': 'Visible hemisphere', '양쪽': 'Both', '좌뇌': 'Left', '우뇌': 'Right',
  '전체 복원': 'Reset view', '피질 투명도': 'Cortical transparency', '표면 보기': 'Surface', '내부 보기': 'Interior',
  '드래그하여 회전 · 휠로 확대 · 구조를 클릭하여 선택': 'Drag to rotate · Scroll to zoom · Click to select',
  '선택한 구조 설명': 'Selected structure details',
  '교육용 참조 해부도 · 구조의 모양과 기능 경계는 다를 수 있습니다.': 'Educational atlas · Anatomical and functional boundaries may differ.',
  '출처 · 모델의 범위': 'Sources & scope', '닫기': 'Close', '이 아틀라스에 대하여': 'About this atlas',
  '대학·의학 학습을 위한 뇌 해부도와 구조적 연결 탐색 도구입니다. 한국어 요약은 학습을 돕기 위한 설명이며 각 구조는 여러 기능과 연결망에 참여합니다.': 'An educational brain anatomy and structural connectivity explorer for university and medical learners. Summaries describe representative roles; each structure participates in multiple functions and networks.',
  'Brain Project의 Z-Anatomy / BodyParts3D 모델에서 뇌 구조와 백질 경로 325개 형상을 선택하고 BodyParts3D의 좌우 뇌섬엽 2개를 추가했습니다. 총 327개 형상이며, 서로 다른 영문 이름은 175개입니다. 혈관·말초 뇌신경은 이 버전의 범위에서 제외했습니다.': 'The viewer selects 325 anatomical structures and white matter pathways from Brain Project and adds two BodyParts3D insula meshes: 327 structures with 175 distinct labels. Blood vessels and peripheral cranial nerves are outside this version.',
  '추가된 영상 아틀라스 기반 핵과 신경로는 약 7 mm 정합 오차가 보고된 교육용 근사 형상입니다. 신경로의 가느다란 관은 전체 섬유다발을 대표하는 단순화이며, 연구 좌표·MRI 단면·수술 계획용 모델이 아닙니다.': 'Added nuclei and tracts are educational approximations registered from imaging atlases, with about 7 mm reported alignment error. Thin tract tubes are simplified representative geometry, not entire fibre bundles, research coordinates, MRI slices or surgical planning models.',
  '구조적 Connectome': 'Structural connectome',
  'Yeh (2022)의 HCP1065 신경로–피질영역 표를 사용합니다. 180개 HCP-MMP 영역 × 좌우 52개 열의 9,360개 값을 보존했습니다. 수치는 신경로 마스크가 영역과 겹치는 피험자 비율로, 축삭 수·신호 방향·영역 간 연결 강도·기능적 상관이 아닙니다. 통과 섬유 및 tractography의 오차가 포함될 수 있습니다.': 'The HCP1065 tract-to-region table from Yeh (2022) preserves all 9,360 values across 180 HCP-MMP areas and 52 bilateral tract columns. Values are the proportion of subjects with tract-mask overlap in a region, not axon counts, signal direction, region-to-region strength or functional correlation. Passing fibres and tractography errors can affect the estimates.',
  'HCP-MMP 영역과 해부 모델의 이랑은 서로 다른 구획입니다. 영역 ID를 3D 피질에 임의 대응시키지 않습니다. 표의 36개 열은 HCP 유래 근사 신경로, 2개 뇌궁 열은 별도 Z-Anatomy 형상에 이름·좌우 기준으로 대응합니다. 나머지 14개 열은 표로만 제공합니다.': 'HCP-MMP areas and anatomical gyri are different parcellations. MMP IDs are not arbitrarily mapped onto the cortex. Thirty-six columns have name-and-side matches to approximate HCP-derived tracts; two fornix columns match separate Z-Anatomy geometry. The other 14 columns are available as tables only.',
  '원본의 PTAT/TPAT 및 C_R/C_PR 약어 차이를 보존했습니다. 전체 연구 대상은 1,065명이지만 일부 열의 분모가 다르므로 확률을 인원수로 환산하지 않습니다. 0은 원본의 0이며, 화면 임계값은 데이터 자체를 바꾸지 않습니다.': 'Source discrepancies between PTAT/TPAT and C_R/C_PR are preserved. The cohort comprised 1,065 people, but some tract denominators differ; probabilities are not converted to participant counts. Zeros remain source zeros, and display thresholds do not alter the data.',
  'Yeh 2022 · 연구 방법 및 한계 ↗': 'Yeh 2022 · Methods and limitations ↗',
  '원본 연결 확률 표 다운로드': 'Download original connectivity workbook',
  '저작권·라이선스·HCP 감사 문구': 'Attribution, licences and HCP acknowledgement',
  '선택 해제': 'Selection cleared', '선택됨': 'selected',
  'HCP-MMP · 좌우 각 26종': 'HCP-MMP · 26 tract types per side',
  '175개 이름 · 327개 형상': '175 names · 327 structures',
  '원본 약어': 'source code', '표 전용': 'table only',
  '검색 결과가 없습니다.': 'No matching structures.', '이름이나 약어를 바꿔보세요.': 'Try another name or code.',
  '다른 이름이나 기능으로 찾아보세요.': 'Try another name or function.',
  '뇌 또는 목록에서 구조를 선택하세요.': 'Select a structure in the brain or library.',
  '이 구조의 역할': 'Function & anatomy', '가까이': 'Focus', '단독 보기': 'Isolate', '숨기기': 'Hide',
  '영역': 'Region', '반구': 'Hemisphere', '좌측': 'Left', '우측': 'Right', '정중선': 'Midline',
  '영상 아틀라스 기반 근사 형상': 'Approximate atlas-derived geometry',
  '에서 유래했습니다. 해부 모델에 맞춘 위치·경로에는 오차가 있습니다.': ' source. Alignment to the anatomical model is approximate.',
  '표시할 구조': 'Visible layers', '모델 출처': 'Model source',
  '신경해부학 배경 읽기 ↗': 'Read neuroanatomy background ↗', '형상·명칭의 출처 ↗': 'Model and naming provenance ↗',
  '원본 표의 약어를 보존했습니다.': 'The original table code is retained.',
  '3D에는 이름·좌우가 대응하는 HCP 유래 근사 경로를 표시합니다.': 'The 3D view shows an approximate HCP-derived tract matched by name and hemisphere.',
  '3D는 별도 Z-Anatomy 뇌궁 형상입니다. HCP 경로와 동일한 형상은 아닙니다.': 'The 3D view uses separate Z-Anatomy fornix geometry, not the HCP tract geometry.',
  '이 경로의 대응 3D 형상은 없습니다. 아래 원자료 표에서 연결 영역을 탐색할 수 있습니다.': 'No matching 3D geometry is available for this tract. Explore its cortical regions in the source table below.',
  '피질 영역별 겹침 확률': 'Cortical overlap probability',
  '신경로 마스크가 해당 영역과 겹친 비율입니다. 연결 강도나 신호 방향을 의미하지 않습니다.': 'The proportion of subjects whose tract mask overlaps this region. This is not connection strength or signal direction.',
  '최소 표시 확률': 'Minimum probability', 'HCP-MMP 영역 ID 검색': 'Search HCP-MMP area IDs',
  '영역 ID': 'Area ID', '확률': 'Probability',
  '조건에 맞는 영역이 없습니다.': 'No areas match these filters.',
  '임계값을 낮추거나 검색어를 지워보세요.': 'Lower the threshold or clear the search.',
  '표시 조건에 맞는 양의 연결이 없습니다.': 'No positive values match these filters.',
  '양의 값이 없습니다.': 'No positive values.',
  '원본 확률 표 다운로드': 'Download source workbook',
  '뇌를 잇는': 'White matter', '백질의 경로.': 'pathways.',
  '해부 모델 불러오는 중': 'Loading anatomy', '준비 완료': 'Ready',
  '3D 모델을 불러오지 못했습니다.': 'Unable to load the 3D model.',
  '연결 상태와 WebGL 지원을 확인한 뒤 새로고침해주세요. 부위 목록과 설명은 데이터가 로드된 경우 계속 사용할 수 있습니다.': 'Check your connection and WebGL support, then reload. Structure names and descriptions remain available if their data loaded successfully.',
  '다시 불러오기': 'Reload',
  '뇌 3D 해부도. 드래그로 회전, 휠로 확대, 구조를 클릭해 선택합니다.': '3D brain anatomy. Drag to rotate, scroll to zoom, and click a structure to select it.',
  '대뇌피질': 'Cerebral cortex', '기저핵·편도체': 'Basal ganglia & amygdala', '간뇌': 'Diencephalon',
  '백질·교련': 'White matter & commissures', '뇌간': 'Brainstem', '소뇌': 'Cerebellum',
  '뇌실': 'Ventricles', '백질 연결 경로': 'White matter tracts', '전체': 'All', '피질': 'Cortex',
  '심부 핵': 'Deep nuclei', '백질': 'White matter', '신경로': 'Tracts',
};

const replacements = Object.entries(entries).filter(([from]) => from.length > 2).sort((a, b) => b[0].length - a[0].length);

export function english(text) {
  const trimmed = text.trim();
  if (entries[trimmed]) return text.replace(trimmed, entries[trimmed]);
  if (/^\d+개 경로 열$/.test(trimmed)) return trimmed.replace('개 경로 열', ' tract columns');
  if (/^\d+개 형상$/.test(trimmed)) return trimmed.replace('개 형상', ' structures');
  if (/^\d+ \/ 180개 영역 · /.test(trimmed)) return trimmed.replace('개 영역', ' areas').replace('좌측', 'Left').replace('우측', 'Right');
  if (/^표의 상위 \d+개 연결 · 도식$/.test(trimmed)) return trimmed.replace('표의 상위 ', 'Top ').replace('개 연결 · 도식', ' values · schematic');
  if (trimmed.startsWith('영역 ID는 ')) return `Area IDs refer to ${trimmed.includes('우측') || trimmed.includes('Right') ? 'right' : 'left'} HCP-MMP parcels, not individual gyral meshes. At a 0% threshold, source zeros are included.`;
  if (trimmed.endsWith('의 다른 경로')) return trimmed.replace('좌측', 'Left').replace('우측', 'Right').replace('의 다른 경로', ' — associated tracts');
  let output = text.replace('영역 연결 탐색', 'area connections').replace('신경로와 상위 피질 영역의 겹침 확률', 'tract overlap with top cortical areas');
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

export const ui = text => language === 'en' ? english(text) : text;
const originals = new WeakMap();
const attributes = new WeakMap();

export function localize(root = document.body) {
  document.documentElement.lang = language;
  document.title = language === 'en' ? 'Brain Atlas — Anatomy & connectivity' : 'Brain Atlas — 뇌의 구조와 연결';
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) continue;
    const previous = originals.get(node);
    const source = previous && previous.output === node.nodeValue ? previous.source : node.nodeValue;
    const output = ui(source);
    originals.set(node, { source, output });
    if (output !== node.nodeValue) node.nodeValue = output;
  }
  for (const element of root.querySelectorAll('[aria-label],[placeholder],[title]')) {
    const saved = attributes.get(element) || {};
    for (const name of ['aria-label', 'placeholder', 'title']) {
      if (!element.hasAttribute(name)) continue;
      const value = element.getAttribute(name);
      const source = saved[name]?.output === value ? saved[name].source : value;
      const output = ui(source);
      saved[name] = { source, output };
      if (value !== output) element.setAttribute(name, output);
    }
    attributes.set(element, saved);
  }
  for (const button of root.querySelectorAll('[data-language]')) {
    const active = button.dataset.language === language;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}

const regions = { 'Frontal lobe': '전두엽', 'Parietal lobe': '두정엽', 'Temporal lobe': '측두엽', 'Occipital lobe': '후두엽', 'Limbic lobe': '변연엽', 'Midbrain': '중뇌', 'Cerebellum': '소뇌', 'Brainstem': '뇌간', 'Diencephalon': '간뇌', 'Basal ganglia': '기저핵', 'Thalamus': '시상', 'Hypothalamus': '시상하부', 'Amygdala': '편도체', 'White matter': '백질', 'Ventricles': '뇌실' };
export const regionName = value => language === 'ko' && regions[value] ? `${regions[value]} (${value})` : value;
