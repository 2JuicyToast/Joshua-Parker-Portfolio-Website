import assert from 'node:assert/strict';
import { access, readFile, readdir, stat } from 'node:fs/promises';
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

const rootEntries = (await readdir(outputDir)).sort();
assert.deepEqual(
  rootEntries,
  ['.nojekyll', '404.html', 'assets', 'index.html', 'robots.txt', 'script.js', 'styles.css'].sort(),
  'The published branch must contain only the flat Viewer site files, route fallback, and website support files.',
);

const noJekyllPath = resolve(outputDir, '.nojekyll');
await access(noJekyllPath);

const contentFilePath = resolve(outputDir, 'assets', 'portfolio-content.json');
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

const pitchDeckPath = resolve(outputDir, 'assets', 'safelink-beacon-smash-national-pitch-deck.pdf');
const pitchDeck = await readFile(pitchDeckPath);
assert.ok(pitchDeck.subarray(0, 5).equals(Buffer.from('%PDF-')), 'The published SafeLink pitch deck must be a valid PDF.');

const resources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((path) => path.startsWith(base) && path !== base);
const jsResource = resources.find((path) => /^script\.js(?:\?|$)/.test(path.slice(base.length)));
const cssResource = resources.find((path) => /^styles\.css(?:\?|$)/.test(path.slice(base.length)));
assert.ok(jsResource, 'The HTML must reference root-level script.js under the configured Pages base.');
assert.ok(cssResource, 'The HTML must reference root-level styles.css under the configured Pages base.');

for (const resource of resources) {
  const relativePath = decodeURIComponent(resource.slice(base.length).split(/[?#]/, 1)[0]);
  const assetPath = resolve(outputDir, relativePath);
  assert.ok(assetPath.startsWith(`${outputDir}${sep}`), `Asset path must stay inside the published directory: ${resource}`);
  const assetInfo = await stat(assetPath);
  assert.ok(assetInfo.isFile() && assetInfo.size > 0, `Published asset is missing or empty: ${resource}`);
}

for (const filename of [
  'lacrosse-stick-doodle.png',
  'hema-sword-doodle.png',
  'joshua-parker.jpg',
  'writing-quill-book.png',
]) {
  const mediaPath = resolve(outputDir, 'assets', filename);
  const mediaInfo = await stat(mediaPath);
  assert.ok(mediaInfo.isFile() && mediaInfo.size > 0, `Published portfolio image is missing or empty: ${filename}`);
}

const css = await readFile(resolve(outputDir, 'styles.css'), 'utf8');
assert.match(css, /decor-lacrosse/, 'The published stylesheet must include the lacrosse decoration.');
assert.match(css, /decor-swords/, 'The published stylesheet must include the HEMA sword decoration.');
assert.match(css, /global-cursor-shadow/, 'The published stylesheet must include the cursor effect.');
assert.match(css, /\.global-cursor-shadow\{[^}]*width:120px/, 'The published cursor glow must use the smaller size.');
assert.match(css, /ambient-smoke-orb/, 'The published stylesheet must include the full-page smoke orbs.');
assert.match(css, /@keyframes smoke-orb-float/, 'The published smoke orbs must include their floating animation.');
assert.match(css, /project-pitch-deck/, 'The published stylesheet must include the visible pitch deck preview.');
assert.match(css, /@keyframes atmosphere-drift/, 'The published stylesheet must include the moving smoky background.');
assert.match(css, /@keyframes sport-float/, 'The published stylesheet must include the sports decoration animation.');
assert.match(css, /@keyframes smoke-drift/, 'The published stylesheet must include the smoke animation.');

const js = await readFile(resolve(outputDir, 'script.js'), 'utf8');
assert.ok(
  js.includes('https://github.com/2JuicyToast'),
  'The published portfolio must link to the owner’s GitHub profile.',
);
assert.ok(
  js.includes('jdparker2027@gmail.com'),
  'The published contact card must include the requested email address.',
);
assert.match(js, /global-cursor-shadow/, 'The production bundle must include the cursor effect.');
assert.ok(js.includes('project-pitch-deck'), 'The production bundle must render the pitch deck directly on the Projects page.');
assert.ok(js.includes('SMASH National Pitch Deck'), 'The production bundle must include the visible SafeLink deck heading.');
assert.ok(js.includes('safelink-beacon-smash-national-pitch-deck.pdf'), 'The production bundle must reference the SafeLink PDF.');
for (const filename of ['writing-quill-book.png', 'lacrosse-stick-doodle.png', 'hema-sword-doodle.png']) {
  assert.ok(js.includes(filename), `The production bundle must reference the ${filename} decoration.`);
}

const iconPath = resolve(outputDir, 'assets', 'parker-monogram.png');
const icon = await readFile(iconPath);
assert.deepEqual([...icon.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'The portfolio icon must be a valid PNG.');
assert.ok(icon.length < 250_000, 'The portfolio icon should stay optimized for browser loading.');
assert.ok(html.includes(`${base}assets/parker-monogram.png`), 'The HTML must reference the portfolio icon under assets/.');

console.log(`GitHub Pages artifact verified at base path "${base}".`);
console.log('Checked the flat file structure, portfolio images and animations, content JSON, the PNG icon, .nojekyll, and the direct-route fallback.');
