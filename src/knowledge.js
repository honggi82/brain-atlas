import { EN_SUMMARIES, EN_TERMS, KO_TERMS, ALIASES } from './knowledge-en.js';

export const SOURCES = {
  anatomy: { title: 'OpenStax · Central nervous system', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system' },
  motor: { title: 'OpenStax · Upper motor systems', url: 'https://openstax.org/books/introduction-behavioral-neuroscience/pages/10-3-our-brain-gets-involved-responsibilities-of-upper-motor-systems' },
  atlas: { title: 'Brain Project · anatomy data & provenance', url: 'https://github.com/itayinbarr/brainproject' },
  hcp: { title: 'HCP1065 · tractography atlas', url: 'https://brain.labsolver.org/hcp_trk_atlas.html' },
  terminology: { title: 'Terminology · naming conventions', url: 'TERMINOLOGY.md' },
};

export const CATEGORIES = {
  cortex: { name: '대뇌피질', color: '#c28c79', short: '피질' },
  deep_grey: { name: '기저핵·편도체', color: '#ae82a8', short: '심부 핵' },
  diencephalon: { name: '간뇌', color: '#819ec1', short: '간뇌' },
  white_matter: { name: '백질·교련', color: '#b8ac84', short: '백질' },
  brainstem: { name: '뇌간', color: '#bca169', short: '뇌간' },
  cerebellum: { name: '소뇌', color: '#c88665', short: '소뇌' },
  ventricles: { name: '뇌실', color: '#73adb3', short: '뇌실' },
  tracts: { name: '백질 연결 경로', color: '#549e96', short: '신경로' },
};

// The atlas labels retain the source's nomenclature; Korean summaries are educational adaptations.
const rows = `
Posterior transverse collateral sulcus|뒤가로곁고랑|측두엽 아래쪽 곁고랑의 뒤 가로 부분입니다. 주변 이랑의 위치를 구분하는 해부학적 표지입니다.
Angular gyrus|각이랑|아래두정소엽의 뒤쪽 부분으로 언어 이해, 의미 처리, 수 개념과 여러 감각 정보의 통합에 관여합니다.
Anterior occipital sulcus|앞뒤통수고랑|후두엽 앞쪽 경계 부근의 고랑으로 인접 피질의 위치를 구분합니다. 고랑 자체를 독립된 기능 영역으로 보지는 않습니다.
Calcarine sulcus|새발톱고랑|후두엽 안쪽 면의 고랑입니다. 양쪽 벽을 따라 일차시각피질이 위치합니다.
Central sulcus|중심고랑|전두엽과 두정엽 사이의 경계입니다. 앞의 중심앞이랑과 뒤의 중심뒤이랑을 구분합니다.
Cingulate gyrus (Posteroventral part)|띠이랑 뒤아래부분|안쪽 대뇌피질의 후방 띠 영역으로 기억 및 공간적 맥락 처리와 관련된 연결망에 참여합니다.
Cingulate gyrus and sulcus (Middle anterior part)|띠이랑·띠고랑 중간앞부분|띠피질의 앞쪽 중간 영역으로 행동 조절, 노력 배분, 통증의 행동적 반응과 관련됩니다. 표시 형상에는 고랑이 함께 포함됩니다.
Cingulate gyrus and sulcus (Middle posterior part)|띠이랑·띠고랑 중간뒤부분|띠피질의 뒤쪽 중간 영역으로 감각과 행동의 통합에 관여합니다. 기능 경계가 형상의 경계와 정확히 일치하지는 않습니다.
Cingulate gyrus and sulcus (Posterior dorsal part)|띠이랑·띠고랑 뒤위부분|뒤띠피질 주변으로 내부 지향적 사고, 기억과 주의 전환에 관여하는 연결망에 참여합니다.
Cingulate sulcus (Marginal part)|띠고랑 모서리부분|띠고랑이 위쪽으로 향하는 부분으로 중심곁소엽의 뒤쪽을 구분하는 표지입니다.
Circular sulcus of insula|섬엽둘레고랑|섬엽과 이를 덮는 이마·마루·관자 덮개를 구분하는 경계입니다.
Collateral sulcus|곁고랑|측두·후두엽 아래안쪽의 고랑으로 혀이랑·해마곁이랑과 가쪽의 방추상 영역을 구분합니다.
Cuneus|쐐기소엽|새발톱고랑 위쪽의 안쪽 후두엽입니다. 시각 정보 처리에 참여합니다.
Hippocampus|해마|안쪽 측두엽의 구조로 새로운 일화·서술 기억의 형성과 공간 탐색에 핵심적으로 관여합니다.
Inferior occipital gyrus and sulcus|아래뒤통수이랑·고랑|후두엽 아래쪽의 피질과 경계입니다. 시각적 형태 정보를 처리하는 연결망에 참여합니다.
Inferior temporal gyrus|아래관자이랑|측두엽 아래쪽의 연합피질로 복잡한 물체와 시각적 형태의 인식에 관여합니다.
Insula (Subcentral gyrus and ant. and post. sulci)|섬엽·중심밑이랑 주변|가쪽고랑 깊은 곳의 피질과 인접 구조입니다. 섬엽은 몸속 감각, 미각, 통증 및 현저성 처리에 관여합니다.
Lat Fis-ant-Horizont|가쪽고랑 앞수평가지|가쪽고랑의 앞 수평 가지로 아래이마이랑의 삼각부분과 눈확부분을 구분하는 표지입니다.
Lat Fis-ant-Vertical|가쪽고랑 앞오름가지|가쪽고랑의 앞 오름 가지로 아래이마이랑의 덮개부분과 삼각부분을 구분합니다.
Lat Fis-post|가쪽고랑 뒤가지|측두엽을 위쪽의 전두·두정엽과 구분하는 큰 고랑입니다. 섬엽은 이 고랑 깊은 곳에 위치합니다.
Lateral occipital gyrus (Middle occipital gyrus)|가쪽뒤통수이랑·중간뒤통수이랑|후두엽 가쪽의 연합시각피질로 물체 형태와 시각적 장면의 분석에 참여합니다.
Lateral occipitotemporal gyrus|가쪽뒤통수관자이랑·방추상회|배쪽 시각 경로의 일부로 얼굴·물체·문자 등 복잡한 시각 범주의 인식에 관여합니다.
Lingual gyrus|혀이랑|새발톱고랑 아래쪽의 안쪽 후두엽입니다. 시각 정보와 복잡한 시각적 패턴의 처리에 참여합니다.
Lunate sulcus|반달고랑|후두엽 가쪽의 형태적 표지로 개인 간 변이가 큽니다. 일정한 기능 경계로 단정할 수 없습니다.
Medial occipitotemporal gyrus (Parahippocampal)|안쪽뒤통수관자이랑·해마곁이랑|해마 주변의 안쪽 측두피질로 장면·장소·맥락 정보와 기억 처리에 관여합니다.
Middle frontal gyrus|중간이마이랑|전두 연합피질의 일부로 작업기억, 주의, 계획과 인지 조절에 참여합니다.
Middle temporal gyrus|중간관자이랑|의미 지식과 언어 이해, 시각 및 사회적 정보 처리에 관여하는 측두 연합피질입니다.
Occipital pole|뒤통수극|대뇌의 가장 뒤쪽 부분입니다. 주변 시각피질에는 중심 시야의 표상이 크게 분포합니다.
Occipitotemporal sulcus (Lateral part)|뒤통수관자고랑 가쪽부분|측두·후두엽 아래쪽 이랑들을 구분하는 경계로 시각 연합피질의 위치를 찾는 표지입니다.
Orbital gyri (Frontomarginal gyrus and sulcus)|눈확이랑·이마모서리이랑 주변|전두엽 아래면 앞쪽 영역으로 보상 가치, 선택과 정서적 정보의 평가에 관여하는 피질과 인접합니다.
Orbital gyri|눈확이랑|눈확 위쪽 전두피질로 보상·처벌의 가치 평가, 의사결정 및 사회적 행동 조절에 관여합니다.
Orbital part of inferior frontal gyrus|아래이마이랑 눈확부분|아래전두피질의 앞아래 부분으로 의미 처리 및 정서·가치 정보와 관련된 조절에 참여합니다.
Orbital sulci (H-shaped orbital sulci)|눈확고랑 H자부분|전두엽 아래면의 눈확이랑들을 구분하는 고랑입니다. 형태와 분지는 개인마다 다를 수 있습니다.
Orbital sulci (Lateral Orbital sulcus)|가쪽눈확고랑|눈확피질의 가쪽 경계를 구분하는 해부학적 표지입니다.
Paracentral gyrus and sulcus|중심곁이랑·고랑|대뇌 안쪽 면에서 운동·체성감각 피질의 연속부를 포함하며 주로 반대쪽 다리의 운동·감각 표상과 관련됩니다.
Postcentral gyrus|중심뒤이랑|일차체성감각피질이 위치하며 반대쪽 몸의 촉각·고유감각 등 체성감각 정보를 처리합니다.
Precentral gyrus|중심앞이랑|일차운동피질이 위치하며 주로 반대쪽 몸의 수의운동 명령 생성과 조절에 관여합니다.
Precuneus|쐐기앞소엽|안쪽 두정피질로 시공간 심상, 일화기억, 자기 관련 사고에 관여하는 연결망에 참여합니다.
Inferior frontal sulcus|아래이마고랑|중간이마이랑과 아래이마이랑을 구분하는 경계입니다.
Inferior temporal sulcus|아래관자고랑|중간관자이랑과 아래관자이랑을 구분하는 경계입니다.
Intraparietal sulcus|마루속고랑|위·아래두정소엽을 나누는 고랑입니다. 양쪽 벽의 피질은 시공간 주의와 눈·손 동작, 수량 처리에 관여합니다.
Olfactory sulcus|후각고랑|전두엽 아래면의 고랑으로 후각망울·후각로가 인접하며 곧은이랑과 눈확이랑을 구분합니다.
Opercular part of inferior frontal gyrus|아래이마이랑 덮개부분|아래전두피질의 뒤쪽 부분입니다. 우세반구에서 말소리·발화 처리에 관여하며 행동 조절에도 참여합니다.
Paracentral sulcus|중심곁고랑|대뇌 안쪽 면에서 중심곁소엽의 앞쪽을 구분하는 표지입니다.
Parieto-occipital sulcus|마루뒤통수고랑|안쪽 면에서 두정엽과 후두엽을 구분하며 쐐기앞소엽과 쐐기소엽의 경계가 됩니다.
Postcentral sulcus|중심뒤고랑|중심뒤이랑의 뒤쪽 경계로 체성감각피질과 두정 연합피질의 위치를 구분합니다.
Precentral sulcus (inferior part)|중심앞고랑 아래부분|중심앞이랑 앞쪽의 아래 경계로 운동피질의 위치를 찾는 표지입니다.
Precentral sulcus (Superior part)|중심앞고랑 위부분|중심앞이랑 앞쪽의 위 경계로 일차운동피질과 앞쪽 운동 관련 피질을 구분하는 표지입니다.
Straight gyrus (Gyrus rectus)|곧은이랑|전두엽 아래안쪽에서 후각고랑 안쪽에 위치합니다. 안쪽 눈확전두 연결망의 일부입니다.
Subparietal sulcus|마루밑고랑|안쪽 두정엽에서 쐐기앞소엽과 뒤띠 영역을 구분하는 표지입니다.
Sulcus interm prim-Jensen|중간고랑·젠센고랑|아래두정소엽에서 모서리위이랑과 각이랑 주변을 구분하는 변이성 고랑입니다.
Superior frontal gyrus|위이마이랑|등쪽·안쪽 전두피질로 계획, 작업기억, 자기 관련 처리 및 운동 준비의 여러 연결망에 참여합니다.
Superior frontal sulcus|위이마고랑|위이마이랑과 중간이마이랑 사이의 경계입니다.
Superior occipital gyri|위뒤통수이랑|후두엽 위쪽의 시각 관련 피질로 시각·공간 정보 처리에 참여합니다.
Superior parietal lobule|위두정소엽|몸과 공간에 대한 감각 정보를 통합하여 시각에 따른 손 동작과 공간적 주의를 돕습니다.
Superior temporal gyrus (Lateral part)|위관자이랑 가쪽부분|청각 및 언어 관련 처리에 관여하는 측두피질입니다. 기능은 앞뒤 위치와 반구에 따라 달라집니다.
Superior temporal sulcus|위관자고랑|위·중간관자이랑 사이의 고랑입니다. 인접 피질은 말소리, 생물학적 움직임과 사회적 신호 처리에 참여합니다.
Supramarginal gyrus|모서리위이랑|아래두정소엽의 앞쪽 부분으로 음운 처리, 몸의 표상 및 도구 사용과 관련된 감각운동 통합에 참여합니다.
Temporal plane|관자평면|측두엽의 위쪽 면에 있는 청각 관련 영역으로 복잡한 소리와 언어 처리에 참여합니다.
Temporal pole|관자극|측두엽의 앞끝으로 의미 지식, 사회적 정보와 정서적 맥락을 통합하는 데 관여합니다.
Transverse frontopolar gyrus and sulcus|가로이마극이랑·고랑|전두엽 맨 앞부분의 피질과 경계입니다. 이마극 연결망은 추상적 계획과 여러 목표의 조절에 관여합니다.
Transverse occipital sulcus|가로뒤통수고랑|후두엽 위쪽에서 이랑을 구분하며 마루속고랑 뒤쪽과 연관되는 해부학적 표지입니다.
Transverse temporal gyri|가로관자이랑·헤슐이랑|위관자면 깊은 곳에 위치하며 일차청각피질을 포함합니다. 소리의 기본 특성을 처리합니다.
Triangular part of inferior frontal gyrus|아래이마이랑 삼각부분|아래전두피질의 중간 부분입니다. 우세반구에서 의미 선택과 언어 생산에 관여합니다.
Accessory nucleus of oculomotor nerve|눈돌림신경 덧핵|에딩거–베스트팔핵으로 불리며 부교감성 경로를 통해 동공 수축과 수정체 조절에 관여합니다.
Aqueduct of midbrain|중뇌수도관|셋째뇌실과 넷째뇌실을 잇는 좁은 통로로 뇌척수액이 흐릅니다.
Inferior colliculus|아래둔덕|중뇌의 청각 중계 구조로 소리 정보를 통합해 시상의 안쪽무릎체로 전달합니다.
Interpeduncular fossa|대뇌다리사이오목|중뇌 아래면에서 양쪽 대뇌다리 사이의 공간입니다. 주변 구조를 찾는 표지입니다.
Medulla oblongata|연수|뇌간의 아래부분으로 호흡·순환의 조절 회로와 여러 감각·운동 경로 및 뇌신경핵을 포함합니다.
Midbrain|중뇌|뇌간 위부분으로 눈 운동, 시청각 반사, 각성 및 운동 조절과 관련된 구조들이 위치합니다.
Motor nucleus of facial nerve|얼굴신경 운동핵|교뇌의 운동핵으로 얼굴 표정근을 지배하는 얼굴신경 운동섬유가 시작됩니다.
Nucleus of abducens nerve|갓돌림신경핵|교뇌에서 눈의 가쪽 움직임과 두 눈의 수평 주시를 조절하는 회로에 참여합니다.
Nucleus of oculomotor nerve|눈돌림신경핵|중뇌에서 여러 바깥눈근육과 위눈꺼풀올림근의 운동을 조절합니다.
Olive|올리브|연수의 표면 융기로 아래올리브핵이 깊이 위치합니다. 해당 핵은 소뇌 운동학습에 필요한 신호를 전달합니다.
Red nucleus|적색핵|중뇌의 운동 관련 핵으로 소뇌와 운동계 사이의 조절 회로에 참여합니다.
Pons|교뇌|대뇌와 소뇌 사이의 정보를 중계하고 호흡·수면 및 여러 뇌신경 기능에 관련된 회로를 포함합니다.
Pyramid of medulla oblongata|연수피라미드|주로 피질척수로가 지나는 연수 앞쪽 융기입니다. 아래쪽에서는 많은 운동섬유가 반대쪽으로 교차합니다.
Superior colliculus|위둔덕|시각 및 다른 감각 정보에 따라 눈과 머리의 방향을 바꾸는 정향 반응에 관여합니다.
Superior salivatory nucleus|위침분비핵|얼굴신경의 부교감성 경로를 통해 눈물샘과 일부 침샘의 분비 조절에 관여합니다.
Vestibular nuclei|안뜰핵|머리 움직임과 평형 정보를 통합하여 자세 유지 및 눈 움직임의 안정화에 관여합니다.
Adenohypophysis|샘뇌하수체|뇌하수체 앞부분으로 시상하부의 조절 아래 성장·생식·대사 등에 관련된 호르몬을 분비합니다.
Anterior hypothalamus|앞시상하부|시상하부의 앞쪽 구역입니다. 체온과 자율신경 조절에 관여하는 여러 핵을 포함하는 근사 분할입니다.
Anterior nuclei of thalamus|시상앞핵군|유두체·띠피질 등과 연결되어 일화기억과 공간적 기억의 회로에 참여합니다.
Habenula|고삐핵|보상 예측, 혐오 및 동기 상태에 관련된 정보를 중뇌·뇌간의 조절계와 연결합니다.
Intralaminar and lateral posterior nuclei|시상판속핵·가쪽뒤핵군|각성·주의와 피질·기저핵의 통합에 관여하는 여러 핵이 묶인 아틀라스 분할입니다.
Lateral geniculate body|가쪽무릎체|망막에서 오는 시각 정보를 일차시각피질로 중계하는 시상의 구조입니다.
Lateral hypothalamus|가쪽시상하부|섭식, 각성, 동기 및 자율신경 기능과 관련된 회로가 위치하는 시상하부 구역입니다.
Mamillary body|유두체|시상하부 아래면의 구조로 해마·뇌궁과 시상앞핵을 잇는 기억 회로에 참여합니다.
Medial geniculate body|안쪽무릎체|중뇌 아래둔덕에서 오는 청각 정보를 청각피질로 중계합니다.
Mediodorsal nucleus|시상안쪽등핵|전전두피질과 상호 연결되어 인지 조절, 작업기억 및 정서 관련 처리에 관여합니다.
Neurohypophysis|신경뇌하수체|시상하부에서 만들어진 바소프레신과 옥시토신을 혈액으로 방출하는 뇌하수체 부분입니다.
Optic chiasm|시각교차|양쪽 시신경이 만나는 곳으로 코쪽 망막에서 온 섬유가 반대편으로 교차합니다.
Optic tract|시각로|시각교차 이후 주로 반대쪽 시야의 정보를 가쪽무릎체 및 다른 시각 관련 구조로 전달합니다.
Posterior commissure|뒤맞교차|중뇌 위쪽의 양쪽 구조를 잇는 섬유다발로 동공 반사 및 수직 주시 회로에 관련됩니다.
Posterior hypothalamus|뒤시상하부|각성·자율신경·체온 유지에 관련된 여러 회로가 포함되는 시상하부 뒤쪽 구역입니다.
Preoptic hypothalamus|시각앞시상하부|체온, 수면 및 생식 내분비 조절에 관여하는 시각앞 구역의 근사 분할입니다.
Pulvinar|시상베개|시상 뒤쪽의 큰 연합핵군으로 시각적 주의 및 피질 영역 간 정보 교환에 관여합니다.
Pineal gland|송과샘|멜라토닌을 분비하여 명암 주기와 생체리듬의 조절에 관여합니다.
Stria medullaris thalami|시상속질줄|중격 및 시상하부 주변에서 고삐핵으로 이어지는 변연계 관련 섬유 경로입니다.
Tuberal hypothalamus|시상하부 결절구역|내분비·에너지 균형·섭식 조절에 관여하는 핵들이 포함되는 중간 시상하부 구역입니다.
Ventral anterior nucleus|시상배쪽앞핵|기저핵의 출력을 운동 준비와 관련된 전두피질로 중계하는 운동 시상 회로에 참여합니다.
Ventral laterodorsal nucleus|시상배가쪽등쪽핵 구획|원자료의 운동 시상 분할 중 하나입니다. 소뇌·기저핵과 운동피질 사이의 정보 중계에 관련됩니다.
Ventral lateroventral nucleus|시상배가쪽배쪽핵 구획|원자료의 운동 시상 분할 중 하나입니다. 고전적 시상핵 이름과 일대일 대응으로 해석하지 않습니다.
Anterior commissure|앞맞교차|좌우 측두엽 및 후각 관련 영역 등을 연결하는 반구 간 백질다발입니다.
Corpus callosum|뇌량|좌우 대뇌피질 사이에서 정보를 교환하는 가장 큰 맞교차 섬유다발입니다.
Fornix|뇌궁|해마에서 중격·유두체 등으로 이어지는 백질 경로로 기억 회로의 일부입니다.
Hippocampal commissure|해마맞교차|양쪽 해마 형성체를 잇는 맞교차 섬유로 뇌궁과 인접합니다.
Stria terminalis|종말줄|편도체와 중격·시상하부 주변을 연결하는 경로로 정서와 자율신경 반응의 연계에 참여합니다.
White matter of telencephalon|대뇌백질|대뇌피질과 다른 피질·피질하 영역 사이를 연결하는 축삭들이 모인 조직입니다.
Basolateral complex|편도체 바닥가쪽복합체|감각 정보에 정서적 가치를 연결하며 피질·해마·선조체와 상호작용합니다. 여러 핵을 묶은 분할입니다.
Caudate nucleus|꼬리핵|선조체의 일부로 행동 선택, 목표 지향적 행동, 학습 및 운동 관련 기저핵 회로에 참여합니다.
Central nucleus|편도체 중심핵|정서적으로 중요한 자극에 대한 자율신경·호르몬·행동 반응을 조절하는 출력 회로에 관여합니다.
Corticomedial group|편도체 피질안쪽핵군|후각 및 내장·사회적 자극과 관련된 정보를 처리하는 편도체의 여러 핵을 묶은 분할입니다.
Globus pallidus external|가쪽창백핵·GPe|기저핵의 간접 경로를 비롯한 조절 회로에 참여하여 행동 선택과 운동 조절에 관여합니다.
Globus pallidus internal|안쪽창백핵·GPi|시상과 뇌간으로 억제성 출력을 보내는 기저핵의 주요 출력 구조입니다.
Lateral nucleus|편도체 가쪽핵|다양한 감각 입력을 받아 자극과 정서적 결과 사이의 학습에 관여합니다.
Nucleus accumbens|중격의지핵|배쪽 선조체의 일부로 보상 학습, 동기 및 목표를 향한 행동에 관여합니다.
Septal nuclei|중격핵|해마 및 시상하부와 연결되어 기억·동기와 해마 활동의 조절에 참여합니다.
Putamen|조가비핵|선조체의 일부로 운동 실행과 습관 학습에 관련된 피질–기저핵 회로에 참여합니다.
Substantia nigra|흑색질|치밀부의 도파민성 조절과 그물부의 출력 기능을 통해 기저핵 운동·학습 회로에 관여합니다.
Subthalamic nucleus|시상밑핵|기저핵 출력 구조에 흥분성 입력을 제공하여 행동 억제와 운동 선택을 조절합니다.
Choroid plexus|맥락얼기|뇌실 내부의 혈관성 조직으로 뇌척수액의 생성과 혈액–뇌척수액 장벽에 관여합니다.
Fourth ventricle|넷째뇌실|교뇌·연수와 소뇌 사이의 뇌척수액 공간입니다. 지주막밑공간으로 이어지는 통로가 있습니다.
Lateral ventricle|가쪽뇌실|각 대뇌반구 내부의 뇌척수액 공간으로 뇌실사이구멍을 통해 셋째뇌실과 연결됩니다.
Septum pellucidum|투명사이막|양쪽 가쪽뇌실 앞쪽 사이를 나누는 얇은 막입니다.
Third ventricle|셋째뇌실|양쪽 간뇌 사이의 정중선 뇌척수액 공간으로 중뇌수도관을 통해 넷째뇌실과 이어집니다.
Anterior quadrangular lobule|앞네모소엽|소뇌 앞엽의 반구 부분으로 주로 감각운동 조절과 관련된 소뇌 회로에 참여합니다.
Biventral lobule|두힘살소엽|소뇌 아래면 반구의 소엽으로 감각운동 및 연합피질과 연결되는 소뇌 회로의 일부입니다.
Central lobule|중심소엽|소뇌 벌레의 앞쪽 소엽으로 몸통과 자세·움직임 조절에 관련된 회로에 참여합니다.
Culmen|소뇌꼭대기|소뇌 벌레 앞엽의 위쪽 부분으로 주로 몸통·팔다리의 감각운동 조절에 관련됩니다.
Declive|소뇌비탈|소뇌 벌레 뒤엽의 위쪽 부분입니다. 안구운동과 감각운동 조절 등 인접 소뇌 연결망에 참여합니다.
Flocculus|타래|안뜰소뇌의 구성요소로 안뜰눈반사와 시선 안정화에 중요한 역할을 합니다.
Folium of vermis|소뇌벌레잎새|소뇌 벌레의 얇은 뒤쪽 소엽입니다. 벌레 및 인접 반구와 함께 소뇌 정보 처리 회로에 참여합니다.
Gracile lobule|가느다란소엽|소뇌 반구 뒤아래쪽 소엽입니다. 소뇌 연결망은 운동과 인지 기능에 모두 참여하며 이 형태만으로 단일 기능을 지정하지 않습니다.
Inferior semilunar lobule|아래반달소엽|소뇌 반구의 뒤쪽 연합 영역 일부로 운동 외에 인지 관련 피질과의 소뇌 회로에도 참여합니다.
Lingula of cerebellum|소뇌혀|소뇌 벌레의 가장 앞쪽 작은 소엽으로 자세·감각운동 조절에 관련된 소뇌 앞엽에 속합니다.
Nodule of vermis|소뇌벌레결절|타래와 함께 안뜰소뇌를 이루며 평형과 눈 움직임의 조절에 관여합니다.
Peduncle of flocculus|타래다리|타래와 인접 소뇌 조직을 잇는 부위로 안뜰소뇌 연결의 해부학적 표지입니다.
Posterior quadrangular lobule|뒤네모소엽|소뇌 반구의 뒤쪽 네모소엽으로 감각운동 및 눈 운동과 관련된 소뇌 회로에 참여합니다.
Pyramis of vermis|소뇌벌레피라미드|소뇌 벌레 아래쪽 부분으로 자세·움직임 조절에 관련된 회로의 일부입니다.
Base of peduncle|대뇌다리바닥|중뇌에서 대뇌다리의 배쪽 부분으로 하행 피질 운동 경로와 관련됩니다. 상위 모델의 소뇌 분류를 뇌간으로 바로잡았습니다.
Superior semilunar lobule|위반달소엽|소뇌 반구의 가쪽 뒤쪽 영역으로 전두·두정 연합피질과 연결되는 인지 관련 소뇌 회로에 참여합니다.
Tonsil of cerebellum|소뇌편도|소뇌 반구 아래안쪽에 위치하는 소엽입니다. 주변 소뇌 회로와 함께 감각운동 정보 처리에 참여합니다.
Tuber of vermis|소뇌벌레덩이|벌레 뒤아래쪽의 소엽으로 인접 반구와 소뇌 기능 회로를 구성합니다.
Uvula of vermis|소뇌벌레목젖|소뇌 벌레 아래쪽 소엽으로 안뜰 및 자세 조절에 관련된 연결망에 참여합니다.
Wing of central lobule|중심소엽날개|중심소엽의 양옆 반구 연장부로 소뇌 앞쪽 감각운동 회로의 일부입니다.
Acoustic radiation|청각방사|시상의 안쪽무릎체와 청각피질을 연결하여 청각 정보를 전달합니다.
Anterior thalamic radiation|앞시상방사|시상과 전두피질 사이를 연결하며 인지·정서 및 행동 조절 회로에 참여합니다.
Arcuate fasciculus|활꼴다발|전두·두정·측두 영역을 연결하는 등쪽 연합 경로로 언어 및 청각–운동 통합과 관련됩니다.
Corticobulbar tract|피질숨뇌로|운동피질에서 뇌간 운동핵 회로로 향하는 경로로 얼굴·혀·인두 등의 수의운동에 관여합니다.
Corticopontine tract (frontal)|이마피질교뇌로|전두피질의 정보를 교뇌핵으로 전달하며 소뇌를 통한 움직임·행동 조절 회로에 참여합니다.
Corticopontine tract (occipital)|뒤통수피질교뇌로|뒤통수피질에서 교뇌로 이어져 시각 관련 정보를 소뇌 회로에 전달하는 데 관여합니다.
Corticopontine tract (parietal)|마루피질교뇌로|두정피질의 감각·공간 정보를 교뇌를 거쳐 소뇌에 전달하는 경로입니다.
Corticospinal tract|피질척수로|운동 관련 피질과 척수를 잇는 하행 경로로 팔다리의 수의운동, 특히 정교한 움직임에 중요합니다.
Corticostriatal tract (anterior)|앞피질선조체로|앞쪽 피질과 선조체를 연결하며 목표·동기 및 행동 선택에 관련된 기저핵 회로에 참여합니다.
Corticostriatal tract (posterior)|뒤피질선조체로|뒤쪽 대뇌피질과 선조체를 연결하여 감각 정보와 행동 선택을 연계합니다.
Corticostriatal tract (superior)|위피질선조체로|위쪽 운동·감각 관련 피질과 선조체를 연결하는 기저핵 회로의 일부입니다.
Dentatorubrothalamic tract|치아적색시상로|소뇌 깊은 핵에서 위소뇌다리를 거쳐 적색핵·시상 쪽으로 이어지는 운동 조절 출력 경로입니다.
Frontal aslant tract|이마빗다발|안쪽 위전두 영역과 아래전두 영역을 연결하며 말하기의 시작과 동작 개시·조절에 관련됩니다.
Inferior cerebellar peduncle|아래소뇌다리|척수·연수·안뜰계 등과 소뇌 사이를 연결하며 고유감각과 평형 관련 정보를 전달합니다.
Inferior fronto-occipital fasciculus|아래이마뒤통수다발|전두엽과 뒤쪽 시각·측두두정 영역을 연결하는 긴 연합 경로로 의미 및 시각 정보 통합에 관여합니다.
Inferior longitudinal fasciculus|아래세로다발|후두엽과 측두엽을 연결하는 배쪽 연합 경로로 시각적 인식과 기억의 연계에 관여합니다.
Medial lemniscus|안쪽섬유띠|뇌간에서 정교한 촉각·진동·고유감각 정보를 시상으로 전달하는 상행 경로입니다.
Middle cerebellar peduncle|중간소뇌다리|주로 교뇌핵에서 반대쪽 소뇌로 들어가는 섬유를 포함하여 피질 정보를 소뇌로 중계합니다.
Middle longitudinal fasciculus|중간세로다발|위측두 영역과 두정·뒤통수 영역을 연결하는 연합 경로로 청각·언어·주의 정보의 통합과 관련됩니다.
Optic radiation|시각방사|가쪽무릎체와 일차시각피질을 연결하여 시야 정보를 전달합니다. 측두엽·두정엽을 지나는 섬유가 포함됩니다.
Posterior thalamic radiation|뒤시상방사|시상과 뒤쪽 두정·뒤통수피질을 연결하는 방사섬유로 감각 및 연합 정보 전달에 관여합니다.
Reticulospinal tract|그물척수로|뇌간 그물체에서 척수로 내려가 자세·근긴장과 전신 움직임의 조절에 관여합니다.
Superior cerebellar peduncle|위소뇌다리|소뇌의 주요 출력 통로로 깊은 소뇌핵과 중뇌·시상을 연결합니다. 일부 입력 섬유도 포함합니다.
Superior longitudinal fasciculus I|위세로다발 I|등쪽 전두·두정 영역을 연결하며 공간 처리와 자세·행동 계획의 통합에 관여합니다.
Superior longitudinal fasciculus II|위세로다발 II|가쪽 전두피질과 뒤두정 영역을 연결하여 시공간 주의 및 작업기억에 관여합니다.
Superior longitudinal fasciculus III|위세로다발 III|아래전두 영역과 아래두정 영역을 연결하며 감각운동 및 음운 처리 회로에 참여합니다.
Superior thalamic radiation|위시상방사|시상과 위쪽 감각·운동 피질을 연결하며 체성감각 및 운동 정보 전달에 관여합니다.
Uncinate fasciculus|갈고리다발|앞측두엽과 눈확전두피질을 연결하여 정서·의미·기억 정보를 가치 평가와 연계합니다.
`;

export const KNOWLEDGE = Object.fromEntries(rows.trim().split('\n').map(line => {
  const [name, ko, summary] = line.split('|');
  if (!EN_SUMMARIES[name]) throw new Error(`Missing English summary: ${name}`);
  return [name, { ko: KO_TERMS[name] || ko, en: EN_TERMS[name] || name, summary, summaryEn: EN_SUMMARIES[name], aliases: ALIASES[name] || '' }];
}));

const extraTracts = {
  C_FP: ['띠다발 이마–마루구간', 'Cingulum, frontal-parietal segment', '안쪽 이마·마루 영역을 잇는 띠다발의 아틀라스 구간입니다. 인지 조절과 기억·주의 연결망의 일부입니다.', 'An atlas segment of the cingulum linking medial frontal and parietal regions within cognitive-control, memory and attention networks.'],
  C_FPH: ['띠다발 이마–해마곁구간', 'Cingulum, frontal-parahippocampal segment', '안쪽 이마 영역과 해마곁 영역을 잇는 띠다발 구간으로 기억·맥락 정보와 행동 조절을 연결하는 회로에 참여합니다.', 'An atlas segment linking medial frontal and parahippocampal regions within circuits relating contextual memory to behavioural control.'],
  C_PHP: ['띠다발 해마곁–마루구간', 'Cingulum, parahippocampal-parietal segment', '해마곁 영역과 안쪽 마루 영역을 잇는 아틀라스 구간으로 기억 및 공간적 맥락 처리 회로와 관련됩니다.', 'An atlas segment linking parahippocampal and medial parietal regions, associated with memory and spatial-context processing.'],
  C_PH: ['띠다발 해마곁구간', 'Cingulum, parahippocampal segment', '안쪽 측두엽의 해마곁 영역을 지나는 띠다발 구간으로 기억과 맥락 정보의 교환에 관여합니다.', 'The parahippocampal segment of the cingulum traverses medial temporal regions and participates in memory and contextual-information exchange.'],
  VOF: ['수직뒤통수다발', 'Vertical occipital fasciculus', '후두엽의 등쪽과 배쪽 시각 영역을 연결하는 연합 경로로 시각 정보의 통합과 관련됩니다.', 'An association pathway linking dorsal and ventral occipital visual regions, involved in integrating visual information.'],
  PTAT: ['PTAT 신경로 코드', 'PTAT (source tract code)', '원본 표와 약어집의 표기가 달라 긴 이름과 특정 기능을 확정하지 않았습니다. 연결 확률은 원본 값 그대로 제공합니다.', 'The source table and abbreviation list disagree, so an expanded name and specific function are not assigned. The original overlap probabilities are preserved.'],
  C_R: ['C_R 신경로 코드', 'C_R (source tract code)', '원본의 C_R과 약어집의 C_PR 차이를 보존했습니다. 특정 띠다발 구간으로 단정하지 않고 원본 연결 확률을 표시합니다.', 'The discrepancy between source C_R and abbreviation-list C_PR is retained. A specific cingulum segment is not assumed; original probabilities are displayed.'],
};
export function tractKnowledge(tract) {
  const mapped = KNOWLEDGE[tract.modelMapping?.modelLabel];
  if (mapped) return mapped;
  const row = extraTracts[tract.code];
  return row ? { ko: row[0], en: row[1], summary: row[2], summaryEn: row[3] } : null;
}

export function normalized(text) {
  return text.toLocaleLowerCase().normalize('NFKC').replace(/[\s·()–—-]+/g, '');
}

export function searchParts(parts, query) {
  const terms = query.trim().split(/\s+/).map(normalized).filter(Boolean);
  return parts.filter(part => terms.every(term => normalized([
    part.label, part.en, part.ko, part.aliases, part.summary, part.summaryEn, part.parent ?? '', part.region,
    CATEGORIES[part.category].name, part.side === 'left' ? '왼쪽 좌측 left' : part.side === 'right' ? '오른쪽 우측 right' : '정중선 median',
  ].join(' ')).includes(term)));
}
