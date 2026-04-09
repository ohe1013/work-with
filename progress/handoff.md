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

- Active milestone: `M3`
- Current phase: `M3 in progress`
- Immediate next task:
  Turn `/regist` into a real staged posting flow with clear sectioning, validation, and a pre-submit summary instead of reusing `Home`.

## Recent implementation focus

- M1 is complete.
- M2 is complete.
- M3 has started by separating `/find` from `Home`.
- The mobile bottom-sheet and desktop side-panel now present the same connected discovery surface.
- Home discovery now carries shared loading/empty/error state across the map, panel, and result list.
- The remaining placeholder-feeling exploration copy and detail summaries were replaced with productized home discovery surfaces.
- `/find` now has its own condition-based discovery layout that reuses shared map search execution.

## Files most likely relevant next

- `client/src/routes.tsx`
- `client/src/pages/Find.tsx`
- `client/src/pages`
- `client/src/layout/Header.tsx`
- `client/src/components/common`
- `client/src/components/side-tab`
- `client/src/hooks/map/useMapDiscoverySearch.ts`
- `progress/current.md`

## Recent commits

- `8bb9052` `Complete M2 home discovery polish`
- `2dba558` `Expand M2 discovery state handling`
- `af1f2c1` `Refine M2 discovery surfaces`

## Known working assumptions

- `/regist` still points to `Home`.
- Auth is still incomplete and out of scope unless the active milestone moves there.
- `work-with-codex-setup.patch` is currently untracked in the repo root; ignore it unless the user explicitly asks about it.
- Browserslist still warns that `caniuse-lite` is outdated, but that is non-blocking for current milestone work.

## Update checklist for future turns

- Refresh the active milestone / Immediate next task summary if it changed.
- Replace the “Recent implementation focus” bullets when the center of gravity moves.
- Update the “Files most likely relevant next” list if the hot path changes.
- Append or rotate the latest commit hashes if a meaningful checkpoint was committed.
