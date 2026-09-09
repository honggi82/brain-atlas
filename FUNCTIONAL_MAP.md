# Functional anatomy correction · 2026-09-10

## Confirmed scope
Expand bilingual functional exploration and correct its geometry on the existing public lab site. Preserve the shared navigation/language controls and tractography. The user requests accurate educational localization, not individual clinical mapping.

## Decisions resolved from the code and data
- `src/functional.js` previously selected whole gyri for SMA, premotor and posterior language regions. `src/scene.js` colored these entire meshes. Replace these cortical references with native HCP-MMP1.0 vertex labels on matching S1200 fs_LR32k pial surfaces.
- The source has 32,492 vertices per hemisphere. CIFTI cortex vertices must be restored using BrainModelAxis vertex indices; sequential assignment would silently shift labels at the medial wall.
- The CAB-NP label table uses network names. Resolve original Glasser names using GLASSERLABELNAME and KEYVALUE, never infer them from network order.
- Keep the functional surface separate from Z-Anatomy: their coordinate systems and subjects differ. Switch surfaces when selecting cortical functions; restore anatomy for structural selections and hippocampus.
- Functional groups are educational selections of atlas parcels. Distributed functions such as language do not have a single universal boundary. Show the actual included parcel IDs and this distinction in both languages.

## Existing preferences and conventions
Korean terms include English in parentheses. Use the parent lab's Kr/En menu. Anatomical hemisphere selection and camera controls remain available. Selecting a new functional topic starts with its representative hemisphere; explicit hemisphere changes remain effective.

## Risks closed by implementation/verification
- Preserve native RAS coordinates in exported data; apply only uniform display scale and a rigid axis rotation, with no registration onto Z-Anatomy.
- Show transparent cortical context so buried visual/auditory regions remain visible; offer opaque surface and isolated region views.
- Honor the source's noncommercial license, include its text and the conversion source with the public derived asset. This is a free educational lab site.
- Validate every exported coordinate/index/label against the source, test primary cortex anatomical ordering, and exercise all topic selections in both languages and hemispheres.
- No unresolved user decision blocks this correction. Individual functional variability remains a stated limit, and independent expert review is not claimed.

## Implementation notes
The source CIFTI's cortical names are network labels, so the separate original-name key is required. Whole hippocampal geometry remains the existing anatomical model; the MMP hippocampal cortical parcel is not substituted for the entire hippocampus.
