# Joshua D. Parker Portfolio

A personal portfolio showcasing projects, writing, ventures, recognition, interests, and contact information.

## Run & Operate

- **Quick preview for agents:** start the managed workflow `artifacts/joshua-parker-portfolio: web`. This opens the portfolio at `/` with its images and animations; the API server, GitHub OAuth, and dependency installation are not needed just to preview it.
- Install dependencies with `pnpm install --frozen-lockfile` from the repository root.
- Start the managed workflow `artifacts/joshua-parker-portfolio: web` to open the portfolio at `/`. It supplies `PORT` and `BASE_PATH`; Vite also has safe defaults for local builds.
- For a manual start, run `pnpm --filter @workspace/joshua-parker-portfolio run dev`.
- In Developer mode, start both `artifacts/api-server: API Server` and `artifacts/joshua-parker-portfolio: web`. The editor signs into GitHub as `2JuicyToast`; **Publish changes** commits `artifacts/joshua-parker-portfolio/public/portfolio-content.json` to `main`, which triggers the Viewer build. Configure `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` as Replit Secrets; the callback URL is the Replit development domain plus `/api/portfolio/publisher/callback`.
- GitHub Pages must use **Settings → Pages → Build and deployment → Source → Deploy from a branch**, then select **gh-pages** and **/(root)**. The workflow publishes the built Viewer files directly to the root of `gh-pages`; it checks that `index.html` and `assets/` are present and that no README or other files can replace the Viewer. Do not select `main` or the GitHub Actions source for this branch-publishing workflow.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/joshua-parker-portfolio run build:github-pages` — build the GitHub Pages Viewer version, including a nested-route fallback.
- `pnpm --filter @workspace/joshua-parker-portfolio run verify:github-pages` — verify base-path asset URLs, public content JSON, icon, Jekyll bypass, and route fallback.
- Pushing or merging changes to `main` runs `.github/workflows/deploy-github-pages.yml`; it builds the Viewer and publishes it to `gh-pages`. GitHub Pages then serves that branch. Keep publisher runs serialized (`cancel-in-progress: false`): cancelling a run cannot cancel GitHub's separate in-progress Pages deployment, and the next branch update can be rejected until that deployment finishes.
- A Node.js 20 deprecation warning for `actions/upload-artifact@v4` comes from GitHub's managed Pages publishing path, not an action version pinned in this repository. It is informational; this repository's own build uses Node.js 24. To control the Pages action versions, migrate the repository's Pages source from **Deploy from a branch** to **GitHub Actions** and use a repository-managed Pages artifact/deployment workflow; that also requires changing the Pages setting in GitHub.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- GitHub OAuth client ID and secret are required for editor auto-publishing. `SESSION_SECRET` protects the server-side session. No database is used; `DATABASE_URL` is required only if adding features that import the existing database library.

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
