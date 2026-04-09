# AGENTS.md

## Product invariants
- This product is for finding and posting workout-partner opportunities.
- Keep the map-first discovery experience.
- Preserve the lightweight, low-pressure interaction model described in the README.
- Do not pivot into a generic social feed, chat-first community, or fitness tracker product.
- Improve polish, IA, trust, and responsiveness without changing the product thesis.

## Current repo map
- `client/`: Vite + React + TypeScript frontend
- `server/`: Express + TypeScript backend
- `docs/`: product, design, API, and milestone guidance
- `progress/`: current milestone state and decisions
- `prompts/`: reusable Codex prompt templates

## Current implementation facts to respect
- `Home` is currently the map-first entry page and renders `BaseMap`.
- `/find` and `/regist` currently still reuse `Home`; they must eventually become real pages, but the product intent should stay aligned with workout matching.
- The root dev workflow currently starts `client` and `server` together via `concurrently`.
- `docker-compose.dev.yaml` currently helps with Postgres and client, while server development is still handled separately.
- The server currently exposes a Kakao search proxy endpoint and has incomplete auth-related work.

## Source of truth rules
- Edit `.ts` / `.tsx` source files, not generated artifacts.
- Do not introduce a new product direction without updating `docs/product-invariants.md` and `progress/decisions.md`.
- Do not remove the map-first discovery flow to simplify implementation.
- Do not leave placeholder route wiring in the active milestone when a milestone says that flow is complete.
- `progress/current.md` remains the source of truth for milestone state.
- `progress/handoff.md` is a compact session-handoff companion and must stay aligned with `progress/current.md` when work meaningfully shifts.

## UI direction
- Toss-inspired, not copied.
- Mobile-first by default.
- Desktop is an adaptive extension of the same component system, not a separate product.
- Prioritize strong hierarchy, whitespace, readable forms, calm motion, and trust-building UI copy.
- Prefer progressive disclosure over dumping all information at once.

## Styling and component rules
- Prefer Tailwind for new UI work.
- Reuse existing React, Recoil, React Query, and router primitives unless there is a clear reason not to.
- Avoid adding another major UI framework.
- Build shared primitives before page-level variants when touching more than one screen.

## Required reading order for Codex
1. `AGENTS.md`
2. `docs/product-invariants.md`
3. `docs/toss-inspired-ui-spec.md`
4. `docs/user-flows.md`
5. `docs/milestones.md`
6. `progress/current.md`
7. `progress/handoff.md`

## Validation commands
- Root dev: `yarn start`
- Frontend lint: `yarn --cwd client lint`
- Frontend build: `yarn --cwd client build`
- Frontend test: `yarn --cwd client test`
- Backend build: `yarn --cwd server build`

## Done means
- Acceptance criteria for the active milestone are satisfied.
- Relevant checks were run and results were recorded in `progress/current.md`.
- The implementation still preserves the product invariants.
- The next unfinished item is clearly identified in `progress/current.md`.
