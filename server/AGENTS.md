# Backend AGENTS.md

## Scope
This file governs all work inside `server/`.

## Current backend facts
- The backend is an Express + TypeScript app.
- Development runs through nodemon and ts-node loader.
- A Kakao search proxy endpoint exists at `GET /kakao/get/search`.
- Auth-related logic is not yet completed and some auth routes are still commented out.
- Local dev orchestration is split: Postgres is handled via Docker Compose, while the Node server is run separately.

## Backend priorities
- Support the existing workout-partner product flows.
- Stabilize contracts before expanding feature count.
- Keep API responses typed and predictable.
- Make auth, posting, and search flows explicit enough for the frontend to build against.

## Backend rules
- Preserve the current Kakao-proxy intent unless a better official search integration is introduced.
- Avoid broad framework rewrites.
- Do not hardcode secrets or environment-specific values.
- Prefer explicit route modules and service layers once the backend grows.
- Add validation before adding complex business logic.
- Keep endpoint naming aligned with `docs/api-contracts.md`.

## Validation
- `yarn --cwd server build`

## Done means
- The endpoint contract for the active milestone is documented.
- The backend build passes.
- Frontend integration assumptions are reflected in `docs/api-contracts.md` or `progress/decisions.md`.
