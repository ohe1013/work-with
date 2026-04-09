# Current Progress

Last updated: 2026-04-09

## Objective

Keep the workout-partner product thesis intact while moving the repo into a milestone-based implementation flow with a map-first, Toss-inspired UI direction.

## Current status

- Phase: M5 in progress
- Active milestone: M5
- Working mode: milestone-by-milestone

## Completed

- [x] Added Codex operating docs, AGENTS guides, progress docs, and reusable prompts
- [x] Added root validation scripts: `check`, `client:build`, `client:test`, `client:lint`, `server:build`
- [x] Rewrote `README.md` with a local development runbook and Docker Compose scope notes
- [x] Fixed frontend lint, build, and test blockers so the documented validation path now works
- [x] Fixed backend build blockers in `server/src/util/jwt.utils.ts`
- [x] Introduced M1 shared design tokens, shared UI primitives, and an updated app shell in `client`
- [x] Refined the map-first home layout for mobile and desktop with a denser map surface, a clearer side panel, and stronger search/result hierarchy in `client`
- [x] Completed the remaining M1 map discovery polish by aligning loading, empty, and detail states with the shared component language in `client`
- [x] Started M2 by connecting map selection, list selection, and panel detail flow into one shared interaction model in `client`
- [x] Expanded the connected selection flow into a more explicit mobile bottom-sheet and desktop side-panel discovery surface in `client`
- [x] Expanded the M2 home discovery flow with shared loading/empty/error state, retry/refine actions, and map/panel status messaging in `client`
- [x] Completed M2 by removing the remaining home discovery placeholders and replacing them with productized exploration copy, guides, and selection briefs in `client`
- [x] Started M3 by turning `/find` into a real condition-based discovery page with its own filters, map/result comparison surface, and shared search execution flow in `client`
- [x] Completed M3 by turning `/regist` into a real staged posting flow with sectioned inputs, validation, a pre-submit summary, and a local success state in `client`
- [x] Started M4 by aligning the frontend and server auth flow around a stable login contract, shared session storage, and a working `/api/login` endpoint in `client` and `server`
- [x] Replaced the mocked work-with registration/detail paths with explicit client-server API contracts, shared types, and demo persistence in `client` and `server`
- [x] Completed M4 by documenting the current search / auth / posting request-response shapes in `docs/api-contracts.md`
- [x] Started M5 by auditing the acceptance checklist and polishing the highest-signal trust/access copy gaps across the header, `/find`, and `/login`
- [x] Continued M5 by softening home / find / regist flow-finish empty states and adding clearer recovery actions across shared search and posting flows

## Next up

1. [ ] Refresh README / docs where the implementation or milestone state has drifted
2. [ ] Recheck `docs/acceptance-checklist.md` against the latest M5 polish state and confirm whether any UX gaps still block milestone closure
3. [ ] Add any remaining focused tests needed to support the final M5 polish pass

## Immediate next task

Refresh README / docs where the implementation or milestone state has drifted.

## Known constraints

- The login flow now uses a stable demo contract, but it still authenticates against a fixed development credential set instead of persisted user data
- Work-with registration/detail now use explicit API contracts, but the server storage is still in-memory demo data and resets when the Node server restarts
- `docker-compose.dev.yaml` still does not start the Node server

## Latest validation

- `2026-04-09`: `yarn --cwd client lint` passed after the M5 flow-finish recovery-action polish update
- `2026-04-09`: `yarn --cwd client build` passed after the M5 flow-finish recovery-action polish update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M5 flow-finish recovery-action polish update
- `2026-04-09`: `yarn --cwd client lint` passed after the M5 trust/access polish update
- `2026-04-09`: `yarn --cwd client build` passed after the M5 trust/access polish update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M5 trust/access polish update
- `2026-04-09`: `yarn --cwd client lint` passed after the M4 API contract documentation update
- `2026-04-09`: `yarn --cwd client build` passed after the M4 API contract documentation update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M4 API contract documentation update
- `2026-04-09`: `yarn --cwd server build` passed after the M4 API contract documentation update; `server/package.json` still has no license field
- `2026-04-09`: `yarn --cwd client lint` passed after the M4 work-with contract update
- `2026-04-09`: `yarn --cwd client build` passed after the M4 work-with contract update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M4 work-with contract update
- `2026-04-09`: `yarn --cwd server build` passed after the M4 work-with contract update; `server/package.json` still has no license field
- `2026-04-09`: `yarn --cwd client lint` passed after the M4 auth contract alignment update
- `2026-04-09`: `yarn --cwd client build` passed after the M4 auth contract alignment update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M4 auth contract alignment update
- `2026-04-09`: `yarn --cwd server build` passed after the M4 auth contract alignment update; `server/package.json` still has no license field
- `2026-04-09`: `yarn --cwd client lint` passed after the M3 `/regist` route split update
- `2026-04-09`: `yarn --cwd client build` passed after the M3 `/regist` route split update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M3 `/regist` route split update
- `2026-04-09`: `yarn --cwd client lint` passed after the M3 `/find` route split update
- `2026-04-09`: `yarn --cwd client build` passed after the M3 `/find` route split update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M3 `/find` route split update
- `2026-04-09`: `yarn --cwd client lint` passed after the M2 discovery placeholder removal update
- `2026-04-09`: `yarn --cwd client build` passed after the M2 discovery placeholder removal update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M2 discovery placeholder removal update
- `2026-04-09`: `yarn --cwd client lint` passed after the M2 discovery-state flow update
- `2026-04-09`: `yarn --cwd client build` passed after the M2 discovery-state flow update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M2 discovery-state flow update
- `2026-04-09`: `yarn --cwd client lint` passed after the M2 bottom-sheet / side-panel detail update
- `2026-04-09`: `yarn --cwd client build` passed after the M2 bottom-sheet / side-panel detail update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M2 bottom-sheet / side-panel detail update
- `2026-04-09`: `yarn --cwd client lint` passed after the M2 connected-selection flow update
- `2026-04-09`: `yarn --cwd client build` passed after the M2 connected-selection flow update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M2 connected-selection flow update
- `2026-04-09`: `yarn --cwd client lint` passed after the M1 discovery-state polish update
- `2026-04-09`: `yarn --cwd client build` passed after the M1 discovery-state polish update; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the M1 discovery-state polish update
- `2026-04-09`: `yarn --cwd client lint` passed after the home/map responsive layout refinement
- `2026-04-09`: `yarn --cwd client build` passed after the home/map responsive layout refinement; Browserslist still reports an outdated `caniuse-lite` database
- `2026-04-09`: `yarn --cwd client test` passed after the home/map responsive layout refinement
- `2026-04-09`: `yarn run check` passed after the M1 shared UI system update
- `2026-04-09`: `yarn client:lint` passed
- `2026-04-09`: `yarn client:build` passed
- `2026-04-09`: `yarn client:test` passed
- `2026-04-09`: `yarn server:build` passed
- Remaining non-blocking notes: Browserslist reports an outdated `caniuse-lite` database, and `server/package.json` still has no license field

## Validation baseline

- `yarn start`
- `yarn run check`
- `yarn --cwd client lint`
- `yarn --cwd client build`
- `yarn --cwd client test`
- `yarn --cwd server build`

## Rule for the next Codex run

Pick one unfinished item from `docs/milestones.md`, implement it fully, rerun the relevant validation, and update this file's `Completed`, `Next up`, and `Known constraints` sections before stopping.
