# Terminology / 용어 표기 기준

## 언어 선택

`Kr`는 한국어 해부학 명칭 뒤에 영어 해부학 명칭을 괄호로 병기합니다. `En`은 영어 해부학 명칭과 영어 설명을 사용합니다. 선택한 구조·연결표와 검색어는 언어를 바꿔도 유지되며, 브라우저가 저장소를 허용하면 언어 선택을 기억합니다.

예: `해마 (Hippocampus)`, `중심앞이랑 (Precentral gyrus)`, `널판소엽 (Gracile lobule)`.

## 명칭과 원본 식별자의 구분

화면 명칭은 단어별 기계 번역 대신 해부학에서 사용하는 명칭을 수록했습니다. 널판소엽을 “가느다란 소엽”, 볼록소엽을 “두 힘살 소엽”처럼 직역하지 않습니다. 한국어의 우리말 명칭과 임상에서 쓰는 한자어 명칭이 함께 존재하는 경우 검색 동의어를 제공합니다. 예를 들어 `중심전회`로 검색해도 중심앞이랑을 찾습니다. 모든 역사적 동의어를 수록한 것은 아닙니다.

원자료 `label`과 `id`는 바꾸지 않고, 표시 명칭을 별도 `ko`·`en` 필드에 둡니다. `Mamillary body`는 화면에서 `Mammillary body`로 표기합니다. `Lat Fis-ant-Horizont` 같은 모델 약어는 `Anterior horizontal ramus of lateral sulcus`로 풀어 씁니다. 편도체의 `Central nucleus`처럼 맥락이 필요한 명칭에는 `amygdalar`를 명시합니다.

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
