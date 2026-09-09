# Verification — 2026-09-10

## GitHub Pages migration

- The current app URL is **https://honggi82.github.io/brain-lab/about_brain/**. GitHub Pages reports `built` for public `brain-lab` commit `d0e8e4362a14d0803cdc71fc6204ef7ba2947d22`. The existing Pages configuration (`main`, repository root, `.nojekyll`) is unchanged.
- Added 94 runtime/data/licence files under `about_brain/`, without source maps, private development source, dependencies, hosting credentials or backups. All copied files matched the validated `dist-pages/` build. The original root-path `dist/` remains available as a baseline.
- Added the `뇌 해부도 / Brain Atlas` link to all 10 existing lab pages, with bilingual navigation and cache-version updates. Existing page content, footer, assets and layout are preserved. Both READMEs and the private app repository's homepage URL now point to the new address. The original `honggi82/brain-atlas` repository remains private; the deployed browser assets are public in `brain-lab`.
- `npm.cmd run build:pages` uses `/brain-lab/about_brain/` for scripts, model/data fetches and Draco. The build passed with the retained Three.js size advisory. `npm.cmd run check` passed for 17 JavaScript files and UTF-8 text; `npm.cmd test` passed **20/20**. Modified lab JavaScript and the new Python smoke test also passed syntax checks.
- `python -X utf8 tests/pages-smoke.py --site-dir ../.brain-atlas-pages` and `python -X utf8 tests/pages-smoke.py --url https://honggi82.github.io/brain-lab/` both passed. Each exercises bilingual lab navigation at 1536 pixels and actual full app flows at **1280 × 720** and **390 × 844**: all five functional entries, insula, native streamlines, matrix/threshold/region filters, representation switching, unresolved-code recovery, documentation/wasm/workbook downloads and the slashless URL redirect. No failed same-origin requests or captured app page errors remained. Temporary browsers and the local server closed in `finally`.
- Existing source/config/document backups are beside the originals with `.bak-20260910-pages`, including `README.md.bak-20260910-pages` and `package.json.bak-20260910-pages`. The lab checkout at `../.brain-atlas-pages/` contains 13 corresponding backups, including `index.html.bak-20260910-pages`. They are excluded from publication. Original file newline styles and Korean UTF-8 were rechecked; longest new runtime path is 86 characters.
- The existing in-app tab handoff returned `queued`; the deployed URL was independently exercised above. No deletion or redirect was applied to the former Sites deployment. Older publication sections below are historical snapshots.

## Unified white matter explorer, insula correction and functional anatomy

- Unified the two former white-matter modes into one explorer with a cortical-information checkbox. The actual browser flow verifies that this checkbox preserves the selected pathway, view, general search, region search and probability threshold. Native, anatomical and unresolved table-only paths remain distinct representations within the same explorer.
- Corrected the external subcentral nodes 145/146 and added two source-labelled BodyParts3D insula meshes, resulting in 327 selection units and 175 unique names. All original 325 identities and the original GLB/manifest are preserved. See `public/ANATOMY_REVIEW.md` for the position/name audit and its limitations.
- Added bilingual SMA, premotor, Broca, Wernicke and hippocampus exploration. The tests exercise all five buttons, reference counts, side changes and English inspector content. The interface explicitly identifies anatomical reference geometry rather than claiming exact functional boundaries.
- `npm.cmd run check` passed for 17 JavaScript files; `npm.cmd test` passed **20/20**. Python source compilation and the production build passed. The existing Three.js scene-size advisory remains.
- `python -X utf8 test-results/run-lobe-qa.py` passed the preserved baseline's AF/CST/OR flows and complete candidate flows at **1280 × 720** and **390 × 844**. This includes lobe/child selection, visibility, isolation, hemispheres, Kr/En, five functional entries, insula, density, cameras, the 67/180-row arcuate table, state-preserving checkbox, related tracts, and unresolved PTAT recovery. No page errors or horizontal overflow were captured. Temporary servers and browsers closed in `finally`.
- The first candidate test incorrectly assumed that re-entering white-matter mode resets the chosen pathway to the corpus callosum. It correctly preserved the previous whole-brain state; the test now explicitly selects corpus callosum before testing the no-table case. No application assertion was weakened.
- Milestone screenshots `test-results/insula-1280.png` and `test-results/sma-1280.png` were visually inspected. The insula is shown inside transparent covering cortex; SMA shows the stated anatomical reference, not a segmented functional region.
- Source, test and README backups remain beside their files with suffixes `.bak-20260909-unified` and `.bak-20260909-insula`. Public data/document backups are in `test-results/insula-backups/` to prevent Vite from shipping them. All backups are excluded from Git and deployment.
- Published Sites version 3 from `c0bd7fb25570d548f427c0cbe16f69ff581801b9` to the existing URL, **https://honggi82-brain-atlas.honggi82.chatgpt.site**. `python -X utf8 tests/public-smoke.py https://honggi82-brain-atlas.honggi82.chatgpt.site` passed in fresh anonymous HTTPS contexts at both viewport sizes, including all five functional entries, the corrected insula and unified white-matter flow. No page errors or horizontal overflow were captured. The GitHub API reported `isPrivate: true` for `honggi82/brain-atlas`.
- The static archive was validated before saving, with 95 files and no backups, source tree or dependencies. The existing Windows packaging workaround was reused. The existing in-app tab handoff returned `queued`; this does not affect the independently verified public URL. This verification-record update changes no deployed runtime files.
- This section records the current publication; older sections below describe previous snapshots. Expert review, physical phones, Safari and Firefox remain untested.

