# Brain Atlas — attribution, licences and methods

## Anatomy assets and derived metadata

`models/brain.glb`, `models/manifest.json`, `models/parts.json` and the anatomy annotations in `src/knowledge.js` and `src/knowledge-en.js` are distributed under **Creative Commons Attribution-ShareAlike 4.0 International**:
https://creativecommons.org/licenses/by-sa/4.0/

Source: **Itay Inbar, Brain Project (2026)**, revision `2929e94f521a8ddceab26bc100a98dc06b0da060`.
https://github.com/itayinbarr/brainproject

The original model and manifest are unchanged. Brain Atlas selects 325 original logical structures and adds two separately sourced insular meshes, for 327 selection units. It changes colours, adds Korean and English display names and educational summaries, and provides a different viewer. Derived metadata corrects the category of Base of peduncle from cerebellum to brainstem and identifies original nodes 145/146 as subcentral gyrus and sulci rather than insula. Original identifiers, labels and categories remain traceable. The original model contains additional structures not displayed by this viewer; its vertex coordinates have not been modified. See `TERMINOLOGY.md` and `ANATOMY_REVIEW.md`.

### Supplemental insula geometry

`models/insula.bin` and `models/insula.json` derive from **BodyParts3D, © The Database Center for Life Science**, via **ashemag/human-atlas** revision `1c38bf35c254a891200d3cedecfd57abebe83d8d`: FJ1748 / FMA72978 (left) and FJ1749 / FMA72977 (right). Geometry and derivative metadata retain **CC BY-SA 4.0** attribution and share-alike conditions. DBCLS's current release also permits CC BY 4.0: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html . The upstream Human Atlas code licence does not replace the anatomical asset licence.

Original insular surface vertices and triangles are retained, with a translation estimated from six shared bilateral deep-structure bounding-box centres. Five held-out shared controls have centre residuals of 0.487–0.873 mm. This checks alignment of these common model structures, not biological accuracy or subject-specific registration. No scaling, invented insular surface or functional parcellation was applied. Source hashes, IDs, offsets, translation and controls are recorded in `models/insula.json`; `scripts/prepare-insula.py` reproduces the extraction. Original subcentral meshes remain selectable under their corrected names.

Underlying sources retained from Brain Project:

- **Z-Anatomy**, https://www.z-anatomy.com/ and https://github.com/Z-Anatomy
- **BodyParts3D**, © The Database Center for Life Science (DBCLS), https://lifesciencedb.jp/bp3d/ ; https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- **CIT168 subcortical atlas**, Pauli, Nili & Tyszka (2018), CC BY 4.0, https://osf.io/jkzwp/
- **CIT168 amygdala atlas**, Tyszka & Pauli (2016), CC BY-SA 4.0, https://osf.io/hksa6/
- **Thalamic nuclei atlas**, Najdenovska et al. (2018), CC BY-SA 4.0, https://doi.org/10.5281/zenodo.1405484
- **Hypothalamic region atlas**, Neudorfer et al. (2020), CC BY 4.0, https://doi.org/10.5281/zenodo.3942115
- **HCP1065 tractography atlas**, Fang-Cheng Yeh (2022), CC BY-SA 4.0, https://brain.labsolver.org/hcp_trk_atlas.html

The registered additions are educational approximations. Brain Project reports approximately 7 mm held-out registration error; tract tubes are simplified representative geometry. They are not subject-specific fibres or clinically accurate coordinates. Registration methods: https://github.com/itayinbarr/brainproject/blob/2929e94f521a8ddceab26bc100a98dc06b0da060/docs/registration.md

The full upstream licence notice, including its separate code/asset licences, is preserved in `licenses/brainproject.txt`.

## Detailed streamline assets

`tractography/*.bin.gz` and `tractography/manifest.json` are derivatives of the **HCP1065 population-averaged tractography atlas**, Fang-Cheng Yeh (2022), under **CC BY-SA 4.0**. The HCP acknowledgement below applies. The viewer selects 68 named bundles and subsets original trajectories, simplifies them within 0.25 mm in native space, adds orientation colouring and uses a separate renderer without anatomical registration. Full source hashes, processing details, scope and validation are in [TRACTOGRAPHY.md](TRACTOGRAPHY.md).

## Structural tract-to-region connectome data

**Fang-Cheng Yeh (2022).** Population-based tract-to-region connectome of the human brain and its hierarchical topology. *Nature Communications* 13, 4933. https://doi.org/10.1038/s41467-022-32595-4

Dataset and licence statement: https://brain.labsolver.org/hcp_trk_atlas.html

Licence: **CC BY-SA 4.0**, https://creativecommons.org/licenses/by-sa/4.0/

