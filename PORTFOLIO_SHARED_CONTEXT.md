# Portfolio Shared Context

Last updated: 2026-02-11

## Project Goal
Build a cutting-edge, slick portfolio site that is fast, reliable, visually cohesive, and shows standout work (including a lifelike 3D tree asset).

## Repo Notes (Filled)
- Site framework: React + Vite (JavaScript)
- Hosting: GitHub Pages via GitHub Actions (repo deployment target)
- Primary URL: `https://sarajmcghee.github.io/research-portfolio/` (live portfolio)
- GitHub profile URL: `https://github.com/sarajmcghee/`
- Repository: `https://github.com/sarajmcghee/research-portfolio`
- Repo structure root: `/Users/saramcghee/Documents/New project`

## Current Technical Snapshot
- Core app entry: `src/App.jsx`
- Styling: `src/styles.css`
- Bundler/build: `vite.config.js`
- 3D stack in use: `three` + `florasynth`
- 3D tree/model assets present:
  - Procedural tree generation in app code (`FLORASYNTH.Tree`)
  - Red maple OBJ/MTL textures under `public/models/red-maple/`

## Single-Run Priority Order
1. User impact: Improve above-the-fold portfolio clarity (hero messaging + project hierarchy).
2. Performance: Reduce initial JS and 3D startup cost (lazy-load heavy scene work).
3. Maintainability: Split `src/App.jsx` into focused sections/components.

## Scope Rules
- Keep scope tight with one clear deliverable per run.
- Prefer small, reviewable changes.
- Prioritize decisions in this order: user impact, performance, maintainability.

## Assumptions
- The active project is `research-portfolio`.
- The expected public URL is the GitHub Pages URL configured in README.
- If the repo name or deployment target changes, update `vite.config.js` `base` and this file.
