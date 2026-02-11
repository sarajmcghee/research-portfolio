# Research Portfolio

A minimalist portfolio highlighting ML research projects with a kingfisher-inspired palette.

## Develop

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

This repo is configured to deploy automatically via GitHub Actions when you push to `main`.

- Repo name: `research-portfolio`
- Pages URL: `https://sarajmcghee.github.io/research-portfolio/`

If you change the repo name, update `base` in `vite.config.js`.

## Site QA: Link Check

Run:

```bash
npm run qa:links
```

Outputs:

- `reports/link-check/report.md`
- `reports/link-check/report.json`

Optional overrides:

```bash
LINK_CHECK_BASE="https://your-production-url/" \
LINK_CHECK_STAGING="https://your-staging-url/" \
LINK_CHECK_IGNORE_DOMAINS="linkedin.com,instagram.com" \
LINK_CHECK_FAIL_ON_EXTERNAL="true" \
npm run qa:links
```

Fail behavior:

- Always fails on critical internal issues: broken internal links, missing internal assets, redirect loops.
- Fails on broken external links only when `LINK_CHECK_FAIL_ON_EXTERNAL=true`.
