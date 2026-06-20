# Finance Application

Monorepo contendo dois projetos independentes:

- **`finance-front/`** — Aplicação Angular 22 responsável por toda a camada visual (interface do usuário, componentes, rotas, temas)
- **`finance-back/`** — API em Node.js com TypeScript responsável por toda a infraestrutura de backend (endpoints REST, regras de negócio, autenticação, comunicação com banco de dados via Prisma)

## Stack

| Projeto | Tecnologias |
|---------|-------------|
| `finance-front/` | Angular 22, Tailwind CSS v4, Vitest |
| `finance-back/` | Express 5, TypeScript 6, Prisma 5, Zod 3 |

## Quick Start

Cada projeto é independente e deve ser executado a partir do seu próprio diretório:

```bash
# Backend — execute a partir de finance-back/
cd finance-back
npm install
npm run db:migrate --name init
npm run dev                 # sobe em http://localhost:3000

# Frontend — execute a partir de finance-front/
cd finance-front
npm install
npm run start               # sobe em http://localhost:4200
```

## Development

See [CLAUDE.md](./CLAUDE.md) for development commands, architecture overview, and Angular 22 gotchas.
