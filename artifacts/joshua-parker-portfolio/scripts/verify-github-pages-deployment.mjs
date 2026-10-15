import assert from 'node:assert/strict';

const rawPageUrl = process.env.PAGE_URL;
if (!rawPageUrl) {
  throw new Error('PAGE_URL must be set to the deployed GitHub Pages URL.');
}

const baseUrl = new URL(rawPageUrl);
if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';

const runId = process.env.GITHUB_RUN_ID || String(Date.now());
const maxAttempts = Number.parseInt(process.env.PAGES_VERIFY_ATTEMPTS || '24', 10);
const retryDelayMs = Number.parseInt(process.env.PAGES_VERIFY_DELAY_MS || '5000', 10);
const routeNames = [
  '',
  'projects',
  'ventures',
  'writing',
  'recognition',
  'interests',
  'contact',
];

function withCacheBust(url, label, attempt) {
  const requestUrl = new URL(url);
  requestUrl.searchParams.set('pages-deployment-check', `${runId}-${attempt}-${label}`);
  return requestUrl;
}

function normalizePathname(pathname) {
  return pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
}

async function fetchText(url, label, { allowPagesFallback = false, attempt } = {}) {
  const response = await fetch(withCacheBust(url, label, attempt), {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  assert.ok(
    response.status === 200 || (allowPagesFallback && response.status === 404),
    `${label} returned HTTP ${response.status} from ${response.url}`,
  );
  return { response, text: await response.text() };
}

async function verifyDeployedViewer(attempt) {
  let expectedBundlePaths;
  const verifiedRoutes = [];

  for (const routeName of routeNames) {
    const routeUrl = new URL(routeName, baseUrl);
    const { response, text: html } = await fetchText(routeUrl, `route-${routeName || 'home'}`, {
      allowPagesFallback: routeName !== '',
      attempt,
    });
    const finalUrl = new URL(response.url);

    assert.equal(
      normalizePathname(finalUrl.pathname),
      normalizePathname(routeUrl.pathname),
      `The ${routeName || 'home'} route redirected to an unexpected path.`,
    );
    assert.match(html, /<div id="root"><\/div>/, `${routeName || 'Home'} did not return the portfolio app shell.`);
    assert.match(html, /Joshua D\. Parker/, `${routeName || 'Home'} did not return the portfolio page title.`);

    const resources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
    const scriptPath = resources.find((resource) => /\.js(?:[?#]|$)/.test(resource));
    const stylesheetPath = resources.find((resource) => /\.css(?:[?#]|$)/.test(resource));
    assert.ok(scriptPath, `${routeName || 'Home'} did not reference script.js.`);
    assert.ok(stylesheetPath, `${routeName || 'Home'} did not reference styles.css.`);

    const bundlePaths = [scriptPath, stylesheetPath];
    for (const resource of bundlePaths) {
      const resourceUrl = new URL(resource, baseUrl);
      assert.ok(
        resourceUrl.pathname.startsWith(baseUrl.pathname),
        `${routeName || 'Home'} referenced an asset outside the Pages base path: ${resourceUrl}`,
      );
    }

    if (expectedBundlePaths) {
      assert.deepEqual(
        bundlePaths,
        expectedBundlePaths,
        `${routeName || 'Home'} referenced stale assets instead of the current Pages bundle.`,
      );
    } else {
      expectedBundlePaths = bundlePaths;
    }

    verifiedRoutes.push({ name: routeName || 'home', status: response.status });
  }

  const [scriptPath, stylesheetPath] = expectedBundlePaths;
  const { text: script } = await fetchText(
    new URL(scriptPath, baseUrl),
    'current-javascript-bundle',
    { attempt },
  );
  const { text: stylesheet } = await fetchText(
    new URL(stylesheetPath, baseUrl),
    'current-stylesheet',
    { attempt },
  );

  assert.ok(script.includes('jdparker2027@gmail.com'), 'The deployed bundle is missing the public contact email.');
  assert.ok(script.includes('https://github.com/2JuicyToast'), 'The deployed bundle is missing the GitHub profile link.');
  assert.match(script, /global-cursor-shadow/, 'The deployed bundle is missing the cursor effect.');
  assert.ok(script.includes('View Pitch Deck'), 'The deployed SafeLink card is missing its View Pitch Deck button.');
  assert.ok(script.includes('safelink-pitch-deck-dialog'), 'The deployed bundle is missing the button-triggered SafeLink deck dialog.');
  assert.doesNotMatch(script, /project-pitch-deck/, 'The deployed Projects page must not show a second inline deck preview.');
  assert.match(stylesheet, /\.global-cursor-shadow\{[^}]*width:120px/, 'The deployed cursor glow is not the requested smaller size.');
  assert.match(stylesheet, /ambient-smoke-orb/, 'The deployed stylesheet is missing the full-page smoke orbs.');
  assert.match(stylesheet, /@keyframes smoke-orb-float/, 'The deployed stylesheet is missing the floating smoke animation.');
  assert.doesNotMatch(stylesheet, /project-pitch-deck|project-deck-frame/, 'The deployed stylesheet must not retain inline deck preview styles.');
  for (const filename of ['writing-quill-book.png', 'lacrosse-stick-doodle.png', 'hema-sword-doodle.png']) {
    assert.ok(script.includes(filename), `The deployed bundle is missing the ${filename} decoration.`);
  }
  assert.match(stylesheet, /@keyframes atmosphere-drift/, 'The deployed stylesheet is missing the moving smoky background.');
  assert.match(stylesheet, /@keyframes sport-float/, 'The deployed stylesheet is missing the floating doodle animation.');
  assert.match(stylesheet, /@keyframes smoke-drift/, 'The deployed stylesheet is missing the smoke animation.');
  const backdropRule = stylesheet.match(/\.slideshow-backdrop\{([^}]*)\}/)?.[1] ?? '';
  assert.match(backdropRule, /position:fixed/, 'The deployed slideshow backdrop must be fixed to the viewport.');
  assert.match(backdropRule, /place-items:safe center/, 'The deployed slideshow must stay centered and reachable on small screens.');
  assert.match(backdropRule, /(?:-webkit-)?backdrop-filter:blur\(8px\)/, 'The deployed slideshow must blur the page behind it.');
  assert.match(script, /site-quote/, 'The deployed page is missing the Tesla quote content.');

for (const filename of [
  'favicon.svg',
  'hema-sword-doodle.png',
  'joshua-parker.jpg',
  'lacrosse-stick-doodle.png',
  'parker-monogram.png',
  'portfolio-content.json',
  'safelink-beacon-smash-national-pitch-deck.pdf',
  'writing-quill-book.png',
]) {
    const assetUrl = new URL(`assets/${filename}`, baseUrl);
    const response = await fetch(withCacheBust(assetUrl, `decoration-${filename}`, attempt), {
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    assert.equal(response.status, 200, `The deployed ${filename} asset returned HTTP ${response.status}.`);
    const bytes = await response.arrayBuffer();
    assert.ok(bytes.byteLength > 0, `The deployed ${filename} asset is empty.`);
    if (filename === 'safelink-beacon-smash-national-pitch-deck.pdf') {
      assert.equal(
        Buffer.from(bytes).subarray(0, 5).toString('ascii'),
        '%PDF-',
        'The deployed SafeLink pitch deck is not a valid PDF.',
      );
    }
  }

  return verifiedRoutes;
}

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    const verifiedRoutes = await verifyDeployedViewer(attempt);
    for (const route of verifiedRoutes) {
      console.log(`Verified ${route.name} route (HTTP ${route.status}).`);
    }
    console.log(`Verified deployed routes and animation assets at ${baseUrl}.`);
    break;
  } catch (error) {
    if (attempt === maxAttempts) throw error;
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Pages is not ready yet (attempt ${attempt}/${maxAttempts}): ${message}`);
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }
}
