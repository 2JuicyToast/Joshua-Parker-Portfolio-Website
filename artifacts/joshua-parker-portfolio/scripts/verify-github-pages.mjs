import assert from 'node:assert/strict';
import { access, readFile, stat } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(packageDir, '..', 'dist', 'public');
const rawBase = process.env.GITHUB_PAGES_BASE || '/Joshua-Parker-Portfolio-Website/';
if (!rawBase.startsWith('/')) {
  throw new Error(`GITHUB_PAGES_BASE must begin with "/"; received "${rawBase}".`);
}
const base = `/${rawBase.replace(/^\/+|\/+$/g, '')}${rawBase.replace(/^\/+|\/+$/g, '') ? '/' : ''}`;

const html = await readFile(resolve(outputDir, 'index.html'), 'utf8');
const fallback = await readFile(resolve(outputDir, '404.html'), 'utf8');
assert.equal(fallback, html, '404.html must match index.html to support direct page reloads.');
assert.match(html, /<div id="root"><\/div>/, 'The published page must contain the React application root.');
assert.match(html, /Joshua D\. Parker/, 'The published page title must identify the portfolio, not the repository landing page.');
assert.doesNotMatch(html, /Jekyll|github-pages-build/, 'The output must not be a generated Jekyll landing page.');

const noJekyllPath = resolve(outputDir, '.nojekyll');
await access(noJekyllPath);

const contentFilePath = resolve(outputDir, 'portfolio-content.json');
const contentFile = await readFile(contentFilePath, 'utf8');
assert.ok(Buffer.byteLength(contentFile) <= 1_000_000, 'Published portfolio content must stay under 1 MB.');
const contentFileData = JSON.parse(contentFile);
if (contentFileData !== null) {
  assert.ok(
    contentFileData &&
      typeof contentFileData === 'object' &&
      contentFileData.portfolio &&
      contentFileData.portfolio.identity &&
      contentFileData.portfolio.pages &&
      Array.isArray(contentFileData.writingSections),
    'Published portfolio content must contain portfolio identity/pages and writing sections.',
  );
}

const resources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path.startsWith(base) && path !== base);
const assetResources = resources.filter((path) => path.includes('/assets/'));
assert.ok(assetResources.some((path) => path.endsWith('.js')), 'The HTML must reference a JavaScript bundle under the configured Pages base.');
assert.ok(assetResources.some((path) => path.endsWith('.css')), 'The HTML must reference a CSS bundle under the configured Pages base.');

for (const resource of resources) {
  const relativePath = decodeURIComponent(resource.slice(base.length).split(/[?#]/, 1)[0]);
  const assetPath = resolve(outputDir, relativePath);
  assert.ok(assetPath.startsWith(`${outputDir}${sep}`), `Asset path must stay inside the published directory: ${resource}`);
  const assetInfo = await stat(assetPath);
  assert.ok(assetInfo.isFile() && assetInfo.size > 0, `Published asset is missing or empty: ${resource}`);
}

const iconPath = resolve(outputDir, 'parker-monogram.png');
const icon = await readFile(iconPath);
assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'The portfolio icon must be a valid PNG.');
assert.ok(icon.length < 250_000, 'The portfolio icon should stay optimized for browser loading.');
assert.ok(html.includes(`${base}parker-monogram.png`), 'The HTML must reference the portfolio icon under the configured Pages base.');

console.log(`GitHub Pages artifact verified at base path "${base}".`);
console.log(`Checked ${assetResources.length} bundled assets, portfolio content JSON, the PNG icon, .nojekyll, and the direct-route fallback.`);
