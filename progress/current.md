# Current Progress

Last updated: 2026-04-09

## Objective

Keep the workout-partner product thesis intact while moving the repo into a milestone-based implementation flow with a map-first, Toss-inspired UI direction.

## Current status

- Phase: M2 in progress
- Active milestone: M2
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

## Next up

1. [ ] Expand the connected selection flow into a more complete mobile bottom-sheet / desktop side-panel discovery experience
2. [ ] Expand map discovery state handling from component-level polish to full-flow empty/loading/error behavior
3. [ ] Split `/find` and `/regist` into real pages in milestone order
4. [ ] Continue auth/API contract cleanup after the UI milestone

## Immediate next task

Turn the new connected selection flow into a more explicit discovery surface, especially the mobile bottom-sheet and desktop side-panel detail behavior.

## Known constraints

- `/find` and `/regist` still point to `Home`
- Server auth flow is still incomplete
- `docker-compose.dev.yaml` still does not start the Node server

## Latest validation

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
