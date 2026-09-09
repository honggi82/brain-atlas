# Brain Atlas implementation map

## Settled scope
- University/medical learning level, selected by the user on 2026-09-09.
- Kr / En language selection for the interface and explanations; Korean anatomical names followed by English terms in parentheses (user, added during implementation).
- Structural connectivity focus: white matter pathways and their cortical overlap probabilities (user).
- Interactive brain anatomy: orbit, zoom, pick, search, hemispheres, opacity, isolate and hide.
- Repository: a new private repository in honggi82's GitHub account.
- No app login. The user reviews the local app before approving public hosting.
- No paid API, paid models or metered compute are required for implementation.

## Decisions and open questions
- Detail level: university/medical learning (user).
- Access: URL without login (user); private source repository until further instruction.
- Appearance: bright anatomy workbench based on the user's Human Atlas reference; large central brain, structure list and explanation panel (reference-derived default).
- Audience: anatomy learners, including the owner inspecting the result (user/reference).
- Public hosting: OPEN, user approval after reviewing the working result; no automatic deployment.
- Default name: Brain Atlas / 뇌 해부 아틀라스, repository brain-atlas (implementation default).

## Evidence and pitfalls
- Human Atlas commit 1c38bf35c254a891200d3cedecfd57abebe83d8d is the preserved baseline in ../tmp/ha_ref.
- app/anatomy.ts provides Part/Concept/Atlas; app/scene.tsx implements picking and binary mesh loading. The camera is fitted for a whole body.
- public/models/atlas.json: the brain concept has incomplete membership; filtering only nervous excludes ventricles and endocrine structures. Do not copy those filters.
- Original data has no separately selectable sulci and no cerebellar lobule detail. Individual function explanations fall back to the same nervous-system text in app/anatomy.ts.
- A richer candidate is itayinbarr/brainproject: brain-atlas/models/brain.glb and manifest.json, 437 mesh entries including left/right duplicates. Mesh count must never be described as distinct functional areas.
- Its original Z-Anatomy / BodyParts3D geometry is gross-anatomy illustration. Added imaging-registered structures are approximate; docs/registration.md reports about 7 mm held-out alignment error. Show provenance and limitations in the app, not precise research coordinates.
- Sulci are anatomical landmarks: describe their location and adjacent regions, not an invented dedicated function.
- Preserve original MIT code notices, and CC BY-SA 4.0 notices for the richer model and derived metadata. Verify final asset provenance.

## Verification contract
- Exercise the real browser flow: load model, select mesh, search Korean/English, inspect names and functions, isolate, hide, change hemisphere/opacity, reset.
- Verify desktop and mobile layout, empty search, model failure and keyboard-accessible controls.
- Check mesh/metadata identities, unique IDs, description coverage, source links and Korean encoding.
- Build and serve production output; report measured results and any paths not exercised.
- Verify the remote repository is PRIVATE after uploading. Do not deploy publicly before review approval.

## Implementation notes
- Initial map delivered in conversation before implementation. Public hosting remains a deliberate final approval step.
- The HCP1065 table has 180 rows and 52 tract columns, with all 9,360 numeric values preserved. It is a tract-to-region bipartite connectome, not a region-to-region strength matrix. MMP functional parcels are not mapped arbitrarily onto anatomical gyri.
- 38 tract columns have semantic name-and-side mappings to model structures; 14 are table-only. Approximate tract geometry and source probability values are distinct layers.
- Browser QA exposed multi-primitive cortical nodes whose metadata belongs to their parent group. The loader now retains all 451 primitives within 325 logical structures and checks the count at load time.
- Terminology review found Base of peduncle misclassified under cerebellum upstream. The derived metadata corrects it to brainstem (32 structures), leaving 31 cerebellar structures and preserving sourceCategory. The source GLB and manifest hashes remain unchanged.
- Korean-only working source backups are in src/*.bak-20260909-kr0 and are excluded from Git. The full original Human Atlas remains untouched in ../tmp/ha_ref.

## Sources
- https://github.com/ashemag/human-atlas
- https://github.com/itayinbarr/brainproject
- https://github.com/itayinbarr/brainproject/blob/main/docs/registration.md
- https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

## Review response
After inspecting the result: “이 버전을 확인했으니 로그인 없는 공개 웹사이트로 배포해줘.”
