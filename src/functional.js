const motor = { title: 'Neuroscience · Motor cortex', url: 'https://www.ncbi.nlm.nih.gov/books/NBK10962/' };
const language = { title: 'Neuroscience · Aphasias', url: 'https://www.ncbi.nlm.nih.gov/books/NBK10972/' };
const memory = { title: 'Neuroscience · The limbic system', url: 'https://www.ncbi.nlm.nih.gov/books/NBK11060/' };

export const FUNCTIONAL_AREAS = [
  { id: 'sma', ko: '보완운동영역', en: 'Supplementary motor area, SMA', short: 'SMA', aliases: '보조운동영역 supplemental motor', defaultSide: 'left', view: 'medial',
    labels: ['Superior frontal gyrus'],
    location: '대뇌 안쪽면의 뒤쪽 위이마이랑 부근, 일차운동피질의 다리 영역 앞쪽에 위치합니다.',
    locationEn: 'On the medial posterior superior frontal region, anterior to the leg representation of primary motor cortex.',
    summary: '스스로 시작하는 동작의 준비, 동작 순서 구성과 양손 움직임의 조율에 관여합니다.',
    summaryEn: 'Contributes to preparation of self-initiated actions, movement sequences and coordination between the hands.',
    scope: '강조한 위이마이랑 전체가 SMA는 아닙니다. SMA가 위치하는 해부학적 참조 구조이며 SMA와 pre-SMA의 경계를 따로 분할하지 않았습니다.',
    scopeEn: 'The highlighted superior frontal gyrus is an anatomical reference, not an SMA segmentation. It includes cortex outside SMA; the SMA/pre-SMA boundary is not delineated.', source: motor },
  { id: 'premotor', ko: '전운동피질', en: 'Premotor cortex', short: 'Premotor', aliases: '운동앞피질 premotor PMC', defaultSide: 'left', view: 'lateral',
    labels: ['Precentral sulcus (inferior part)', 'Precentral sulcus (Superior part)', 'Middle frontal gyrus'],
    location: '가쪽 전두엽에서 일차운동피질 앞쪽에 위치하며, 등쪽과 배쪽 전운동 영역으로 나눕니다.',
    locationEn: 'In the lateral frontal lobe anterior to primary motor cortex, with dorsal and ventral premotor regions.',
    summary: '감각 단서에 맞는 동작을 선택하고 준비하며, 목표를 향한 팔·손 움직임 등을 계획하는 데 관여합니다.',
    summaryEn: 'Helps select and prepare movements using sensory cues, including planning goal-directed arm and hand actions.',
    scope: '중심앞고랑과 중간이마이랑을 위치 표지로 강조합니다. 이 구조 전체가 전운동피질인 것은 아니며 등쪽·배쪽 기능 경계는 표시하지 않습니다.',
    scopeEn: 'The precentral sulci and middle frontal gyrus are highlighted as landmarks. These entire structures are not premotor cortex, and dorsal/ventral functional boundaries are not shown.', source: motor },
  { id: 'broca', ko: '브로카 영역', en: "Broca's area", short: 'Broca', aliases: '브로카 언어 산출 BA44 BA45', defaultSide: 'left', view: 'lateral',
    labels: ['Opercular part of inferior frontal gyrus', 'Triangular part of inferior frontal gyrus'],
    location: '언어 우세 반구의 아래이마이랑 덮개부분과 삼각부분이 대표적인 해부학적 위치입니다. 보통 좌측을 예시로 사용합니다.',
    locationEn: 'Classically associated with pars opercularis and pars triangularis of the inferior frontal gyrus in the language-dominant hemisphere, usually illustrated on the left.',
    summary: '말과 문장을 구성하고 발화를 계획하는 언어 연결망에 참여합니다. 언어 산출은 이 영역만의 기능이 아닙니다.',
    summaryEn: 'Participates in networks for speech planning and the construction of language. Speech production depends on a wider network.',
    scope: 'BA44·45와 이랑 경계가 정확히 일치하지 않습니다. 우측을 선택하면 반대쪽 대응 구조를 보여주며, 개인의 언어 우세 반구를 판정하는 표시는 아닙니다.',
    scopeEn: 'Gyral borders do not exactly match areas 44/45. Selecting the right side shows homologous anatomy, not a determination of individual language dominance.', source: language },
  { id: 'wernicke', ko: '베르니케 영역', en: "Wernicke's area", short: 'Wernicke', aliases: '베르니케 언어 이해 BA22', defaultSide: 'left', view: 'lateral',
    labels: ['Superior temporal gyrus (Lateral part)', 'Middle temporal gyrus'],
    location: '전통적으로 언어 우세 반구의 뒤쪽 위측두 영역을 가리킵니다. 언어 이해에는 더 넓은 측두·두정 연결망이 참여합니다.',
    locationEn: 'Traditionally refers to the posterior superior temporal region of the language-dominant hemisphere. Comprehension involves a broader temporoparietal network.',
    summary: '말소리를 언어 정보와 연결하는 과정에 관여하며, 단어와 문장의 이해는 분산된 언어 연결망을 통해 이루어집니다.',
    summaryEn: 'Contributes to relating speech sounds to linguistic information; word and sentence comprehension depend on distributed language networks.',
    scope: '위·중간관자이랑을 참조 구조로 강조하며 이랑 전체를 베르니케 영역으로 정의하지 않습니다. 하나의 확정된 기능 경계나 개인의 언어 우세를 표시한 것은 아닙니다.',
    scopeEn: 'Superior and middle temporal gyri are highlighted as references, not as a definition of the entire Wernicke area. This is not a fixed functional boundary or an individual language-dominance map.', source: language },
  { id: 'hippocampus', ko: '해마', en: 'Hippocampus', short: 'Hippocampus', aliases: '기억 hippocampus 해마', defaultSide: 'both', view: 'oblique',
    labels: ['Hippocampus'],
    location: '양쪽 안쪽 측두엽 깊은 곳에 위치합니다. 주변 피질을 투명하게 하여 내부의 해마를 표시합니다.',
    locationEn: 'Deep within the medial temporal lobe on each side. The surrounding cortex is made transparent to reveal the hippocampi.',
    summary: '새로운 일화·서술 기억의 형성과 공간 탐색에 관여합니다. 기억이 저장되는 유일한 부위는 아닙니다.',
    summaryEn: 'Contributes to formation of new episodic/declarative memories and spatial navigation. It is not the sole site of memory storage.',
    scope: '해마 전체의 해부 형상입니다. CA1–CA4, 치아이랑, 해마이행부의 세부 구획이나 기능 활성도를 분할한 자료는 아닙니다.',
    scopeEn: 'These are whole anatomical hippocampal meshes, not delineated CA1–CA4, dentate gyrus or subicular fields, nor functional activation maps.', source: memory },
];

export function functionalParts(parts, area, hemisphere) {
  const side = hemisphere === 'both' ? area.defaultSide : hemisphere;
  return parts.filter(p => area.labels.includes(p.label) && (side === 'both' || p.side === side));
}
