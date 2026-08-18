# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run watch:app        # Start Vite dev server (https://localhost:5173)
npm run watch:mock       # Start Express mock server (port 8080)
npm run watch:storybook  # Start Storybook (http://localhost:6006)

# Build
npm run build:app
npm run build:storybook
npm run preview          # Preview production build with HTTPS

# Code quality
npm run lint
npm run lint:fix
npm run prettier
```

There is no test runner — the project uses Storybook for component development and a mock server for API development.

## Environment Setup

Copy `.env.template` to `.env.local` and populate:
- `VITE_AUTH0_DOMAIN` — Auth0 tenant domain
- `VITE_AUTH0_CLIENT_ID` — Auth0 client ID
- `VITE_API_URL` — Backend API base URL

## Architecture

**Entry point:** `index.html` mounts on `[data-app]` → `src/main.tsx` → `GlobalContext` → React Router `RouterProvider`

**Provider hierarchy** (`src/context.common/GlobalContext.tsx`):
1. `QueryClientProvider` (TanStack Query, 3-minute stale time)
2. `NavigationProvider` — sidebar/navigation state
3. `ThemeProvider` — dark/light mode via CSS class strategy
4. `NotificationProvider` — toast notifications

**Routing** (`src/routes.common/`): React Router v7 with a root `Layout` component wrapping all routes. Routes map to `screens.*` directories.

**Directory naming convention:** `<domain>.<scope>` — e.g., `components/common/`, `screens.designs/`, `hooks.queries/`, `queries.common/`. Screen directories further nest as `screens.<entity>/<entity>.<view>/`.

**Data fetching:** TanStack Query with 43+ query definitions in `src/queries.common/`. Custom `useFetcher` hook wraps query logic. The mock Express server (`mock-server/server.js`) seeds an in-memory DB with sample data for local development.

**Authentication:** Auth0 via `@auth0/auth0-react`. Token claims accessed via `useIdTokenClaims` hook. Permissions extracted from token and managed via `usePermissions` hook, then threaded through context.

**Forms:** React Hook Form + Zod. Schema hooks live in `src/hooks.schema/`.

**API client** (`src/api.common/index.ts`): Axios-based client. Types are in `src/api.common/types.ts`.

**Storybook** stories use decorators for i18next, React Router, and Auth0 mocking. Dark mode is the default. Locale switching supports English, Chinese, and Vietnamese.
