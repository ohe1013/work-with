# Frontend AGENTS.md

## Scope
This file governs all work inside `client/`.

## Current frontend facts
- `Home` currently renders `BaseMap` and acts as the practical product entry point.
- The layout includes a left navigation rail and a `SideTab`.
- `SideTab` currently renders `SearchTab` only when `path === "/"`.
- `/find` and `/regist` are routed, but they still point to `Home`.
- `Login` exists as a separate page and already uses shared form primitives and auth hooks.

## Frontend priorities
- Preserve map-first discovery.
- Make the product feel mobile-native first, then adapt it cleanly to desktop web.
- Reduce visual fragmentation and placeholder behavior.
- Introduce a coherent design system before doing page-by-page polish.
- Convert route placeholders into real product flows in milestone order.

## Frontend implementation rules
- Prefer Tailwind for new view-layer work.
- Keep React Router structure understandable; do not create deeply nested route complexity unless needed.
- Keep Recoil state minimal and explicit.
- Prefer typed UI models and view models over ad-hoc object access.
- Reuse `components/common` primitives when building forms, cards, bottom sheets, filters, and CTA sections.
- Avoid mixing multiple styling approaches inside a single new feature.
- New responsive behavior must be verified at approximately 390px and 1440px widths.

## UX rules
- Home should remain the fastest path to discovering nearby workout opportunities.
- Search and filter must remain visible or one gesture away.
- Registration flow must feel lightweight and trustworthy.
- Find flow must help users decide quickly, not browse endlessly.
- Empty, loading, and error states are required for every active flow.

## Frontend validation
- `yarn --cwd client lint`
- `yarn --cwd client build`
- `yarn --cwd client test`

## Done means
- The active screen works on mobile and desktop.
- Shared primitives are used consistently.
- No active milestone page is still a disguised `Home` placeholder.
