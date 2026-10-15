# Joshua D. Parker Portfolio

**Open the live portfolio (Viewer mode):** <https://2JuicyToast.github.io/Joshua-Parker-Portfolio-Website/>

The GitHub repository page shows this README; use the Pages link above to view the website.

The portfolio runs as a live development preview in Replit and publishes as a static Viewer site on GitHub Pages.

## Developer mode (Replit)

1. Run `pnpm install --frozen-lockfile` from the repository root.
2. Start the managed workflows `artifacts/api-server: API Server` and `artifacts/joshua-parker-portfolio: web`.
3. Click **Developer mode · Edit** in the preview. Sign in with the GitHub account `2JuicyToast`, edit the content, and click **Publish changes**. This commits the public content file to `main`; the Pages workflow builds and deploys the Viewer.
4. The editor keeps a browser copy of successfully published changes and still offers **Download Viewer content** as a manual backup. Do not put passwords or private information in the public content file.

### Configure automatic editor publishing

Create a GitHub OAuth App for the Replit development preview:

- Homepage URL: `https://efe9ae6e-b90a-4f71-9f15-3ee5434187bd-00-rc14bmqerfzp.riker.replit.dev/`
- Authorization callback URL: `https://efe9ae6e-b90a-4f71-9f15-3ee5434187bd-00-rc14bmqerfzp.riker.replit.dev/api/portfolio/publisher/callback`

Add the OAuth App's **Client ID** as `GITHUB_OAUTH_CLIENT_ID` and its **Client secret** as `GITHUB_OAUTH_CLIENT_SECRET` in Replit Secrets. The server requests the `public_repo` scope and only accepts the GitHub account `2JuicyToast`. The GitHub token stays in a server-side session; it is never sent to browser code.

To start the development server manually:

```sh
pnpm --filter @workspace/joshua-parker-portfolio run dev
```

## Viewer mode (GitHub Pages)

The GitHub Actions workflow builds and publishes the static Viewer after each push or merge to `main`. It also supports manual runs from the Actions tab. The published build supports the repository's `/Joshua-Parker-Portfolio-Website/` path and direct page reloads.

Set repository **Settings → Pages → Build and deployment → Source** to **GitHub Actions** before publishing. The expected project-site URL is:

<https://2JuicyToast.github.io/Joshua-Parker-Portfolio-Website/>

Source-controlled changes made in Replit appear on GitHub Pages after they are pushed or merged to `main` and the deployment workflow finishes. Editor-published changes commit `public/portfolio-content.json` directly to `main`, which triggers the same workflow.

To build the Viewer site locally:

```sh
pnpm --filter @workspace/joshua-parker-portfolio run build:github-pages
pnpm --filter @workspace/joshua-parker-portfolio run verify:github-pages
```

For a custom domain or user-site deployment at the domain root, set `GITHUB_PAGES_BASE=/` for that build.
