# MP2 source register

References accessed October 5-6, 2026. Application and build-helper code were
authored for this project with Codex assistance. Documentation was used for
reference; no external application implementation was copied.

## Assignment and planning

- Course [README.md](README.md) and `.github/workflows/deploy.yml`: requirements,
  rubric, restrictions, deadline, build output and submission process.
- MP1's local SOP, source register and related project conversation: the
  Actions/Verify structure and earlier GitHub Pages configuration lessons.
  MP2 follows its own course rules and React/Vite architecture.
- MP1's `llm_logs.csv`: the owner's preferred convention of directly recording
  a real conversation URL in CSV.
- [Art Institute of Chicago API](https://api.artic.edu/docs/): a planning-only
  alternative. PokéAPI was selected; the application does not call the AIC API.

## Tooling and implementation references

- [Vite guide](https://vite.dev/guide/) and `create-vite@9.2.1` react-ts starter:
  initialization and the provided build/lint/TypeScript configuration.
- [Vite deployment](https://vite.dev/guide/static-deploy.html): repository base
  path and GitHub Pages deployment.
- [React Router installation](https://reactrouter.com/7.18.4/start/declarative/installation)
  and [BrowserRouter](https://reactrouter.com/api/declarative-routers/BrowserRouter):
  declarative routes, Link and basename.
- [React Router useSearchParams](https://reactrouter.com/api/hooks/useSearchParams):
  URL parameters and setter-based navigation. The installed API is Router 7.18.4;
  the current official page was used when its version-specific page was unavailable.
- [React input](https://react.dev/reference/react-dom/components/input): controlled
  input values and filtering while typing.
- [React StrictMode](https://react.dev/reference/react/StrictMode) and
  [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore):
  effect cleanup, subscriptions and shared repository state.
- [Axios cancellation](https://axios-http.com/docs/cancellation): request ownership
  and cancellation considerations. Shared requests remain repository-owned so a
  view unmount cannot cancel another consumer's request.
- [Axios error handling](https://axios-http.com/docs/handling_errors), whose current
  destination is [Axios error handling](https://axios.rest/pages/advanced/error-handling): response
  status/headers and timeout/network errors.
- [MDN Retry-After](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After):
  delay-seconds and HTTP-date syntax. Queue cooldown is original project logic.
- [Normalize.css](https://github.com/necolas/normalize.css): normalization stylesheet.
- [Vitest](https://vitest.dev/guide/): behavior/risk tests. Synthetic fixtures are
  used for tests, not as undisclosed live application data.
- Official npm registry engines for Router 7.18.4 and Vitest 4.1.11: compatibility
  with the course's Node 20 workflow. Versions were pinned after verification.
- GitHub Docs: [Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
  and [404 pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
  Generation of identical SPA route shells is original project build logic.

## Data and media provenance

- [PokéAPI v2](https://pokeapi.co/docs/v2): catalog, Pokemon fields, measurements
  and fair use. Live data comes from `https://pokeapi.co/api/v2/`.
- Images use HTTPS URLs returned by the API, including assets in the
  [PokéAPI sprites repository](https://github.com/PokeAPI/sprites). Pokemon media
  is API-provided artwork, not original project illustration.
- `public/data/pokemon-sample.json`: six actual API responses reduced to display
  fields, captured at `2026-10-06T01:19:33.447963+00:00` (October 5 CT).
  Endpoints were https://pokeapi.co/api/v2/pokemon/1/ and the corresponding
  `/pokemon/4/`, `/7/`, `/25/`, `/39/`, `/60/` URLs on the same API base.
  Source, timestamp and exact IDs are recorded in the JSON. Sample images remain
  remote URLs and are not guaranteed offline.
- `public/favicon.svg`: original geometric P mark created for this project.
- Browser screenshots under `docs/qa/` show the actual app and API-provided media.
  Temporary synthetic HTTP faults and an external text-resize stylesheet stayed
  outside the shipped application and sample data.

## Accessibility and verification references

- [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
  and [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): contrast,
  narrow layouts and text-resize review. Tests do not constitute full WCAG certification.
- [MDN tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex):
  programmatic heading/main focus without adding headings to normal Tab order.
- Release [6a5e218](https://github.com/Zane1ee/mp2/commit/6a5e218b462f6c9dfb9cf3ac856e2b9a8645f5d6)
  and [successful application workflow](https://github.com/Zane1ee/mp2/actions/runs/37421031265):
  real Node 20 CI build/deploy. The subsequent documentation release also passed.
  Local Node 20.20.2 installation, lint, strict types, 41 tests and build passed.
- `docs/qa/online-static-results.json` and `online-browser-results.json`: real
  deployed route/resource and interaction evidence. Earlier personal acceptance
  reports are retained outside the current public tree and in Git history.

## LLM usage

Codex assisted with planning, application implementation, verification, release
and documentation. [llm_logs.csv](llm_logs.csv) directly records the owner-provided
shared conversation URL, following the previous MP's single-link CSV convention.
The actual share was opened and inspected on October 6: it contains planning,
all five implementation rounds, final release discussion and expandable code diffs.
This is a real conversation record, not a reconstructed narrative or placeholder.

The share is a snapshot through the five-round release. If later relevant work
falls outside it, add an updated actual share reference before submission.
The original local export and its helper are retained as personal reference
outside this repository and in previous commits. Markdown exports, round reports
and a submission worksheet are not README-mandated deliverables.
The owner must still select Yes for LLM use, answer the experience survey and
complete the actual course submission; a CSV link does not replace the survey.

- [Fall 26 MP2 form](https://forms.gle/PkYq9RaMFG8MaMjF7): inspected read-only for
  submission fields and its two-page structure. Personal information, actual
  work hours and survey responses must come from the owner.
