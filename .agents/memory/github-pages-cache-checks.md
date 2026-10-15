---
name: GitHub Pages cache checks
description: Distinguish stale GitHub Pages responses from a build that is actually missing current portfolio code.
---

When a GitHub Pages route appears older than the Replit preview, first compare the deployed JavaScript and CSS bundle hashes with a fresh local Pages build, and retry the route with a cache-busting query before changing the app. A cache-busted route may show the current content even when a plain route appears stale.

**Why:** A GitHub Pages route screenshot showed older portfolio content even though the latest workflow succeeded and the deployed bundle hashes matched the current source; a cache-busted route rendered the current version.

**How to apply:** Check the deploy run and bundle hashes, then retry the same route with a unique query parameter. Only modify app code when the fresh route or bundle comparison confirms a real source/build mismatch.
