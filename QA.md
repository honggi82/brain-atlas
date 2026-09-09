# Verification — 2026-09-09

## Automated checks

- `npm run check`: syntax checks for 10 JavaScript files and UTF-8 checks passed.
- `npm test`: **10/10 passed**. Covers pinned model identities, multi-primitive cortical nodes, full Korean/English coverage, terminology corrections, source hashes, matrix integrity, zero-preserving thresholds, laterality, model mapping, search and pointer gestures.
- `python scripts/verify-matrix.py`: **9,360/9,360 numeric values match** the XLSX cells exactly; all 180 row identifiers and 52 column identifiers also match.
- `python -m py_compile scripts/fetch-assets.py scripts/serve.py scripts/verify-matrix.py`: passed.
- `python scripts/fetch-assets.py`: existing pinned files validated successfully without downloading replacements.
- `npm run build`: production build passed. Vite reports that the Three.js scene chunk exceeds its 500 kB advisory threshold (about 566 kB, 145 kB gzipped). The scene loads separately from the interface. This advisory is retained, not suppressed.
- `npm audit`: **0 vulnerabilities**. The initial sandboxed audit could not reach the registry; the read-only audit succeeded with network access.
- Project text files were reread as UTF-8; no replacement characters, unexpected ideographic spaces or runs of question marks were found. Longest distributed file path at this review was 74 characters.

## Real browser flows exercised

Production files were served locally and operated through the Codex in-app Chromium browser, not just compiled.

- Model loaded successfully: **325 logical structures and 451 render primitives**. The cortex is visually present; multi-primitive nodes remain selectable as one structure.
- Clicked the 3D middle frontal gyrus and received the corresponding explanation. Dragging rotated the brain without accidentally changing selection.
- Selected and isolated the hippocampus; hid a structure and restored the whole model. Toggled the cortex layer and verified its hidden state; changed cortical transparency to 100% and switched hemispheres.
- Korean name search, English name search and English function search (`episodic`) returned relevant structures. Empty search states were checked.
- Switched Kr → En → Kr while preserving the selected hippocampus and the search query. Korean heading read `해마 (Hippocampus)`; English heading read `Hippocampus` with an English function summary.
- Language preference survived a reload. The English anatomy, connectome and source dialog were checked for untranslated visible Korean text; none was found in those exercised states.
- Connectome: selected left arcuate fasciculus and inspected the visible tract and table. At 5%, 67 areas were shown; at 0%, all 180 areas including 98 exact zeros were shown. Area 6r was 100.0%; area 44 was 99.8% after display rounding.
- Selected V1 and explored its other same-hemisphere tracts. Optic radiation was 100.0%. Switched to the right hemisphere and verified the tract/table side changed together.
- Selected a table-only PTAT column; the previous 3D selection was cleared and the missing-geometry explanation was shown.
- Source dialog opened and closed with appropriate English content.
- Desktop **1280 × 720** and mobile **390 × 844** layouts were exercised. No horizontal overflow was detected on mobile; camera zoom controls were clicked successfully. Temporary viewport override was reset.
- Served an intentional model HTTP 503 with `python scripts/serve.py --port 4184 --test-model-failure`. The error message and reload control appeared; language switching and structure searches remained usable. This was an expected fault injection, not an unresolved application failure.
- Normal application console had **no captured errors** at the end of the tested flow.
- `Start.cmd --no-open` completed the production build and started the review server. Reloading the browser reached `ready=true` and the Korean precentral-gyrus view. Browser auto-opening itself was not exercised.

## Limits of this verification

- These checks verify application behaviour and data preservation, not the clinical validity of every educational summary or atlas registration.
- Physical iOS/Android devices, Safari, Firefox, WebGL-disabled hardware and slow mobile-network performance were not tested.
- Public hosting and its anonymous-access behaviour are not yet tested because public deployment is awaiting the owner's review/approval. The local app has no authentication layer.
- The HCP data are published population derivatives. No individual HCP participant scans or restricted data were accessed.
- Native browser auto-opening is not part of browser automation; the launcher's `--no-open` path is used for local verification so testing does not take over the user's foreground browser.

The original Human Atlas baseline remains in `../tmp/ha_ref`. The working Korean-only source snapshot before the language feature is preserved locally in `src/*.bak-20260909-kr0` and excluded from Git.
