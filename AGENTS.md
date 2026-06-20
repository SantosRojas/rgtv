# RGTV — Agent Instructions

## First read

Read `ARCHITECTURE.md` — it is the single source of truth (DDD, Atomic Design, state, styles, etc.). This file only adds what ARCHITECTURE.md does not cover.

## Project state

Early scaffold. `src/` still contains Vite boilerplate (`App.tsx`, `App.css`, `index.css`). No app code, no stores, no domain logic, no tests. Dependencies listed in ARCHITECTURE.md (Tailwind, Zustand, hls.js, TanStack Query, Vitest) are **not yet installed**.

## Commands

| Action | Command |
|--------|---------|
| dev server | `npm run dev` |
| build | `npm run build` (runs `tsc -b && vite build`) |
| lint | `npm run lint` (ESLint) |
| preview | `npm run preview` |
| test | Not configured. When Vitest is added, do not add without also adding `npm run test` script. |

`npm run build` uses **project references** (`tsc -b` compiles both `tsconfig.app.json` and `tsconfig.node.json`).

## TypeScript quirks (TS 6.0)

- **`verbatimModuleSyntax: true`** — use `import type` for type-only imports.
- **`erasableSyntaxOnly: true`** — no enums, no namespaces, no parameter properties.
- **`noUncheckedIndexedAccess`** / **`exactOptionalPropertyTypes`** are NOT in `tsconfig.app.json` (ARCHITECTURE.md demands them; add if implementing).
- **`moduleDetection: "force"`** — every file is a module; use `export {}` to declare a file as a module if it has no exports.

## Architecture constraints (not obvious from filenames)

- **No backend.** Everything runs client-side. No REST API, no external DB.
- **Global state:** Zustand only. Context API only for themes/dependencies.
- **Styling:** Tailwind CSS (not yet installed). No CSS Modules, no Styled Components.
- **No class components.** Functional components + hooks only.
- **No `any`.** Strict TypeScript always.
- **Components ≤ 300 lines.** Domain logic never inside components.
- **LocalStorage keys:** `rgtv_favorites`, `rgtv_playlists`, `rgtv_settings`, `rgtv_theme`, `rgtv_last_channel`.
- **Fullscreen** on player container, not on `<video>` element.

## Pre-commit quality gate

Before committing: `npm run lint` → (when available) `npm run typecheck` → (when available) `npm run test`. Fix all errors.
