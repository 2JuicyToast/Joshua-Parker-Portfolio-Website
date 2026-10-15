import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(packageDir, '..', 'dist/public');
const bundleDir = resolve(outputDir, 'assets');
const rawBase = process.env.GITHUB_PAGES_BASE || '/Joshua-Parker-Portfolio-Website/';
if (!rawBase.startsWith('/')) {
  throw new Error(`GITHUB_PAGES_BASE must begin with "/"; received "${rawBase}".`);
}
const normalizedBase = rawBase.replace(/^\/+|\/+$/g, '');
const base = normalizedBase ? `/${normalizedBase}/` : '/';

const bundleFiles = await readdir(bundleDir);
const javascriptFiles = bundleFiles.filter((filename) => filename.endsWith('.js'));
const stylesheetFiles = bundleFiles.filter((filename) => filename.endsWith('.css'));
if (javascriptFiles.length !== 1 || stylesheetFiles.length !== 1) {
  throw new Error(
    `Expected one JavaScript bundle and one stylesheet; found ${javascriptFiles.length} JS and ${stylesheetFiles.length} CSS files.`,
  );
}

const javascriptSource = resolve(bundleDir, javascriptFiles[0]);
const stylesheetSource = resolve(bundleDir, stylesheetFiles[0]);
const javascript = await readFile(javascriptSource);
const stylesheet = await readFile(stylesheetSource);
const javascriptHash = createHash('sha256').update(javascript).digest('hex').slice(0, 12);
const stylesheetHash = createHash('sha256').update(stylesheet).digest('hex').slice(0, 12);
const javascriptTarget = resolve(outputDir, 'script.js');
const stylesheetTarget = resolve(outputDir, 'styles.css');

await rename(javascriptSource, javascriptTarget);
await rename(stylesheetSource, stylesheetTarget);
await rm(bundleDir, { recursive: true, force: true });
await mkdir(bundleDir, { recursive: true });

for (const filename of await readdir(outputDir)) {
  if (['index.html', '404.html', '.nojekyll', 'robots.txt', 'script.js', 'styles.css', 'assets'].includes(filename)) {
    continue;
  }
  await rename(resolve(outputDir, filename), resolve(bundleDir, filename));
}

const indexPath = resolve(outputDir, 'index.html');
let html = await readFile(indexPath, 'utf8');
const oldJavascriptPath = html.match(/\bsrc="([^"]+\.js(?:\?[^"]*)?)"/)?.[1];
const oldStylesheetPath = html.match(/\bhref="([^"]+\.css(?:\?[^"]*)?)"/)?.[1];
if (!oldJavascriptPath || !oldStylesheetPath) {
  throw new Error('Could not find the JavaScript bundle and stylesheet references in index.html.');
}

html = html
  .replace(oldJavascriptPath, `${base}script.js?v=${javascriptHash}`)
  .replace(oldStylesheetPath, `${base}styles.css?v=${stylesheetHash}`)
  .replace(`${base}parker-monogram.png`, `${base}assets/parker-monogram.png`);

await writeFile(indexPath, html);
await copyFile(indexPath, resolve(outputDir, '404.html'));

console.log('Prepared the flat GitHub Pages Viewer output: index.html, styles.css, script.js, and assets/.');