Original workbook: https://github.com/data-others/atlas/releases/download/hcp1065/tract_to_region_connectome_MMP.xlsx

Brain Atlas extracted the 180 × 52 matrix without changing, thresholding or rounding any numeric value. The original XLSX is included. The JSON adds provenance, explicit indices, semantic model mappings and limitations. Display percentages are rounded to one decimal place. This derived dataset retains CC BY-SA 4.0.

The graph is bipartite (tract ↔ cortical region). It is not a region-to-region matrix. Probabilities indicate tract-mask overlap with a cortical region across subjects, not axon counts, direction, causal influence or functional correlation. Some tracts have different denominators. MMP region IDs are not painted onto gyral meshes. Name-and-side mappings do not establish geometric endpoint registration.

### Human Connectome Project acknowledgement

Data were provided in part by the Human Connectome Project, WU-Minn Consortium (Principal Investigators: David Van Essen and Kamil Ugurbil; 1U54MH091657) funded by the 16 NIH Institutes and Centers that support the NIH Blueprint for Neuroscience Research; and by the McDonnell Center for Systems Neuroscience at Washington University.

HCP data-use terms and acknowledgement requirements apply to HCP-derived data:
https://www.humanconnectome.org/study/hcp-young-adult/document/wu-minn-hcp-consortium-open-access-data-use-terms

This application packages published aggregate derivative atlases and a population table. It does not package individual scans, participant identifiers, demographic information or restricted HCP records. Access to original participant data has its own registration and terms process. No affiliation or endorsement by HCP, DBCLS or the atlas authors is claimed.

## Viewer code and libraries

- The pointer-tap gesture handling is adapted from **ashemag/human-atlas**, MIT licence; original copyright and permission text: `licenses/human-atlas.txt`. Changes: JavaScript adaptation and explicit multi-pointer cancellation.
- **Three.js 0.159.0**, MIT licence, https://github.com/mrdoob/three.js ; notice: `licenses/three.txt`.
- **Draco**, Google Draco Authors, Apache 2.0, https://github.com/google/draco ; notice: `licenses/draco.txt`. Decoder files are distributed with Three.js.
- **Vite** is a development/build dependency; its licence is distributed with the npm package.
- Original viewer code is owned by honggi82. See the repository `LICENSE` for its current status. Public hosting does not change third-party attribution or share-alike obligations for assets and metadata.

## Educational background

Korean annotations summarise anatomical location and commonly taught roles; they are not quotations and have not undergone independent medical review. Sulci are described as landmarks rather than being assigned a dedicated mental function.

- OpenStax, *Anatomy and Physiology 2e*, The Central Nervous System: https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system
- OpenStax, *Anatomy and Physiology 2e*, Motor Responses: https://openstax.org/books/anatomy-and-physiology-2e/pages/14-3-motor-responses
- The structure labels and model provenance above.

Lobe labels, aliases, locations and short functional summaries are independently written in Korean and English. Following correction of two subcentral labels and addition of two actual insular meshes, 130 cortical structures comprise frontal 42, parietal 14, temporal 22, occipital 18, insula 2, limbic 12, and boundary/other sulci 20 (both hemispheres). The last group is not a seventh lobe. The limbic grouping is incomplete and source-specific; it is not the entire limbic system.

Functional exploration highlights existing anatomical reference structures for SMA, premotor cortex, Broca's area and Wernicke's area, and whole hippocampal anatomy for the hippocampus. Highlighted gyri are not asserted to be exact functional boundaries. The bilingual descriptions explicitly distinguish reference geometry, hemispheric examples and distributed function. These summaries have not undergone independent expert review.

- Naidich et al. (2004), *The Insula: Anatomic Study and MR Imaging Display at 1.5 T*: https://pmc.ncbi.nlm.nih.gov/articles/PMC7974606/
- Purves et al., *Neuroscience*, motor cortex: https://www.ncbi.nlm.nih.gov/books/NBK10962/ ; aphasias: https://www.ncbi.nlm.nih.gov/books/NBK10972/ ; limbic system: https://www.ncbi.nlm.nih.gov/books/NBK11060/
- FIPAT TA2, Part 5, includes *Lobus limbicus / Limbic lobe*: https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-5.pdf

- NINDS, *Brain Basics: Know Your Brain*: https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-know-your-brain (also available as the institute's linked PDF).
- Avery et al. (2015), *A common gustatory and interoceptive representation in the human mid-insula*, Human Brain Mapping 36:2996–3006, doi:10.1002/hbm.22823: https://pmc.ncbi.nlm.nih.gov/articles/PMC4795826/
- OpenStax CNS chapter above provides additional boundary and limbic anatomy background.
