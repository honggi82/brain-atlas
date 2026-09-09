const basics = { title: 'NINDS · Know Your Brain', url: 'https://www.ninds.nih.gov/sites/default/files/2025-05/know-your-brain-brian-basics.pdf' };
const anatomy = { title: 'OpenStax · The Central Nervous System', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system' };
const insula = { title: 'Avery et al. · Gustation and interoception', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4795826/' };

export const LOBES = [
  { id: 'frontal', region: 'Frontal lobe', ko: '전두엽', en: 'Frontal lobe', aliases: '이마엽', color: '#ca9c85',
    location: '중심고랑 앞쪽, 가쪽고랑 위쪽에 위치합니다.', locationEn: 'Anterior to the central sulcus and superior to the lateral sulcus.',
    summary: '수의운동, 행동 계획과 판단에 관여합니다. 언어 우세 반구의 일부 영역은 말 산출에 참여합니다.',
    summaryEn: 'Supports voluntary movement, planning and judgment. Regions in the language-dominant hemisphere contribute to speech production.', source: basics },
  { id: 'parietal', region: 'Parietal lobe', ko: '두정엽', en: 'Parietal lobe', aliases: '마루엽', color: '#c0af88',
    location: '중심고랑 뒤쪽, 후두엽 앞쪽에 위치합니다.', locationEn: 'Posterior to the central sulcus and anterior to the occipital lobe.',
    summary: '촉각과 몸의 위치 정보를 처리하고, 공간 주의와 감각 정보의 통합에 관여합니다.',
    summaryEn: 'Processes touch and body position, and contributes to spatial attention and sensory integration.', source: basics },
  { id: 'temporal', region: 'Temporal lobe', ko: '측두엽', en: 'Temporal lobe', aliases: '관자엽', color: '#bc9196',
    location: '대뇌 가쪽면의 가쪽고랑 아래에 위치합니다.', locationEn: 'On the lateral surface of the cerebrum, inferior to the lateral sulcus.',
    summary: '청각, 대상 인식과 기억에 관여하며, 일부 영역은 언어 이해에 참여합니다.',
    summaryEn: 'Contributes to hearing, object recognition and memory; some regions support language comprehension.', source: basics },
  { id: 'occipital', region: 'Occipital lobe', ko: '후두엽', en: 'Occipital lobe', aliases: '뒤통수엽', color: '#9faaa0',
    location: '대뇌의 뒤쪽 끝에 위치합니다. 안쪽면의 마루뒤통수고랑이 주요 경계입니다.', locationEn: 'At the posterior end of the cerebrum; the parieto-occipital sulcus marks its medial boundary.',
    summary: '일차시각피질을 포함하며, 시각 정보의 초기 처리와 분석에 관여합니다.',
    summaryEn: 'Contains primary visual cortex and supports early processing and analysis of visual information.', source: basics },
  { id: 'insula', region: 'Insula', ko: '섬엽', en: 'Insula', aliases: '섬피질 도엽 insular lobe', color: '#819faf',
    location: '가쪽고랑 깊은 곳에 있으며, 주변 뇌엽의 덮개에 가려져 있습니다.', locationEn: 'Deep within the lateral sulcus, covered by the surrounding opercula.',
    summary: '미각과 몸 내부 상태의 감각을 통합하는 데 관여합니다.',
    summaryEn: 'Contributes to the integration of taste and sensations from within the body.',
    note: '원본은 중심밑이랑과 앞·뒤 고랑을 포함한 복합 형상입니다. 섬엽만의 정밀 분할은 아닙니다.',
    noteEn: 'The source combines subcentral gyrus and anterior/posterior sulci in this mesh. It is not a precise segmentation of the insula alone.', source: insula },
  { id: 'limbic', region: 'Limbic lobe', ko: '변연엽', en: 'Limbic lobe', aliases: '둘레엽', color: '#aa98b6',
    location: '대뇌 안쪽면의 띠이랑과 해마곁 영역을 중심으로 설명하는 해부학적 분류입니다.', locationEn: 'An anatomical grouping centred on the cingulate and parahippocampal regions of the medial cerebrum.',
    summary: '기억, 정서와 행동 조절에 관여하는 연결망의 일부입니다. 변연계 전체와 같은 뜻은 아닙니다.',
    summaryEn: 'Participates in networks for memory, emotion and behavioural regulation. It is not synonymous with the entire limbic system.',
    note: '원본 분류를 따라 해마는 여기에, 해마곁이랑은 측두엽에 표시합니다. 이 목록은 변연엽 전체를 빠짐없이 분할한 것이 아닙니다.',
    noteEn: 'Following source metadata, hippocampus appears here and parahippocampal gyrus under temporal lobe. This list is not an exhaustive segmentation of the limbic lobe.', source: anatomy },
  { id: 'boundaries', region: 'Telencephalon', ko: '뇌엽 경계·기타 고랑', en: 'Lobar boundaries & other sulci', aliases: '종뇌 telencephalon', color: '#c2a294',
    location: '원본에서 특정 뇌엽 대신 종뇌로 분류한 고랑들을 모았습니다.', locationEn: 'Sulci classified as telencephalon rather than a specific lobe in the source.',
    summary: '중심고랑과 마루뒤통수고랑 등의 경계 표지입니다. 별도의 뇌엽이나 하나의 기능 영역을 뜻하지 않습니다.',
    summaryEn: 'Includes landmarks such as the central and parieto-occipital sulci. This group is neither an additional lobe nor a single functional region.', source: anatomy },
];

export const lobeForPart = part => part?.category === 'cortex' ? LOBES.find(lobe => lobe.region === part.region) : undefined;
export const partsInLobe = (parts, id) => parts.filter(part => lobeForPart(part)?.id === id);
