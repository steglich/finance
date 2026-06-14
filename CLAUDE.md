# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo for a personal finance application. Development is **spec-driven**: the `specs/` directory contains markdown specification files that define exact implementation details for all features.

## Subprojects

| Directory | Stack | Description |
|-----------|-------|-------------|
| `finance-back/` | Express 5, TypeScript 6, Prisma 5, Zod 3 | Modular monolith REST API |
| `finance-front/` | Angular 22, Tailwind CSS v4, Vitest | SPA frontend |

## Common Commands

### Backend (`finance-back/`)
```bash
npm run dev            # Start dev server with hot reload (port 3000)
npm run build          # TypeScript compilation
npm run db:migrate     # Create and apply Prisma migrations (--name <name>)
npm run db:generate    # Regenerate Prisma client types
npm run db:studio      # Open Prisma Studio GUI (port 5555)
```

**Prisma migration workflow:** The first migration hasn't been created yet. Run `npx prisma migrate dev --name init` to create the initial migration. Subsequent migrations use `npm run db:migrate --name <name>`. Migrations must be run before `npm run dev` — the server won't start without a valid database.

### Frontend (`finance-front/`)
```bash
npm run start          # Angular dev server (port 4200, binds to 0.0.0.0 — accessible via LAN)
npm run build          # Production build
npm test               # Run unit tests (Vitest)
```

## Architecture: Backend

**Modular monolith** pattern. Each business domain lives in `src/modules/<name>/` and encapsulates its own routes, controllers, services, repositories, and Zod schemas. The `src/core/` layer provides shared infrastructure:

- **`core/config/env.ts`** — Zod-validated environment variables (fails fast on missing `DATABASE_URL`)
- **`core/database/client.ts`** — Prisma singleton (avoids connection exhaustion on hot reload)
- **`core/errors/`** — `AppError` base class (statusCode, errorCode, isOperational) and `handlePrismaError()` for translating Prisma error codes to `AppError`
- **`core/middlewares/`** — Global error handler, Zod-based request validator (`validateRequest`), auth placeholder

**Module conventions:**
- Controllers handle HTTP only (parse request, call service, send response). Business logic lives in services.
- `repository.ts` uses Prisma directly; errors are caught and re-thrown via `handlePrismaError()`
- All modules must respond with `{ success: true, data: ... }` or `{ success: false, error: ... }`
- Cross-module imports between `modules/` directories are forbidden — use dependency injection or shared core services

**Current modules:** `transactions` (CRUD with Prisma-persisted Transaction model).

## Architecture: Frontend

When working on the frontend, use the **Angular MCP** (Model Context Protocol) tool for component generation, schematics, and Angular-specific operations. Always follow **Angular 22** conventions: standalone components, signal-based state, lazy-loaded routes, and Vite-based dev server.

Angular 22 with **standalone components** and lazy-loaded routes. Tailwind CSS v4 uses CSS-first configuration (no `tailwind.config.js`).

- **Theme tokens** defined in `src/styles.css` via `@theme {}` block. Never use hex colors or raw RGB in component templates — always use semantic Tailwind classes (`bg-primary`, `text-neutral-light-text`, `dark:text-neutral-dark-text`).
- **Dark mode** activated by `.dark` class on `<body>` via `@custom-variant dark (&:where(.dark, .dark *))`. Components use `dark:` prefix classes.
- **Component rules:** Mobile-first, `rounded-full` for buttons/inputs, `rounded-2xl`/`rounded-3xl` for cards. Form states: `info` (focus), `success` (valid), `error` (invalid), `disabled` (opacity + cursor).
- **Dev server:** Vite-based (Angular 22). The dev server must be restarted (`npm run start`) to pick up newly created source files.
- **Testing:** Vitest via `ng test`.

**Current routes:** `/` and `/**` redirect to `/login` (lazy-loaded `LoginComponent`). The root template contains only `<router-outlet />`.

## Spec-Driven Workflow

All features are specified as markdown files in `specs/`. Before implementing, read the relevant spec file — it contains exact code, file paths, and verification steps. Current specs:

| Spec | What it defines |
|------|----------------|
| `base-api-modular-config.md` | Backend module structure, core boilerplate, response format |
| `prisma-database-config.md` | Prisma setup, schema, repository pattern, error handling |
| `frontend-design-system-spec.md` | Design tokens, Tailwind theme, login page implementation |
| `theme-switching-spec.md` | Dark mode fix via `@custom-variant` |
| `gitignore-config.md` | Gitignore rules for root and subprojects |

## Version Constraints

- **zod@3** (not v4) — The spec boilerplate uses zod v3 APIs (`AnyZodObject`, `ZodError.errors`). zod@4 breaks compilation. Pinned at `^3.25.76`.
- **Prisma@5** (not v7) — `@prisma/client` and `prisma` pinned at `^5.22.0`. Prisma v7 has breaking changes: generator renamed to `prisma-client`, datasource URL moved to `prisma.config.ts`, `PrismaClient` requires `adapter` or `accelerateUrl`. Do not upgrade without updating all Prisma-related code.
- Node.js CommonJS mode (`"type": "commonjs"` in finance-back)
- **Node.js v26.3.0** — managed via nvm (`/home/marlon/.nvm/versions/node/v26.3.0/`)

## Memory System

This project has persistent memory files at `/home/marlon/.openclaude/projects/-home-marlon-projetos-finance/memory/` (private) and `.../memory/team/` (team-shared). Load `MEMORY.md` from both directories at session start to pick up ongoing project context, version pinning, and user preferences.

- **Direct execution:** When given a spec file or clear instructions, implement directly — create files, install deps, done. Skip task tracking, skip build verification unless the spec explicitly asks for it.
- **Specs are authoritative:** Spec files contain exact code, file paths, and verification steps. Read the spec and implement what it says.
- **Angular new-file restart:** The Vite-based Angular dev server handles compilation internally (no separate `ng build` step needed). It caches its module graph at startup, so after creating new files in `finance-front/src/`, restart `npm run start` — the dev server won't resolve files that didn't exist when it started. File modifications to existing files are picked up fine.
- **No hex colors in templates:** Use only semantic Tailwind class names from the theme tokens defined in `styles.css`.
