# Session Handoff

Last updated: 2026-04-09

## Purpose

- Use this file as a compact restart brief for new Codex sessions.
- `progress/current.md` is still the source of truth for milestone state, validation history, and next-task ordering.
- When the active milestone, immediate next task, or recently touched files change in a meaningful way, update this file together with `progress/current.md`.

## Read after `progress/current.md`

1. Confirm the active milestone and Immediate next task in `progress/current.md`.
2. Use this file to recover the latest implementation context, touched areas, and handoff notes faster.
3. If this file conflicts with `progress/current.md`, follow `progress/current.md` and then fix this file.

## Current handoff snapshot

- Active milestone: `M5`
- Current phase: `M5 ready to start`
- Immediate next task:
  Start M5 by auditing the current product against `docs/acceptance-checklist.md` and closing the highest-signal polish gaps in copy, state UI, and flow finish.

## Recent implementation focus

- M1 is complete.
- M2 is complete.
- M3 is complete.
- M4 is complete.
- `docs/api-contracts.md` now documents the current implemented search, auth, and work-with request-response shapes.
- Client auth uses a shared typed session shape, one storage key, and user-visible login failure handling.
- Work-with detail cards and the `/regist` flow use explicit API contracts instead of client-side mock JSON.
- Server exposes `/api/login`, `GET /api/work-with/locations/:locationId`, and `POST /api/work-with` with demo in-memory persistence.

## Files most likely relevant next

- `docs/acceptance-checklist.md`
- `client/src/pages/Home.tsx`
- `client/src/pages/Find.tsx`
- `client/src/pages/Regist.tsx`
- `client/src/pages/Login.tsx`
- `client/src/components`
- `README.md`
- `progress/current.md`

## Recent commits

- `d6900bd` `Replace mocked work-with contracts`
- `30e3621` `Align M4 auth login contract`
- `356a7f9` `Split regist route into real page`

## Known working assumptions

- Auth now has a stable demo login contract, but it still relies on fixed development credentials rather than persisted user storage.
- Work-with registration/detail now use explicit API contracts, but the storage is still in-memory and resets when the Node server restarts.
- `work-with-codex-setup.patch` is currently untracked in the repo root; ignore it unless the user explicitly asks about it.
- Browserslist still warns that `caniuse-lite` is outdated, but that is non-blocking for current milestone work.

## Update checklist for future turns

- Refresh the active milestone / Immediate next task summary if it changed.
- Replace the `Recent implementation focus` bullets when the center of gravity moves.
- Update the `Files most likely relevant next` list if the hot path changes.
- Append or rotate the latest commit hashes if a meaningful checkpoint was committed.
