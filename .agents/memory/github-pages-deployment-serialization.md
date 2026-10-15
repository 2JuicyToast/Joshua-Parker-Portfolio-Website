---
name: GitHub Pages deployment serialization
description: Avoid overlapping branch-published Pages deployments when a GitHub Actions publisher updates gh-pages.
---

For a branch-published Pages site, do not cancel an active publishing workflow when a newer source push arrives. Pushing `gh-pages` starts a separate GitHub-managed Pages deployment; cancelling the source workflow does not cancel that deployment, so the following branch update can be rejected as a concurrent deployment. Serialize publisher runs and keep the run active through cache-busted route verification so pending source changes wait for Pages to finish.

**Why:** A newer branch deployment was rejected because the previous `gh-pages` deployment was still in progress after its source run had been cancelled.

**How to apply:** In branch-publishing workflows, use a shared concurrency group with `cancel-in-progress: false`, then verify the deployed site before the workflow releases that group. GitHub-managed Node runtime warnings for its own Pages actions are not controlled by repository action pins.
