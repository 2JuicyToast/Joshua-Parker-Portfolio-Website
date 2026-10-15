# Joshua D. Parker Portfolio

The portfolio runs as a live development preview in Replit and publishes as a static Viewer site on GitHub Pages.

## Developer mode (Replit)

1. Run `pnpm install --frozen-lockfile` from the repository root.
2. Start the managed Replit workflow `artifacts/joshua-parker-portfolio: web`.
3. Edit portfolio copy in `artifacts/joshua-parker-portfolio/src/content.ts`; the development preview refreshes as files are saved.
4. Or click **Developer mode · Edit** in the preview to edit content and add cards. **Save changes** stores edits in that browser's local storage.
5. To publish those edits, click **Download Viewer content** in the editor and replace `artifacts/joshua-parker-portfolio/public/portfolio-content.json` with the downloaded file. Commit and push it to `main`; the Pages workflow will build the Viewer with that content. Do not put passwords or private information in the public content file.

To start the development server manually:

```sh
pnpm --filter @workspace/joshua-parker-portfolio run dev
```

## Viewer mode (GitHub Pages)

The GitHub Actions workflow builds and publishes the Viewer site after each push or merge to `main`. It also supports manual runs from the Actions tab. The published static build supports the repository's `/Joshua-Parker-Portfolio-Website/` path and direct page reloads.

Set the repository's **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The deployment workflow checks that setting and the built Viewer before publishing; a branch/Jekyll deployment can succeed while publishing the wrong page. The expected project-site URL is:

<https://2JuicyToast.github.io/Joshua-Parker-Portfolio-Website/>

Source-controlled changes made in Replit appear on GitHub Pages after they are pushed or merged to `main` and the deployment workflow finishes successfully. Browser-saved edits are exported through `public/portfolio-content.json` before publishing.

To build the Viewer site locally:

```sh
pnpm --filter @workspace/joshua-parker-portfolio run build:github-pages
pnpm --filter @workspace/joshua-parker-portfolio run verify:github-pages
```

For a custom domain or user-site deployment at the domain root, set `GITHUB_PAGES_BASE=/` for that build.
