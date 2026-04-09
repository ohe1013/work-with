# work-with

Map-first product for finding and posting workout-partner opportunities.

Demo: [Vite + React + TS](https://work-with-lemon.vercel.app/)

The current hosted deployment is client-only on `vercel`.

## Product direction

- Keep the map as the primary discovery surface.
- Help people find nearby workout partners without turning the product into a social feed.
- Preserve lightweight, low-pressure interactions.
- Improve trust, clarity, and responsiveness without changing the product thesis.

## Current status

- `Home` is the current map-first entry page and renders `BaseMap`.
- `/find` and `/regist` are routed, but they still reuse `Home`.
- The backend already exposes a Kakao search proxy endpoint.
- Auth-related backend work is still incomplete.

## Tech stack

- Frontend: `Vite`, `React`, `TypeScript`, `Recoil`, `Tailwind CSS`, `axios`, `react-kakao-maps-sdk`
- Backend: `Express`, `TypeScript`, `postgres`
- Tooling: `ESLint`, `Jest`, `concurrently`

## Local development

### Install

```bash
yarn
yarn --cwd client
yarn --cwd server
```

### Recommended workflow

```bash
yarn start
```

- `yarn start` runs the client and server together from the repository root.
- `yarn client` starts only the frontend dev server.
- `yarn server` starts only the backend dev server.

### Validation

```bash
yarn run check
```

Individual validation commands:

- `yarn client:lint`
- `yarn client:build`
- `yarn client:test`
- `yarn server:build`

## Docker Compose note

`docker-compose.dev.yaml` does not mirror the full root dev workflow.

- It currently manages `postgres` and the `client` container.
- It does not start the Node server.
- If you use Docker Compose for local infrastructure, run the backend separately with `yarn --cwd server dev`.

Example:

```bash
docker compose -f docker-compose.dev.yaml up --build postgres client
```

## Project references

- [AGENTS.md](./AGENTS.md)
- [docs/product-invariants.md](./docs/product-invariants.md)
- [docs/toss-inspired-ui-spec.md](./docs/toss-inspired-ui-spec.md)
- [docs/user-flows.md](./docs/user-flows.md)
- [docs/milestones.md](./docs/milestones.md)
- [progress/current.md](./progress/current.md)
