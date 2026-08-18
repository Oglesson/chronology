# Chronology

Track tasks in product creation for process effeciency. A React sample project to demonstrate UI code building and not for financial gain. No new features will be added and current features will not be changed in any major way. Maintainance will be minimal and likely be limited for security only i.e. third party library updates when a major issue is seen. Feel free to report any bugs to sophie@oglesson.com anyway!

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.9.0 recommended — use [NVM](https://github.com/nvm-sh/nvm) to manage versions)
- npm ≥ 9

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/Oglesson/chronology.git
    cd chronology
    ```

2. Switch to the required Node version:

    ```bash
    nvm use 18.9.0
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables (see [Environment Variables](#environment-variables) below).

5. Start the development server (HTTPS):

    ```bash
    npm run watch:app
    ```

    The app will be available at `https://localhost:5173` by default.

6. Optionally, start Storybook:
    ```bash
    npm run watch:storybook
    ```
    Storybook will be available at `http://localhost:6006`.

## Environment Variables

Create a `.env.local` file in the project root and populate the following variables. These should be kept separately outside of source control or general access as they are private.

| Variable | Description |
| --- | --- |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `VITE_API_ENDPOINT` | Base URL for the backend API |

> **Note:** Never commit `.env.local` or `.env.production` to version control.

## Available Scripts

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run watch:app`       | Start the Vite dev server with HTTPS |
| `npm run watch:mock`      | Start the Express mock API server    |
| `npm run build:app`       | Build the app for production         |
| `npm run preview`         | Preview the production build locally |
| `npm run watch:storybook` | Start Storybook in dev mode          |
| `npm run build:storybook` | Build Storybook for deployment       |
| `npm run lint`            | Run ESLint                           |
| `npm run lint:fix`        | Run ESLint and auto-fix issues       |
| `npm run prettier`        | Format all files with Prettier       |

## Project Structure

```
src/
  api.common/              # Axios API client and TypeScript types
  authentication.common/   # Auth0 login/logout/profile components
  components.*/            # Reusable UI components (accordion, charts, modals, tables, etc.)
  context.common/          # React context providers (global state, theme, notifications)
  forms.common/            # Shared form inputs and controls
  hooks.*/                 # Custom React hooks (queries, schema validation, common utilities)
  layout.common/           # Page layout shells
  navigation.*/            # Navigation components (tabbed, utility, main)
  plugins.common/          # Storybook plugins and Tailwind extensions
  queries.common/          # TanStack Query definitions
  routes.common/           # React Router route definitions
  screens.*/               # Page-level screen components
mock-server/
  server.js                # Express mock API server for local development (port 8080)
public/
  fonts/                   # Poltab font - used for personal use and not business gain
  icons/                   # SVG icon sets (edit, interface, menu, logos)
  locales/                 # i18next translation files (en, zh, vi)
```

## Tech Stack

| Category              | Technology            |
| --------------------- | --------------------- |
| Framework             | React 19 + TypeScript |
| Build tool            | Vite 7                |
| Routing               | React Router 7        |
| Styling               | Tailwind CSS 3, SCSS  |
| State / Data fetching | TanStack Query 5      |
| Forms                 | React Hook Form + Zod |
| Animation             | Framer Motion         |
| Authentication        | Auth0                 |
| Internationalisation  | i18next               |
| Component explorer    | Storybook 10          |
| Drag and drop         | dnd-kit               |
| Charts                | Recharts              |

## Contributing

1. Create a feature branch from `main` and call it something sensible.
2. Make your changes and ensure `npm run lint` passes.
3. Open a pull request against `main`.

## Things to note

This is a sample project and I have no intention on adding or editing features other then what might currently be broken. That includes upgrading libraries.

As this project was originally written in sass, I have kept tailwind at version 3 as they play better together. This alongside a few other library choice were seen as the best option at the time but may not be the approach I would chose for future projects necessarily
