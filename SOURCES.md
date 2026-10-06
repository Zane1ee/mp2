# MP2 source register

Accessed October 5–6, 2026. Application and build-helper code are authored for this
project; documentation is used as reference, with no copied application snippets.

- Course `README.md` and `.github/workflows/deploy.yml`: requirements and deployment.
- Local MP1 `SOP.txt` and source register, plus its related conversation:
  planning format and previous Pages configuration lessons.
- [Vite guide](https://vite.dev/guide/) and the `create-vite@9.2.1` `react-ts`
  starter: initialization and provided build/lint/TypeScript configuration.
- [Vite deployment guide](https://vite.dev/guide/static-deploy.html): Pages base.
- [React Router installation](https://reactrouter.com/7.18.4/start/declarative/installation)
  and [BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter):
  declarative routing, Link, and basename.
- [PokéAPI v2](https://pokeapi.co/docs/v2): catalog, Pokémon fields, units, and fair use.
  Runtime data comes from `https://pokeapi.co/api/v2/`. Images use HTTPS URLs
  returned by that API, including the [PokéAPI sprites repository](https://github.com/PokeAPI/sprites).
  These are API-provided Pokémon images, not original project artwork.
- [Axios cancellation](https://axios-http.com/docs/cancellation): cancellation
  and request ownership considerations. Shared requests remain repository-owned
  so a route unmount cannot cancel another consumer's request.
- [React StrictMode](https://react.dev/reference/react/StrictMode) and
  [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore):
  subscription cleanup and external shared data state.
- [Normalize.css](https://github.com/necolas/normalize.css): stylesheet normalization.
- [Vitest](https://vitest.dev/guide/): foundation tests; generated test data is used
  only inside tests, not as a disguised live application response.
- GitHub Docs: [Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
  and [404 pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
  Route entry generation is original project build logic and still needs live Pages verification.

## LLM usage

Codex assisted with planning, Rounds 1–4 application code and Round 5 release/documentation. The actual current-project
conversation checkpoint is exported locally to [docs/llm/mp2-chatlog.md](docs/llm/mp2-chatlog.md)
and indexed by [llm_logs.csv](llm_logs.csv), using the original
[scripts/export-chatlog.mjs](scripts/export-chatlog.mjs). It records visible
messages and assistant tool-call code/arguments, anonymizes paths and redacts
credential patterns. Automatic environment/browser state, system/developer
messages, internal reasoning, tool responses, webpage bodies and binary media
are excluded. The header identifies the export/checkpoint time and source SHA-256.
No public sharing or upload has been performed. Regenerate the actual record
after Round 5, submit it with the source, and answer the course LLM survey;
those final submission obligations remain pending. README does not require a
specific CSV or hosted log platform.

## Dependency compatibility check

The official npm registry engines for React Router 7.18.4 and Vitest 4.1.11
were checked. Both were pinned to preserve compatibility with the existing
Node 20 course workflow. Round 1 clean install, tests, and build were rerun
on Node 20.20.2; see ROUND1_ACCEPTANCE.md.

- `public/favicon.svg`: original geometric P mark authored for this project.


## Round 2 references and verification

- [React input](https://react.dev/reference/react-dom/components/input):
  controlled input values and change handling for as-you-type search.
- [React Router useSearchParams](https://reactrouter.com/api/hooks/useSearchParams):
  URL query state and navigation through the setter. Runtime code uses the
  installed React Router 7.18.4 API; the version-specific web page was unavailable,
  so the current official API page was used as reference.
- List selectors, query codecs, source-aware detail navigation, fallback context,
  and new tests are original implementation for this project; no external
  application code was copied.
- Node 20.20.2 lint, 25 tests, TypeScript/build, real-browser interaction,
  and ordinary static-server deep links were verified; see ROUND2_ACCEPTANCE.md.
  Existing dependencies and course workflow were preserved.


## Round 3 references, media, and verification

- Rechecked the course README, existing SOP, and [PokéAPI v2](https://pokeapi.co/docs/v2)
  for gallery fields, types, caching and request restraint.
- [Axios error handling](https://axios-http.com/docs/handling_errors)
  (redirects to https://axios.rest/pages/advanced/error-handling):
  response status/headers and timeout/network error handling.
- [MDN Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After):
  delay-seconds / HTTP-date syntax; queue cooldown is original project logic.
- public/data/pokemon-sample.json: six actual PokéAPI responses, reduced to
  display fields, collected at 2026-10-06T01:19:33.447963+00:00 (October 5 CT).
  Endpoints: https://pokeapi.co/api/v2/pokemon/1/, /4/, /7/, /25/, /39/, /60/.
  Metadata records the full API base, capture timestamp and exact IDs.
  Saved images remain HTTPS media URLs provided by the API; remote Pokémon
  artwork is not original project art and offline images are not guaranteed.
- Gallery filtering, URL codecs, dual repositories, sample validation, and
  failure recovery are authored for this project. Temporary synthetic browser
  fixtures stayed in /private/tmp and are not the submitted sample or live data.
- Final Node 20.20.2 lint, 39 tests, TypeScript/build, real API gallery interaction,
  static deep links and isolated browser fault injection passed; see
  ROUND3_ACCEPTANCE.md. No dependency/workflow upgrade was made.


## Round 4 references and verification

- Original course README and current SOP remain the requirements baseline;
  no new feature theme or API scope was introduced.
- [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  and [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html):
  reading references for contrast, narrow layouts and text-resize QA. Recorded
  color samples and browser tests do not constitute full WCAG certification.
- [MDN tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex):
  programmatic heading/main focus without adding headings to normal Tab order.
- The route-focus component, keyboard retry recovery, nullable media handling,
  numeric overflow defense, CSS revisions and two boundary tests are original
  project implementation. No copied external application source was used.
- [Art Institute of Chicago API](https://api.artic.edu/docs/): a planning-only
  alternative referenced in SOP; this app continues to use PokéAPI exclusively.
- Final Node 20.20.2 lint, strict typecheck, 41 tests in 4 files and build passed;
  the lockfile clean install was verified in an independent temporary directory.
  No dependencies or course workflow were changed.
- Actual application browser screenshots are stored under docs/qa/ with normal
  viewport and 200% text-resize measurements. Pokémon media in these QA screenshots
  comes from the API-provided sprite/artwork URLs, not original project art.
- Temporary synthetic faults and the external text-resize stylesheet were QA-only
  files outside the submitted app. Browser-injected annotation overlays are also
  outside the app root; no project inline styling/script/table layout was added.
- Full findings, limits and manual checks: [ROUND4_ACCEPTANCE.md](ROUND4_ACCEPTANCE.md).
  Live Pages, native browser 200% zoom and final course submission are still pending.


## Round 5 release references

- Original README remains the authoritative submission/deadline/API/rules source.
- Existing GitHub repository, Pages configuration and Actions API responses:
  actual public visibility, write permission, workflow-based deployment and HTTPS.
  Existing credentials were used only for GitHub; their values were never printed
  or written to the project/log export.
- [Actual Fall 26 MP2 form](https://forms.gle/PkYq9RaMFG8MaMjF7):
  first-page fields and two-page structure were inspected read-only. Personal
  information, elapsed work hours and LLM survey responses are for the owner to
  supply; no form response or demo video was fabricated.
- Commit/deployment checks, online browser QA and final checkpoint details will
  be recorded in ROUND5_ACCEPTANCE.md. Submission steps and video script are
  original project documents in SUBMISSION_CHECKLIST.md.
