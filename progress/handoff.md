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

- Active milestone: `M4`
- Current phase: `M4 in progress`
- Immediate next task:
  Replace mocked work-with registration/detail data paths with explicit API contracts so the posting flow stops depending on local client test data.

## Recent implementation focus

- M1 is complete.
- M2 is complete.
- M3 is complete.
- M4 has started with a stable demo login contract between the frontend and server.
- Client auth now uses a shared typed session shape, one storage key, and user-visible login failure handling.
- Server now exposes `/api/login` with JSON body parsing plus consistent JWT signing and verification helpers.

## Files most likely relevant next

- `client/src/api/map/workWith/index.ts`
- `client/src/pages/Regist.tsx`
- `client/src/pages/Home.tsx`
- `client/src/service`
- `server/src`
- `docs`
- `progress/current.md`

## Recent commits

- `356a7f9` `Split regist route into real page`
- `680b19b` `Split find route into real page`
- `8bb9052` `Complete M2 home discovery polish`

## Known working assumptions

- Auth now has a stable demo login contract, but it still relies on fixed development credentials rather than persisted user storage.
- Registration success is still local-only and not persisted yet.
- Work-with detail data still comes from client-side test data.
- `work-with-codex-setup.patch` is currently untracked in the repo root; ignore it unless the user explicitly asks about it.
- Browserslist still warns that `caniuse-lite` is outdated, but that is non-blocking for current milestone work.

## Update checklist for future turns

- Refresh the active milestone / Immediate next task summary if it changed.
- Replace the `Recent implementation focus` bullets when the center of gravity moves.
- Update the `Files most likely relevant next` list if the hot path changes.
- Append or rotate the latest commit hashes if a meaningful checkpoint was committed.
