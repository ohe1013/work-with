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

- Active milestone: `M2`
- Current phase: `M2 in progress`
- Immediate next task:
  Remove the remaining discovery placeholders in the home exploration flow so M2 feels productized beyond state handling and connected selection.

## Recent implementation focus

- M1 is complete.
- M2 work has started by connecting map selection, list selection, and panel detail flow.
- The mobile bottom-sheet and desktop side-panel now present the same connected discovery surface.
- Home discovery now carries shared loading/empty/error state across the map, panel, and result list.
- Home is still the active map-first entry point.

## Files most likely relevant next

- `client/src/components/side-tab/SideTab.tsx`
- `client/src/components/side-tab/search/SearchTab.tsx`
- `client/src/components/side-tab/search/SearchList.tsx`
- `client/src/components/map/BaseMap.tsx`
- `client/src/pages/Home.tsx`
- `client/src/components/common/Card.tsx`
- `client/src/recoil/map/index.ts`
- `progress/current.md`

## Recent commits

- `af1f2c1` `Refine M2 discovery surfaces`
- `7246945` `Start M2 connected discovery flow`
- `d9b4f8e` `Complete M1 map discovery polish`

## Known working assumptions

- `/find` and `/regist` still point to `Home`.
- Auth is still incomplete and out of scope unless the active milestone moves there.
- `work-with-codex-setup.patch` is currently untracked in the repo root; ignore it unless the user explicitly asks about it.
- Browserslist still warns that `caniuse-lite` is outdated, but that is non-blocking for current milestone work.

## Update checklist for future turns

- Refresh the active milestone / Immediate next task summary if it changed.
- Replace the “Recent implementation focus” bullets when the center of gravity moves.
- Update the “Files most likely relevant next” list if the hot path changes.
- Append or rotate the latest commit hashes if a meaningful checkpoint was committed.
