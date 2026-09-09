# Brain Atlas — attribution, licences and methods

## Anatomy assets and derived metadata

`models/brain.glb`, `models/manifest.json`, `models/parts.json` and the anatomy annotations in `src/knowledge.js` and `src/knowledge-en.js` are distributed under **Creative Commons Attribution-ShareAlike 4.0 International**:
https://creativecommons.org/licenses/by-sa/4.0/

Source: **Itay Inbar, Brain Project (2026)**, revision `2929e94f521a8ddceab26bc100a98dc06b0da060`.
https://github.com/itayinbarr/brainproject

The original model and manifest are unchanged. Brain Atlas selects 325 logical structures for display, changes colours, adds Korean and English display names and educational summaries, and provides a different viewer. Derived metadata corrects the category of Base of peduncle from cerebellum to brainstem and preserves its original category. The model contains additional structures not displayed by this viewer. Model vertex coordinates have not been modified. See `TERMINOLOGY.md` for naming conventions.

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
