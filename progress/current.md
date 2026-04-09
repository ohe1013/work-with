# Current Progress

Last updated: 2026-04-09

## Objective

Keep the workout-partner product thesis intact while moving the repo into a milestone-based implementation flow with a map-first, Toss-inspired UI direction.

## Current status

- Phase: Ready for M1 implementation
- Active milestone: M1
- Working mode: milestone-by-milestone

## Completed

- [x] Added Codex operating docs, AGENTS guides, progress docs, and reusable prompts
- [x] Added root validation scripts: `check`, `client:build`, `client:test`, `client:lint`, `server:build`
- [x] Rewrote `README.md` with a local development runbook and Docker Compose scope notes
- [x] Fixed frontend lint, build, and test blockers so the documented validation path now works
- [x] Fixed backend build blockers in `server/src/util/jwt.utils.ts`
- [x] Introduced M1 shared design tokens, shared UI primitives, and an updated app shell in `client`

## Next up

1. [ ] Refine the home/map layout for mobile-first responsiveness
2. [ ] Apply the shared component language more deeply across the map discovery flow
3. [ ] Split `/find` and `/regist` into real pages in milestone order
4. [ ] Continue auth/API contract cleanup after the UI milestone

## Immediate next task

Refine the map-first home experience so the new shell, side panel, and map surface behave more intentionally across mobile and desktop widths.

## Known constraints

- `/find` and `/regist` still point to `Home`
- Server auth flow is still incomplete
- `docker-compose.dev.yaml` still does not start the Node server

## Latest validation

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
