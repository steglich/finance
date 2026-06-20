# Finance Application

A personal finance application built as a monorepo with:

- **Backend:** Express 5, TypeScript 6, Prisma 5, Zod 3 (`finance-back/`)
- **Frontend:** Angular 22, Tailwind CSS v4, Vitest (`finance-front/`)

## Quick Start

```bash
# Backend
cd finance-back
npm run db:migrate --name init
npm run dev

# Frontend
cd finance-front
npm run start
```

## Development

See [CLAUDE.md](./CLAUDE.md) for development commands, architecture overview, and Angular 22 gotchas.
