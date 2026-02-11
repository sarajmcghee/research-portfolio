# Design Tokens (Proposed)

Use these tokens in `/Users/saramcghee/Documents/New project/src/styles.css` to enforce consistency.

```css
:root {
  /* Color system */
  --color-bg: #f6f4ef;
  --color-surface: #ffffff;
  --color-surface-muted: #f2f6f5;
  --color-text: #0b1f22;
  --color-text-muted: #4a5f63;
  --color-brand-teal: #0b6a73;
  --color-brand-aqua: #7ad0c6;
  --color-brand-orange: #f37b2a;
  --color-brand-blue: #1f7fa8;
  --color-border-soft: rgba(11, 31, 34, 0.12);
  --color-focus: #0f8ca0;

  /* Typography */
  --font-display: "Fraunces", serif;
  --font-body: "Space Grotesk", "Segoe UI", sans-serif;
  --fs-hero: clamp(2.25rem, 4vw, 3.75rem);
  --fs-h2: clamp(1.5rem, 2.4vw, 2.25rem);
  --fs-h3: clamp(1.1rem, 1.4vw, 1.35rem);
  --fs-body: 1rem;
  --fs-body-lg: 1.125rem;
  --fs-caption: 0.8125rem;
  --lh-tight: 1.15;
  --lh-body: 1.6;
  --lh-relaxed: 1.75;

  /* Spacing (8px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Radius */
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-pill: 999px;

  /* Elevation */
  --shadow-sm: 0 8px 24px rgba(11, 31, 34, 0.08);
  --shadow-md: 0 16px 40px rgba(11, 31, 34, 0.12);
  --shadow-lg: 0 24px 60px rgba(11, 31, 34, 0.16);

  /* Motion */
  --motion-fast: 120ms;
  --motion-base: 180ms;
  --motion-slow: 260ms;
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

## Mapping guidance
- `h1` -> `--fs-hero`, `--lh-tight`
- `.section-title h2` -> `--fs-h2`
- `.lead` -> `--fs-body-lg`, max width `68ch`
- `.card`, `.highlight-card`, `.panel` -> `--radius-lg`, `--shadow-md`, `--space-5`
- `.button` -> `--space-3 --space-5`, hover uses `--motion-base`
- `.section` -> vertical rhythm with `--space-8`

## Accessibility guardrails
```css
:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```
