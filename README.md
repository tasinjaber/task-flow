# Task Flow

Task Flow is a professional project and task management workspace built as a TypeScript monorepo.

## Stack
- React + TypeScript + Vite
- Node.js + Express + TypeScript
- Zod API validation
- Vitest
- GitHub Actions

## Workspace
- `apps/web` — responsive project management interface
- `apps/api` — typed REST API with project/task resources

## Run
```bash
npm install
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

## Checks
```bash
npm run lint
npm run test
npm run build
```
