# HCP1065 streamline methods

## Source and licence

Fang-Cheng Yeh (2022), *Population-based tract-to-region connectome of the human brain and its hierarchical topology*, Nature Communications 13, 4933. https://doi.org/10.1038/s41467-022-32595-4

Source and CC BY-SA 4.0 statement: https://brain.labsolver.org/hcp_trk_atlas.html . The HCP acknowledgement in [ATTRIBUTION.md](ATTRIBUTION.md) also applies. These processed streamline files and their metadata remain CC BY-SA 4.0.

Archive: https://github.com/data-others/atlas/releases/download/hcp1065/hcp1065_avg_tracts_trk.zip

Source archive: 587,869,457 bytes; SHA256 `344aad4394f18b8926ed5e1bda911ad56e328c6cf75faa45e1302512ad779c67`.

## What is displayed

68 named bundles contain **98,484 selected original trajectories**, with **1,973,727 retained vertices**. A whole-brain overview has **5,434** trajectories. All compressed geometry, including the overview, totals **12,520,515 bytes**. Only the 633,641-byte overview and the selected bundle are requested when entering streamline view. At most four detailed bundles are retained in GPU memory.

The archive contains additional bundles and cranial-nerve reconstructions outside this viewer's named brain-pathway catalogue. Counts describe this distributed subset, not an exhaustive human connectome or a number of axons.

The unseparated MCP and SCP source files are labelled bilateral, not artificially split into left and right. Commissural AC and CC span the midline. These shared bundles remain visible when either hemisphere is selected.

- For each source file, select at most 2,000 whole trajectories using a fixed PCG64 permutation seeded by the first 32 bits of the SHA256 of its archive path. Fewer available trajectories are all preserved.
- Apply Ramer–Douglas–Peucker simplification with maximum 0.25 mm deviation in native coordinates. Endpoints and retained vertices are original source coordinates. No decorative fibres, spatial jitter, invented branches or cross-bundle interpolation are added.
- The first 80 selected trajectories per bundle form the overview. The display-density slider reveals a prefix of this fixed ordering; it does not change the source or estimate fibre density.
- Each manifest entry records its source file and hash, original count, selected source indices, source header, bounds, output counts and output hash.

## Coordinates and colours

NiBabel 5.4.2 reads TrackVis voxel-mm coordinates, including the half-voxel convention, into **RAS+ millimetres in ICBM 2009a Nonlinear Asymmetric space**. Source TRK headers specify LPS voxel order. Ignoring that header would reverse left/right and anterior/posterior.

The renderer rotates `(R,A,S)` to Three.js `(x,y,z) = (R,S,-A)` and uses a uniform display scale of 0.018 scene units per mm. It applies no anatomical deformation. The separate Z-Anatomy illustration is hidden in this view: it is not registered to these streamlines. The approximate tube view remains available separately in Connectome.

Local RGB colour is the absolute unit tangent in native RAS coordinates: red left/right, green anterior/posterior, blue superior/inferior. Reversing a streamline leaves the colour unchanged. Colour is not signal direction, connection strength, FA or a diagnostic measurement.

The streamlines are diffusion-MRI reconstructions from a population-average atlas. They are not an individual DTI examination and do not directly measure individual axons, synapses or true neural branching. More detailed rendering does not establish clinical accuracy.

## Relationship to the probability table

**48 of 52** tract-to-region columns have code-and-side matches to these source streamline bundles. Explicit equivalent naming mappings include `SLF_I/II/III` to `SLF1/2/3`, `CStr_A/P/S` to `CS_A/P/S`, and `CTh_A/P/S` to `TR_A/P/S`. These correspond to the named superior longitudinal, corticostriatal and thalamic pathways.

Both `PTAT` and `C_R` remain unresolved for both hemispheres. Neither is guessed to be `PAT` or a different cingulum subdivision. The previous anatomical illustration still has 38 semantic model mappings. Neither mapping scheme geometrically registers the 180 MMP parcels to the anatomical gyri. All 9,360 original probabilities remain unchanged.

## Reproduction and validation

The application runs from the committed assets without Python scientific packages. To regenerate the data, install NumPy and NiBabel 5.4.2 in an isolated build environment, run `python scripts/fetch-streamlines.py`, then `python scripts/prepare-streamlines.py`. The optional `reference/py` directory is used for a project-local NiBabel installation in this workspace and is excluded from Git.

`npm test` checks every shipped binary hash, finite coordinates, record offsets, selected-index uniqueness, terminology coverage, orientation colours and all matrix mappings. `python scripts/verify-streamlines.py` independently compares eight evenly spread selected samples per bundle to the original TRK, including original vertices, ordered endpoints and deviation of removed points. **544 samples passed; largest measured deviation 0.249986 mm**. This checks conversion fidelity, not whether tractography correctly estimates every biological connection.

The verifier initially stopped on duplicated terminal coordinates in an original AF_R trajectory. It was corrected to include the entire terminal segment, including repeated endpoints; no source or processed geometry was changed to make the check pass.