## Requested Korean lobe names

- Published Sites version 2 from `7cd670f07c26be980ad843ac8fd1acbf56ffedfd` at the existing public URL below. The four primary labels are now `전두엽 (Frontal lobe)`, `두정엽 (Parietal lobe)`, `후두엽 (Occipital lobe)` and `측두엽 (Temporal lobe)`. Legends, cortical groups, region labels and Korean descriptions use these names. Previous names remain searchable without appearing as lobe inspector subtitles.
- `npm.cmd run check` passed for all 15 JavaScript files; `npm.cmd test` passed **18/18**. Both touched Python tests compile. UTF-8 and newline checks passed, including regenerated metadata and terminology documentation. Exactly 30 generated anatomical summaries changed; all 325 identities and every other metadata field are preserved. The production build passed with the existing scene chunk size advisory.
- The local browser smoke passed on both 1280 × 720 and 390 × 844, including the preserved baseline selections and the candidate's lobe/child selection, visibility, isolation, hemisphere, Kr/En, tractography and connectome flows. All temporary servers and browsers closed in `finally`.
- `python -X utf8 tests/public-smoke.py https://honggi82-brain-atlas.honggi82.chatgpt.site` passed on both viewports with fresh anonymous contexts. Each of the four exact Korean names was checked in the legend, tree and inspector, through Kr → En → Kr. Selected group counts stayed 42, 14, 18 and 22 respectively. Native tractography and the 67-row connectome still loaded. No page errors or horizontal overflow were captured.
- Backups of edited source, README and tests remain beside those files with suffix `.bak-20260909-lobe-terms`. Public asset backups were moved to `test-results/lobe-term-backups/` before the final build because Vite copies every public file into the deployment. The final validated archive contains 92 files and no backup files. These local backups and packaging artifacts are excluded from Git.
- This section records the current publication; deployment and naming statements in older sections below describe previous snapshots. This change did not require new anatomy data or an additional expert medical review.

## Public website deployment

- Published successfully to **https://honggi82-brain-atlas.honggi82.chatgpt.site** with Sites access set to `public`. The app has no sign-in feature. GitHub remains private.
- `python -X utf8 tests/public-smoke.py https://honggi82-brain-atlas.honggi82.chatgpt.site` passed in fresh, anonymous Chromium contexts at **1280 × 720** and **390 × 844**. Both loaded all 325 anatomical identities, displayed the seven legend groups, selected 42 frontal structures, switched to English, loaded 2,000 corpus-callosum streamlines, and displayed 67 arcuate-connectome rows. No page errors or horizontal overflow were detected. Browsers closed in `finally`.
- `npm.cmd run check` passed for 15 JavaScript files and UTF-8 text; `npm.cmd test` passed **18/18**. `npm.cmd run build` passed with the retained scene-size advisory. The runtime source was published from `5cf9d425d9a662b31bd75ba3e54e0b5358c8ef2c`; subsequent repository changes only document the final URL and results.
- The initial provisional URL had a TLS error while publication was pending. The service's final successful deployment response assigned the URL above; anonymous HTTPS verification used that exact URL without disabling certificate checks or supplying an access token.
- The Sites build wrapper failed to locate npm's CLI on this Windows environment; the existing `npm.cmd run build` succeeded. The Node staging helper exited with native status `0xC0000409` without a JavaScript diagnostic. Packaging used a local Python implementation of the same static archive contract: validated `dist/index.html`, regular asset files, project-contained paths and the hosting manifest, with no runtime bindings, source tree, Git history or dependencies in the archive. The Sites service accepted and deployed the archive.
- Temporary source credentials were entered through non-echoing input and supplied to Git only through per-process environment configuration; no credentials were persisted in files, remote URLs or Git configuration. Local preparation folders were removed after their resolved paths were verified. No local application server is required for this public website.

## Lobe labels and descriptions

