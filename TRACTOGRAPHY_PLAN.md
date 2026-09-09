# Streamline upgrade

The owner requested finer white-matter pathways like DTI tractography. The working version at `../brain-atlas` (commit `4bb19a9`) remains runnable as the baseline.

## Settled changes

- Add source-derived, population-average HCP1065 streamlines with local orientation RGB colouring, tract selection, context fibres and a density control.
- Preserve the existing anatomical model and Korean/English names and descriptions. Offer a switch between the anatomical illustration and streamline views in Connectome.
- Keep streamlines in native ICBM 2009a RAS millimetres. The anatomical illustration has a different coordinate system and its upstream affine is not distributed; do not invent an alignment or attach fibres to anatomical gyri.
- Keep the tract-to-region probability matrix unchanged. A streamline is a reconstructed trajectory, not one axon; colour denotes orientation, not signal direction or probability.
- Use deterministic subsampling of whole original streamlines for web delivery. Do not generate decorative fibres, fake branches or interpolate between tracts. Record every source file, selected source index, transform and checksum.
- Inspect the actual archive names before mapping tracts. Preserve unresolved abbreviations as unavailable rather than guessing.

## Evidence and verification

The previous `src/scene.js` renders 54 HCP-derived tube meshes. The pinned upstream `docs/registration.md`, section 5c, describes longest-path skeletonisation that discards fans. The HCP source page separately distributes a 587,869,457-byte TRK archive under CC BY-SA 4.0: https://brain.labsolver.org/hcp_trk_atlas.html .

Verify native coordinate conventions, source and processed counts, per-file hashes, deterministic fibre selection, hemisphere and matrix links. Compare the same arcuate, corticospinal and optic-radiation selections in both versions in the actual browser. Exercise density, orientation colours, language switching, loading/error behaviour and the existing anatomy flows. Public website deployment remains pending the owner's review.

## Implementation notes

- Additional owner request: unify the left anatomy library and right LAYERS controls. The left tree now owns both category and individual visibility, with expandable children and name-click selection. The right panel contains selected-structure details only.
- Use 68 source bundles with existing bilingual terminology, including the corpus callosum and anterior commissure. A dedicated Tractography mode exposes all 68; Connectome keeps the 52 original probability columns and switches between detailed trajectories and the preserved anatomical illustration.
- Source archive preparation yielded 98,484 trajectories and 1,973,727 retained vertices. All compressed geometry is 12.52 MB; details load on demand.
- Source verification exposed duplicated terminal coordinates in an original AF_R trajectory. The independent verifier was corrected to include the duplicate terminal points; the original and processed data were unchanged.
- Three.js line raycasting uses local object scale rather than accumulated parent scale. The uniform display transform is baked into line vertices so hit-test tolerance remains consistent; native source assets and scientific coordinates remain unchanged.

- Local Git clone failed because the child `git-upload-pack` executable could not be found. Cloning the already verified private GitHub baseline over HTTPS succeeded; the original workspace was not changed.
