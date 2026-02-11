# Interactive Portfolio with 3D Tree Scene

## Overview
I built this portfolio as a React + Vite single-page app with an interactive Three.js forest hero. The goal was to show engineering depth through a working system, not static screenshots.

## Problem
Most portfolio sites are static and interchangeable. I wanted a site that communicates technical depth quickly while still loading fast and staying maintainable.

## Approach
I treated the hero as a real system: procedural tree generation, constrained camera controls, and mobile joystick input. I paired that with structured content sections so the visual layer supports the case studies instead of distracting from them.

I made explicit tradeoffs for reliability: bounded movement, controlled render size, and a single-page architecture that deploys cleanly to GitHub Pages.

## Technical highlights
- Frontend stack: React 18 + Vite 5.
- 3D stack: Three.js + Florasynth (`FLORASYNTH.Tree` preset generation).
- Scene composition includes fog, directional + ambient light, and a ground plane.
- Forest generation instantiates a `5 x 6` layout (`30` tree instances) with jittered placement and scale variation.
- Input support: keyboard, pointer drag, scroll zoom, and touch joystick controls.
- Deployment: GitHub Actions to GitHub Pages with Vite `base` path support.
- Related media paths: `src/assets/king.jpg`, `src/assets/chat.png`, `src/assets/cry.png`, `src/assets/enig.jpeg`.
- Tree asset paths: `public/assets/trees/red_maple_hero.glb`, `public/assets/trees/red_maple_lod1.glb`.

## Results/impact
- Turned first impression into an interactive scene while keeping project content scannable.
- Demonstrated full ownership across design, rendering, input handling, and deployment.
- Established a reusable platform for future case-study and performance iterations.

## What I'd do next
- Lazy-load 3D dependencies after first content paint.
- Split `App.jsx` into focused components for maintainability.
- Add lightweight performance budgets and automated Lighthouse checks in CI.
