# Functional cortical exploration

The 21 cortical topics use native HCP-MMP1.0 parcels on matching HCP S1200 pial MSMAll fs_LR32k surfaces. The separate hippocampus topic retains whole Z-Anatomy hippocampal geometry. These are group anatomical references, not an individual's functional scan or clinical localization.

## Data and coordinates

- Glasser et al. (2016), *A multi-modal parcellation of human cerebral cortex*: https://www.nature.com/articles/nature18933 and its Supplementary Neuroanatomical Results.
- HCP S1200 group-average release: https://www.humanconnectome.org/study/hcp-young-adult/article/s1200-group-average-data-release
- Files distributed by ColeLab/ColeAnticevicNetPartition, revision `e4ea9fd709ead8616843924b717c6abce62ea05c`: https://github.com/ColeLab/ColeAnticevicNetPartition/tree/e4ea9fd709ead8616843924b717c6abce62ea05c
- Ji et al. (2019), *Mapping the human brain's cortical-subcortical functional network organization*: https://doi.org/10.1016/j.neuroimage.2018.10.006

Each hemisphere retains all 32,492 source vertices and 64,980 faces. CIFTI BrainModelAxis vertex indices restore cortical labels, leaving the medial wall unlabelled. The label key's GLASSERLABELNAME field identifies original Glasser parcels; CAB-NP network colors, network names and subcortical assignments are not used. The manifest records source-file and output SHA-256 hashes.

Exported coordinates remain the original RAS millimetres. The viewer applies only a rigid -90-degree X rotation (R=+X, S=+Y, A=-Z), uniform scale and centering. It does not register this surface onto Z-Anatomy or the tractography template. Selecting a cortical function switches to its matching HCP surface; structural selections restore the anatomical model.

Mixed-label triangles are partitioned at edge midpoints and the face centroid. Each vertex's corner retains its original parcel label. Boundaries therefore have the source mesh's finite spatial resolution, with no whole-gyrus substitution or smoothing across parcel IDs. Gray context can be made transparent to see areas buried in sulci. Orange marks selected parcels, not activation magnitude. New topics start at a representative hemisphere; Left/Right/Both controls override this view.

## Interpretation

M1 uses area 4; S1 uses 3a/3b/1/2; V1 and A1 use their named parcels. Other topics explicitly list their included parcels. SMA uses 6ma/6mp as representative components, not a definitive SMA/pre-SMA division. Broca uses 44/45; posterior language uses PSL/STV as illustrative Wernicke-related regions, not a universal Wernicke boundary. Right-sided language parcels are anatomical homologues, not a finding about language dominance. S2, DLPFC, ACC, insula and attention groupings are selected components of wider systems. HCP parcel names and functional systems are not synonymous.

Bilingual explanations are independently written educational summaries. Additional background: Purves et al., *Neuroscience*, https://www.ncbi.nlm.nih.gov/books/NBK10799/ ; OpenStax *Anatomy and Physiology 2e*, https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system . Independent expert review has not been performed.

## Reuse and reproducibility

This free educational distribution retains the source's noncommercial [license](LICENSE.txt). The [converter source](build-functional.py), [manifest with exact source URLs](manifest.json), and [converted data](cortex.bin) are included. Source data and the converter can be used to reproduce the binary with NumPy and NiBabel; place the five pinned input files in `reference/hcp-functional` and run the converter from the project. Application code does not change the source data's license.

Data were provided by the Human Connectome Project, WU-Minn Consortium (Principal Investigators: David Van Essen and Kamil Ugurbil; 1U54MH091657), funded by the 16 NIH Institutes and Centers that support the NIH Blueprint for Neuroscience Research; and by the McDonnell Center for Systems Neuroscience at Washington University.
