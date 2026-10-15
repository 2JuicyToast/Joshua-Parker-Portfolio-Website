# Joshua D. Parker Portfolio

A personal portfolio showcasing projects, writing, ventures, recognition, interests, and contact information.

## Run & Operate

- Install dependencies with `pnpm install --frozen-lockfile` from the repository root.
- Start the managed workflow `artifacts/joshua-parker-portfolio: web` to run the portfolio at `/`. Its artifact configuration supplies `PORT=21915` and `BASE_PATH=/`; do not run Vite without these values.
- Start `artifacts/api-server: API Server` for the Express service on port 8080, routed under `/api`. Check it through `/api/healthz`.
- The optional `artifacts/mockup-sandbox: Component Preview Server` workflow serves the existing design sandbox at `/__mockup`. It is not required to run the portfolio.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- No secrets or external services are needed for the current portfolio or API health endpoint. `DATABASE_URL` is required only if adding features that import the existing database library; no database is currently used by these running services.

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS 4, Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/joshua-parker-portfolio/src/` — portfolio pages, components, and styles
- `artifacts/joshua-parker-portfolio/src/content.ts` — portfolio text and contact fields
- `artifacts/api-server/src/` — Express service and health endpoint
- `artifacts/mockup-sandbox/` — optional component preview sandbox
- `lib/` — shared API specification, generated clients/validators, and unused database scaffold
- Each artifact's `.replit-artifact/artifact.toml` defines its managed workflow, routing, and production settings.

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

Separate pages for Home, Projects, Current Ventures, Writing, Awards & Recognition, Activities & Interests, and Contact Me. The imported portrait and contact placeholders are intentionally preserved.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
