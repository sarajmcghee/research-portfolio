# Design Audit - Portfolio Visual Polish

## Audit scope and defaults
- Evaluated files: `/Users/saramcghee/Documents/New project/src/App.jsx`, `/Users/saramcghee/Documents/New project/src/styles.css`
- Assumed vibe defaults (missing input): `cinematic + modern + minimal`
- Must-keep brand elements assumed: kingfisher palette and name identity

## Quick scorecard (current)
- Typography consistency: 7/10
- Spacing rhythm: 6/10
- Component consistency: 7/10
- Responsive polish: 6/10
- Motion quality: 6/10
- Accessibility basics: 5.5/10

## Top 10 changes for max wow (prioritized)
1. Establish a strict spacing system and replace ad-hoc values.
Before: mixed values (`10, 12, 16, 20, 24, 28, 32, 48, 64, 72`).
After: use token steps only (`4/8/12/16/24/32/48/64`) and map each component to one spacing tier.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.page`, `.hero`, `.section`, `.card`, `.grid`, `.footer`).

2. Unify heading/body type scale and tighten line lengths.
Before: good base fonts but inconsistent vertical rhythm and no explicit body scale tokens.
After: define a type ramp token set and enforce max line length (`65-72ch`) for long copy.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`h1`, `.section-title h2`, `.card-header h3`, `.lead`, `.card-summary`, `.highlight-card p`).

3. Convert cards to one cohesive elevation system.
Before: same `--shadow` reused everywhere but hover states vary and edge contrast is inconsistent.
After: 3 elevation levels (`surface/base/raised`) with consistent border + shadow behavior.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.hero`, `.card`, `.highlight-card`, `.art-card`, `.panel`).

4. Make CTA hierarchy unambiguous in hero.
Before: primary and ghost buttons have similar visual weight at a glance.
After: strengthen primary prominence and simplify secondary action treatment.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.hero-actions`, `.button`, `.button.ghost`) and `/Users/saramcghee/Documents/New project/src/App.jsx` (`header` action labels around lines 426-429).

5. Improve mobile composition for the hero + 3D canvas.
Before: only one mobile media rule (`max-width: 720px`); joystick overlays can feel cramped.
After: explicit breakpoints for `640/900/1200`, with hero stack priorities and optional joystick hide on very small screens.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.hero-main`, `.hero-canvas`, `.joystick`, `.page`).

6. Add visible keyboard focus states and link underlines.
Before: `a.link` removes underlines and no `:focus-visible` system is defined.
After: clear focus ring token and contextual underline behavior for text links.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.link`, `.button`, `.highlight-card`, global `:focus-visible`).

7. Normalize small UI elements (chips, pills, labels, badges).
Before: these elements look related but use inconsistent letter-spacing, font size, and fill opacity.
After: single “tag” spec with variants (`neutral`, `accent`, `info`) and shared geometry.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.badge`, `.pill`, `.chip`, `.demo`, `.label`).

8. Reduce decorative noise in background layer at smaller widths.
Before: `body::before` ornament can compete with content density.
After: lower opacity and complexity on tablet/mobile; keep cinematic mood via gradient only.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`body::before`, media queries).

9. Introduce intentional, low-distraction motion standards.
Before: hover translations are consistent but no global motion timing or reduced-motion fallback.
After: motion tokens (`fast/base/slow`) and `prefers-reduced-motion` branch.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (global transitions + component hover).

10. Clarify section hierarchy across Work, About, Highlights.
Before: section titles are stylistically similar but scanning priority is mostly flat.
After: clear hierarchy by title weight, intro copy size, and section spacing tiers.
Implement in: `/Users/saramcghee/Documents/New project/src/styles.css` (`.section`, `.section-title`, `.split`, `.grid`) and `/Users/saramcghee/Documents/New project/src/App.jsx` (section ordering/content trims).

## Concrete implementation guidance

### Tokens to add/update
Use `/Users/saramcghee/Documents/New project/design/tokens.md` as the source of truth and move those variables into `:root` in `/Users/saramcghee/Documents/New project/src/styles.css`.

### Component-level changes
- Hero
  - File: `/Users/saramcghee/Documents/New project/src/App.jsx`
  - Keep: hero composition and 3D identity.
  - Change: tighten subtitle length, make primary CTA action-oriented, reduce secondary button emphasis.
- Project cards
  - File: `/Users/saramcghee/Documents/New project/src/styles.css`
  - Change: enforce shared card primitives and consistent metadata styling (`.pill`, `.chip`, `.label`).
- About panel
  - File: `/Users/saramcghee/Documents/New project/src/styles.css`
  - Change: align panel radius/elevation with cards or intentionally define as inset surface.
- Highlights grid
  - File: `/Users/saramcghee/Documents/New project/src/styles.css`
  - Change: improve row consistency by standardizing image/thumb sizing and card min-height.
- Accessibility
  - File: `/Users/saramcghee/Documents/New project/src/styles.css`
  - Change: add global focus ring + reduced motion + stronger link affordance.

## Before/after snapshots (textual)
- Before: expressive and colorful, but spacing and component rhythm drift across sections.
- After: same kingfisher personality with clearer hierarchy, cleaner scan paths, and stronger perceived quality.
- Before: mobile feels adapted.
- After: mobile feels designed (intentional spacing, calmer background, stable tap targets).

## Definition-of-done checklist
- Homepage feels cohesive: hero, work cards, highlights read as one design language.
- Projects and About sections share a stable component grammar.
- Mobile (<=640px) has deliberate spacing and no cramped hero controls.
- Visual hierarchy is obvious in first 5 seconds.
- Focus states are visible and contrast remains AA-friendly for body text and controls.
