# Joshua D. Parker Portfolio

A personal portfolio showcasing projects, writing, ventures, recognition, interests, and contact information.

## Run & Operate

- Install dependencies with `pnpm install --frozen-lockfile` from the repository root.
- Start the managed workflow `artifacts/joshua-parker-portfolio: web` to open the portfolio at `/`. It supplies `PORT` and `BASE_PATH`; Vite also has safe defaults for local builds.
- For a manual start, run `pnpm --filter @workspace/joshua-parker-portfolio run dev`.
- In Developer mode, click **Developer mode · Edit** to edit portfolio text and add cards. **Save changes** persists edits in the current browser only; the published Viewer continues to use source-controlled content.
- The portfolio is frontend-only. The API server and mockup sandbox are not required to run or publish it.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/joshua-parker-portfolio run build:github-pages` — build the GitHub Pages Viewer version, including a nested-route fallback.
- `pnpm --filter @workspace/joshua-parker-portfolio run verify:github-pages` — verify base-path asset URLs, the icon, Jekyll bypass, and route fallback in the built Viewer.
- Pushing or merging changes to `main` runs `.github/workflows/deploy-github-pages.yml`; the workflow checks that GitHub Pages **Settings → Pages → Build and deployment → Source** is **GitHub Actions** and validates the Viewer files before deploying. A branch/Jekyll deployment can report success while publishing the wrong page.
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
- Writing PDFs go in `artifacts/joshua-parker-portfolio/public/writing/`; add each title and filename to its category in `writingSections` in `src/content.ts`.
- `artifacts/api-server/src/` — Express service and health endpoint
- `artifacts/mockup-sandbox/` — optional component preview sandbox
- `lib/` — shared API specification, generated clients/validators, and unused database scaffold
- Each artifact's `.replit-artifact/artifact.toml` defines its managed workflow, routing, and production settings.

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

Separate pages for Home, Projects, Current Ventures, Writing, Awards & Recognition, Activities & Interests, and Contact Me. The imported portrait and contact placeholders are intentionally preserved.

## Developer and Viewer modes

- **Developer mode** runs in Vite development mode in Replit. Edit `artifacts/joshua-parker-portfolio/src/content.ts` for portfolio copy; changes appear in the preview as they are saved.
- **Viewer mode** is the optimized static build published by GitHub Pages. It updates after changes are pushed or merged to the repository's `main` branch and the Pages workflow succeeds; unpushed Replit edits are not published.
- GitHub Pages uses the repository path `/Joshua-Parker-Portfolio-Website/` by default. Set `GITHUB_PAGES_BASE=/` for a root-domain Pages site or custom domain.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