- Shared lobe metadata now drives mesh colours, the stage legend, cortical subgroups and bilingual location/function descriptions. All 128 cortical structures belong to exactly one source-derived group; source meshes and original part metadata are unchanged.
- `npm.cmd run check`: **15 JavaScript files** syntax-checked; UTF-8 checks passed. `npm.cmd test`: **18/18 passed**. Production build passed with the existing advisory for the Three.js scene chunk (571.27 kB; 146.85 kB gzipped).
- The shipped UI was exercised in isolated Chromium at **1280 × 720** and **390 × 844**. All six lobes and the separate boundary/sulcus group display names, locations, functions and sources in Kr/En. Korean includes English in parentheses; the tested English inspectors contain no Korean text.
- Frontal lobe isolation displays **42** structures bilaterally and **21** on either side. Hiding one child changes this to **41** and makes the group checkbox mixed. Returning to the group restores all 42. Selecting a child preserves individual selection and links back to its lobe.
- Starting with everything hidden, enabling parietal shows **14** structures; selecting frontal then shows **56**; hiding frontal leaves **14**. Lobe selection scrolls only the library to the corresponding heading. Legend, model area and hemisphere/opacity controls do not overlap in tested viewports; no horizontal overflow was detected.
- A test initially expected the query `두정엽` to return only 14 parietal members. Inspection showed that the existing function/alias search correctly also finds boundary sulci and related tracts. The test was corrected to assert the 14 members within the parietal group and retain a related central-sulcus result; the search was not narrowed to satisfy the test.
- Existing anatomy, streamline density, hemisphere, whole-brain, matrix and unresolved-code recovery flows pass on both viewports. The preserved original app's AF, CST and OR selections also pass. No application page errors were captured.
- Pointer hover over the rendered frontal cortex displayed its anatomical part and lobe. Clicking that same rendered geometry selected the part, retained the lobe in its floating label, and displayed the inspector link back to frontal-lobe details on both viewports.
- Local screenshots: `test-results/lobes-1280.png` and `test-results/lobes-390.png`. Both were visually inspected. Temporary browsers and servers are closed after QA. The before-change source backups are `src/main.js.bak-20260909-lobes`, `src/scene.js.bak-20260909-lobes` and `src/i18n.js.bak-20260909-lobes`, excluded from Git. Their LF newline style is preserved.

No new segmentation was created. The source's composite insula and incomplete limbic grouping are explained in the interface. Independent expert anatomical review, physical mobile devices, Safari/Firefox and public hosting remain outside this verification.

## Streamline and unified-tree upgrade

The previous working app remains in `../brain-atlas` at commit `4bb19a9`. The candidate is in `brain-atlas-v2` and reuses the exact same unmodified anatomical GLB, terminology catalogue and probability matrix.

- `npm test`: **16/16 passed**, including all 68 streamline payload hashes, 98,484 source-index identities, finite coordinates, original bilateral mappings, 48 matrix matches, deliberate unresolved codes, RGB orientation invariance, non-bridging line generation, corrupt-data rejection and the display-coordinate picking tolerance.
- `python scripts/verify-streamlines.py`: **544/544** selected original TRK trajectories checked independently, eight per bundle. Original endpoints and retained vertices match; the largest measured simplification deviation is **0.249986 mm**. This checks numerical conversion rather than biological validity.
- `python scripts/verify-matrix.py`: **9,360/9,360** values still match the original workbook.
- `npm run check`, Python compilation and the production build pass. The Three.js scene chunk remains above Vite's advisory size threshold (about 571 kB, 147 kB gzipped); the advisory remains visible.
- The in-app browser exercised source-derived corpus-callosum, arcuate, corticospinal and optic-radiation views; left/right selection; 200 versus 2,000 selected fibres through the density slider; isolated versus context tracts; and switching back to the preserved anatomical illustration with the same probability table.
- Direct clicking of displayed streamlines selected the corresponding named bundle. The display transform is baked into line geometry so Three.js raycasting applies its 0.5 mm tolerance consistently; this is a UI hit-test tolerance, not an accuracy claim for the atlas.
- The unified left tree has eight anatomical parent groups and individual visibility checkboxes. The inspector has **zero** duplicated layer controls. Hiding everything then selecting only left hippocampus renders exactly one structure; category enable/disable and mixed check state were exercised. Korean/English switching preserved the query and selection.
- An intentional first-detail HTTP 503 (`--test-streamline-failure`) displayed an error and retry control; retry loaded the full 2,000 corpus-callosum trajectories. Normal in-app flows had no captured console errors.
- `python tests/browser-smoke.py` exercises independent headless Chromium at **1280 × 720** and **390 × 844**: tree visibility, single-structure selection, contralateral selection after hiding a group, bilingual state, real streamlines, density, zoom, whole-brain overview, view switching and recovery from a table-only code to the whole brain. Both complete flows passed and browsers closed in `finally`.
- The in-app viewport override did not change the measured 1280 × 720 page size. It was reset; mobile assertions and the mobile screenshot instead come from isolated headless Chromium with the actual viewport size asserted. The user's Chrome windows, mouse and keyboard were not controlled.
- Screenshots are local QA artifacts in `test-results/fibres-1280.png` and `test-results/fibres-390.png`, excluded from Git. The mobile screenshot was visually inspected and has no horizontal overflow.

Physical mobile devices, Safari/Firefox, expert anatomical review and public hosting remain untested. The archive is a population-average diffusion-MRI reconstruction; individual axons, synapses or a clinical DTI examination are not represented.

## Original baseline verification

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
