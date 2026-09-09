# Terminology / 용어 표기 기준

## 언어 선택

`Kr`는 한국어 해부학 명칭 뒤에 영어 해부학 명칭을 괄호로 병기합니다. `En`은 영어 해부학 명칭과 영어 설명을 사용합니다. 선택한 구조·연결표와 검색어는 언어를 바꿔도 유지되며, 브라우저가 저장소를 허용하면 언어 선택을 기억합니다.

예: `해마 (Hippocampus)`, `중심앞이랑 (Precentral gyrus)`, `널판소엽 (Gracile lobule)`.

뇌엽의 한국어 표시 명칭은 사용자의 요청에 따라 `전두엽 (Frontal lobe)`, `두정엽 (Parietal lobe)`, `후두엽 (Occipital lobe)`, `측두엽 (Temporal lobe)`으로 통일합니다. 범례, 구조 목록, 소속 뇌엽과 설명에 같은 표기를 사용하며, 기존의 이마엽·마루엽·뒤통수엽·관자엽은 검색 동의어로만 유지합니다. 하위 이랑·고랑의 개별 명칭과 원본 식별자는 유지합니다.

## 명칭과 원본 식별자의 구분

화면 명칭은 단어별 기계 번역 대신 해부학에서 사용하는 명칭을 수록했습니다. 널판소엽을 “가느다란 소엽”, 볼록소엽을 “두 힘살 소엽”처럼 직역하지 않습니다. 한국어의 우리말 명칭과 임상에서 쓰는 한자어 명칭이 함께 존재하는 경우 검색 동의어를 제공합니다. 예를 들어 `중심전회`로 검색해도 중심앞이랑을 찾습니다. 모든 역사적 동의어를 수록한 것은 아닙니다.

원본 GLB와 manifest의 `label`·`id`는 바꾸지 않습니다. 파생 메타데이터는 원래 이름을 `sourceLabel`에 보존하고 교정 이름을 `label` 및 표시용 `ko`·`en`에 둡니다. `Mamillary body`는 화면에서 `Mammillary body`로 표기합니다. `Lat Fis-ant-Horizont` 같은 모델 약어는 `Anterior horizontal ramus of lateral sulcus`로 풀어 씁니다. 편도체의 `Central nucleus`처럼 맥락이 필요한 명칭에는 `amygdalar`를 명시합니다.

`Insula`의 한국어 표시는 요청한 `뇌섬엽 (Insula)`으로 통일하고 섬엽·섬피질은 검색 동의어로 제공합니다. 기존 `Insula (Subcentral gyrus and ant. and post. sulci)` 노드 145/146은 바깥쪽 중심밑이랑·고랑 형상이어서 `중심밑이랑·고랑 (Subcentral gyrus and sulci)`으로 교정했습니다. 뇌섬엽은 BodyParts3D의 별도 좌우 형상을 보충해 표시합니다.

`변연엽 (Limbic lobe)`과 `변연계 (Limbic system)`는 모두 쓰는 용어입니다. 변연엽은 안쪽면의 띠이랑·해마곁이랑 등 피질의 해부학적 묶음이며, 변연계는 해마·편도체·시상하부 등을 포함하는 더 넓은 구조와 연결의 개념입니다. 현재 색상 범례는 원본 피질 분류이므로 변연엽으로 표시하며 변연계 전체라는 뜻으로 쓰지 않습니다.

기능 탐색에는 일차운동피질 (Primary motor cortex), 일차체성감각피질 (Primary somatosensory cortex), 일차시각피질 (Primary visual cortex), 일차청각피질 (Primary auditory cortex) 등을 포함한 22개 항목이 있습니다. 한국어에서는 영어를 괄호 안에 병기하고 영어에서는 해당 영어 명칭을 사용합니다. SMA의 보조운동영역, 전운동피질의 운동앞피질 등 동의어는 검색 별칭으로 유지합니다. 베르니케는 단일 경계로 확정하지 않고 `베르니케 관련 뒤쪽 언어영역 (Wernicke-related posterior language regions)`으로 표기합니다. 화면의 HCP 구획 ID는 번역하지 않으며 기능 명칭과 구획의 포함 관계를 설명합니다.

`Base of peduncle`은 대뇌다리바닥입니다. 원본의 `cerebellum` 분류를 `brainstem`으로 수정했고 원본 분류는 `sourceCategory`에 보존했습니다. FIPAT TA2에서 해당 항목은 중뇌의 cerebral peduncle 아래에 속합니다.

아틀라스가 여러 이랑·고랑 또는 핵을 묶은 형상에는 구성 명칭과 구획 설명을 유지합니다. 그러한 복합 표기는 독립된 표준 해부학 단위 또는 단일 기능 영역이라는 뜻이 아닙니다. 확정하지 못한 연결표 약어 `PTAT`와 `C_R`은 긴 이름을 만들어 붙이지 않습니다.

## References / 대조 자료

- FIPAT / IFAA anatomical terminology: https://ifaa.net/committees/anatomical-terminology-fipat/fipat-ifaa-terminologies/
- FIPAT TA2, nervous system: https://fipat.library.dal.ca/wp-content/uploads/2021/08/FIPAT-TA2-Part-5.pdf
- FIPAT TA98, chapter 14 (cerebral peduncle and base of peduncle): https://ifaa.unifr.ch/Public/EntryPage/PDF/TA98%20Chapter%2014.pdf
- 대한해부학회: https://www.anatomy.re.kr/
- 서울아산병원, 해마(Hippocampus): https://www.amc.seoul.kr/asan/healthinfo/body/bodyDetail.do?bodyId=147
- 서울대학교병원, 중심앞이랑(precentral gyrus) 표기: https://webzine.snuh.org/PostView.jsp?b_idx=1148&wzCateCode=w
- Brain Project source labels and compound partitions: https://github.com/itayinbarr/brainproject
- HCP tract names, abbreviations and source discrepancies: https://brain.labsolver.org/hcp_trk_atlas.html

These references guide naming and selected corrections; the app is not an official translation of the complete FIPAT or Korean Association of Anatomists terminology. Composite atlas labels and HCP-specific tract subdivisions are identified as such. Neither language's educational summaries have undergone independent medical review.
