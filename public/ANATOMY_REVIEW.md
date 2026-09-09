# 해부학 표시 점검 — 2026-09-09

## 확인하여 수정한 사항

- 뇌섬엽의 한국어 이름을 `뇌섬엽 (Insula)`으로 통일했습니다. 뇌섬엽은 가쪽고랑 깊숙이 있고 전두·두정·측두 덮개에 가려집니다. 단순히 두정엽의 뒤쪽 끝에 놓이는 구조가 아닙니다.
- 원본 노드 145/146의 이름 `Insula (Subcentral gyrus and ant. and post. sulci)`와 실제 형상을 대조했습니다. 바깥쪽 중심밑이랑·고랑 형상을 뇌섬엽으로 색칠하던 표시를 수정하고, 해당 원본 형상은 중심밑이랑·고랑으로 보존했습니다.
- 좌우 뇌섬엽은 BodyParts3D의 FJ1748/FMA72978 및 FJ1749/FMA72977 형상을 보충했습니다. 기존 모형과 공유하는 깊은 구조 6개의 중심으로 평행이동을 구했고, 계산에 사용하지 않은 공통 구조 5개에서 최대 0.873 mm의 중심 잔차를 확인했습니다. 이는 공통 모형의 정합 점검 수치이며 실제 뇌에서의 해부학적 정확도 수치가 아닙니다.
- 변연엽은 피질의 해부학적 분류이고 변연계 전체와 같지 않음을 설명했습니다. 전두엽·두정엽·후두엽·측두엽의 요청한 표기를 유지합니다.

## 점검 범위

원본의 서로 다른 영문 이름 174개와 한국어 표시를 검토하고, 원본 피질 구조 128개의 좌우 표기와 좌표 부호를 대조했습니다. 이 피질 구조들에서 좌우 반전은 발견되지 않았습니다. 추가 뇌섬엽의 좌우·정점·삼각형·파일 해시는 자동 검증합니다. 원본 GLB와 manifest는 변경하지 않았습니다.

이름이 같은 표면 구획도 소스 버전에 따라 범위가 다를 수 있어 중심 위치의 차이만으로 오류로 단정하지 않았습니다. 원본의 복합 구획과 확정하지 못한 PTAT·C_R 약어도 임의로 재명명하지 않았습니다. 기존 대뇌다리바닥의 뇌간 분류 교정은 유지했습니다.

## 기능 영역 표시 범위

SMA는 위이마이랑, 전운동피질은 중심앞고랑과 중간이마이랑, 브로카 영역은 아래이마이랑 덮개부분·삼각부분, 베르니케 영역은 위·중간관자이랑을 참조 구조로 강조합니다. 강조한 이랑 전체가 해당 기능 영역이라는 뜻이 아닙니다. 해마는 기존의 전체 해부 형상을 표시하며 해마 세부장이나 기능 활성도를 구획하지 않습니다. 브로카·베르니케의 우측 표시는 반대쪽 대응 구조이며 개인의 언어 우세를 판정하지 않습니다.

## 남아 있는 한계와 근거

독립된 해부학 전문가가 모든 형상과 설명을 검수한 결과는 아닙니다. 원래 Brain Project의 추가 핵·관 형상에는 약 7 mm의 정합 오차가 보고되어 있으며, 이번 뇌섬엽 교정이 전체 모형의 정확도를 보증하지 않습니다. HCP 궤적은 별도 영상 좌표에서 탐색하고 피질 기능 구획을 기존 이랑에 임의로 칠하지 않습니다.

- Naidich et al., *The Insula: Anatomic Study and MR Imaging Display at 1.5 T*: https://pmc.ncbi.nlm.nih.gov/articles/PMC7974606/
- Destrieux et al., *Automatic parcellation of human cortical gyri and sulci*: https://pmc.ncbi.nlm.nih.gov/articles/PMC2937159/
- BodyParts3D 자료와 이용 조건: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html
- FIPAT TA2, 신경계 용어: https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-5.pdf
- Purves et al., 변연계: https://www.ncbi.nlm.nih.gov/books/NBK11060/

파일별 출처, 변경 방법과 재배포 조건은 [ATTRIBUTION.md](ATTRIBUTION.md), 정합 수치는 [models/insula.json](models/insula.json)에 기록되어 있습니다.
