import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_BASE_URL = "https://sarajmcghee.github.io/research-portfolio/";
const REPORT_DIR = path.resolve("reports/link-check");
const REPORT_JSON = path.join(REPORT_DIR, "report.json");
const REPORT_MD = path.join(REPORT_DIR, "report.md");

function parseArgs(argv) {
  const out = {
    base: process.env.LINK_CHECK_BASE || DEFAULT_BASE_URL,
    staging: process.env.LINK_CHECK_STAGING || "",
    ignoreDomains: (process.env.LINK_CHECK_IGNORE_DOMAINS || "")
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean),
    failOnExternal: (process.env.LINK_CHECK_FAIL_ON_EXTERNAL || "false").toLowerCase() === "true",
    timeoutMs: Number(process.env.LINK_CHECK_TIMEOUT_MS || 12000),
    maxPages: Number(process.env.LINK_CHECK_MAX_PAGES || 120)
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--base") out.base = argv[++i];
    else if (arg === "--staging") out.staging = argv[++i];
    else if (arg === "--ignore-domains") {
      out.ignoreDomains = (argv[++i] || "")
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg === "--fail-on-external") out.failOnExternal = true;
    else if (arg === "--timeout-ms") out.timeoutMs = Number(argv[++i]);
    else if (arg === "--max-pages") out.maxPages = Number(argv[++i]);
  }

  return out;
}

function stripHash(url) {
  const next = new URL(url);
  next.hash = "";
  return next.toString();
}

function isHttpUrl(u) {
  return u.protocol === "http:" || u.protocol === "https:";
}

function isIgnoredByScheme(raw) {
  const v = raw.trim().toLowerCase();
  return (
    !v ||
    v.startsWith("#") ||
    v.startsWith("mailto:") ||
    v.startsWith("tel:") ||
    v.startsWith("javascript:") ||
    v.startsWith("data:")
  );
}

function isInternal(target, root) {
  return target.origin === root.origin;
}

function classifyAsset(urlPath) {
  const lower = urlPath.toLowerCase();
  if (/\.(png|jpg|jpeg|gif|webp|svg|avif|heic|ico)$/.test(lower)) return "image";
  if (/\.(mp4|webm|ogg|mov)$/.test(lower)) return "video";
  if (/\.(woff2?|ttf|otf|eot)$/.test(lower)) return "font";
  if (/\.(js|mjs|cjs|css|map)$/.test(lower)) return "static";
  if (/\.(pdf|zip|json|txt)$/.test(lower)) return "file";
  return "unknown";
}

function likelyHtml(urlObj) {
  const p = urlObj.pathname;
  if (p.endsWith("/")) return true;
  const ext = path.extname(p);
  return !ext;
}

function extractAll(html, regex, mapper) {
  const out = [];
  let match = regex.exec(html);
  while (match) {
    const value = mapper(match);
    if (value) out.push(value);
    match = regex.exec(html);
  }
  return out;
}

function extractHtmlRefs(html) {
  const links = extractAll(html, /<a\\b[^>]*?href=["']([^"']+)["'][^>]*>/gi, (m) => ({ type: "a", raw: m[1] }));
  const imgSrc = extractAll(html, /<img\\b[^>]*?src=["']([^"']+)["'][^>]*>/gi, (m) => ({ type: "img", raw: m[1] }));
  const scriptSrc = extractAll(html, /<script\\b[^>]*?src=["']([^"']+)["'][^>]*>/gi, (m) => ({ type: "script", raw: m[1] }));
  const linkHref = extractAll(html, /<link\\b[^>]*?href=["']([^"']+)["'][^>]*>/gi, (m) => ({ type: "link", raw: m[1] }));
  const mediaSrc = extractAll(html, /<(video|audio|source)\\b[^>]*?src=["']([^"']+)["'][^>]*>/gi, (m) => ({ type: m[1], raw: m[2] }));

  const srcsets = extractAll(html, /(srcset)=["']([^"']+)["']/gi, (m) => m[2]);
  const srcsetRefs = srcsets
    .flatMap((srcset) =>
      srcset
        .split(",")
        .map((x) => x.trim().split(/\s+/)[0])
        .filter(Boolean)
    )
    .map((raw) => ({ type: "srcset", raw }));

  return [...links, ...imgSrc, ...scriptSrc, ...linkHref, ...mediaSrc, ...srcsetRefs];
}

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);

  return {
    title: (titleMatch?.[1] || "").trim(),
    description: (metaDescMatch?.[1] || "").trim(),
    ogTitle: (ogTitleMatch?.[1] || "").trim(),
    ogDescription: (ogDescMatch?.[1] || "").trim(),
    ogImage: (ogImageMatch?.[1] || "").trim()
  };
}

async function fetchWithRedirects(startUrl, timeoutMs, maxRedirects = 8) {
  const chain = [];
  const seen = new Set();
  let current = startUrl;

  for (let i = 0; i <= maxRedirects; i += 1) {
    if (seen.has(current)) {
      return { ok: false, loop: true, chain, finalUrl: current, status: 0, body: "", contentType: "" };
    }
    seen.add(current);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": "portfolio-link-check/1.0"
        }
      });
    } catch (error) {
      clearTimeout(timer);
      return {
        ok: false,
        loop: false,
        chain,
        finalUrl: current,
        status: 0,
        body: "",
        contentType: "",
        error: error?.message || "fetch failed"
      };
    }
    clearTimeout(timer);

    const status = response.status;
    chain.push({ url: current, status });

    if (status >= 300 && status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { ok: false, loop: false, chain, finalUrl: current, status, body: "", contentType: "" };
      }
      current = new URL(location, current).toString();
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("text/html") ? await response.text() : "";
    return {
      ok: status >= 200 && status < 300,
      loop: false,
      chain,
      finalUrl: current,
      status,
      body,
      contentType
    };
  }

  return { ok: false, loop: true, chain, finalUrl: current, status: 0, body: "", contentType: "" };
}

async function runSiteCheck({ siteUrl, config }) {
  const root = new URL(siteUrl);
  const queue = [stripHash(root.toString())];
  const visitedPages = new Set();
  const checkedUrls = new Map();

  const brokenInternal = [];
  const brokenExternal = [];
  const redirectChains = [];
  const missingAssets = [];
  const seoIssues = [];

  while (queue.length > 0 && visitedPages.size < config.maxPages) {
    const pageUrl = queue.shift();
    if (visitedPages.has(pageUrl)) continue;
    visitedPages.add(pageUrl);

    const pageResult = await fetchWithRedirects(pageUrl, config.timeoutMs);

    if (pageResult.chain.length > 1) {
      redirectChains.push({
        source: pageUrl,
        chain: pageResult.chain,
        finalUrl: pageResult.finalUrl,
        isLoop: pageResult.loop
      });
    }

    if (!pageResult.ok) {
      brokenInternal.push({
        source: "(crawl)",
        url: pageUrl,
        status: pageResult.status,
        error: pageResult.error || "page fetch failed"
      });
      continue;
    }

    const html = pageResult.body || "";
    const refs = extractHtmlRefs(html);

    const meta = extractMeta(html);
    const missing = [];
    if (!meta.title) missing.push("title");
    if (!meta.description) missing.push("meta description");
    if (!meta.ogTitle) missing.push("og:title");
    if (!meta.ogDescription) missing.push("og:description");
    if (!meta.ogImage) missing.push("og:image");
    if (missing.length > 0) {
      seoIssues.push({ page: pageUrl, missing });
    }

    for (const ref of refs) {
      if (isIgnoredByScheme(ref.raw)) continue;

      let resolved;
      try {
        resolved = new URL(ref.raw, pageUrl);
      } catch {
        continue;
      }
      if (!isHttpUrl(resolved)) continue;

      const normalized = stripHash(resolved.toString());
      const ignoredDomain = config.ignoreDomains.some((d) => resolved.hostname.toLowerCase().includes(d));
      if (ignoredDomain) continue;

      if (!checkedUrls.has(normalized)) {
        checkedUrls.set(normalized, await fetchWithRedirects(normalized, config.timeoutMs));
      }

      const result = checkedUrls.get(normalized);
      const internal = isInternal(resolved, root);
      const isLink = ref.type === "a";
      const isAsset = !isLink;

      if (result.chain.length > 1) {
        redirectChains.push({
          source: pageUrl,
          linkType: ref.type,
          original: normalized,
          chain: result.chain,
          finalUrl: result.finalUrl,
          isLoop: result.loop
        });
      }

      if (!result.ok) {
        const item = {
          source: pageUrl,
          url: normalized,
          status: result.status,
          error: result.error || "request failed",
          type: ref.type
        };

        if (internal && (isLink || isAsset)) {
          if (isAsset) {
            missingAssets.push({
              ...item,
              assetKind: classifyAsset(resolved.pathname)
            });
          } else {
            brokenInternal.push(item);
          }
        } else if (!internal) {
          brokenExternal.push(item);
        }
      }

      if (internal && isLink && likelyHtml(resolved)) {
        if (!visitedPages.has(normalized) && queue.length < config.maxPages * 3) {
          queue.push(normalized);
        }
      }
    }
  }

  return {
    target: siteUrl,
    crawledPages: [...visitedPages],
    checkedUrlCount: checkedUrls.size,
    brokenInternal,
    brokenExternal,
    redirectChains,
    missingAssets,
    seoIssues
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push("# Link Check Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## 1) Summary counts");
  lines.push("");
  lines.push(`- Targets scanned: ${report.targets.length}`);
  lines.push(`- Pages crawled: ${report.summary.pagesCrawled}`);
  lines.push(`- URLs checked: ${report.summary.urlsChecked}`);
  lines.push(`- Broken internal links: ${report.summary.brokenInternal}`);
  lines.push(`- Broken external links: ${report.summary.brokenExternal}`);
  lines.push(`- Redirect chains/loops: ${report.summary.redirectChains}`);
  lines.push(`- Missing assets: ${report.summary.missingAssets}`);
  lines.push(`- SEO/meta issues: ${report.summary.seoIssues}`);
  lines.push("");

  lines.push("## 2) Broken internal links (highest priority)");
  lines.push("");
  if (report.brokenInternal.length === 0) lines.push("- None");
  for (const item of report.brokenInternal) {
    lines.push(`- ${item.url} (status: ${item.status || "n/a"}) from ${item.source}`);
  }
  lines.push("");

  lines.push("## 3) Broken external links");
  lines.push("");
  if (report.brokenExternal.length === 0) lines.push("- None");
  for (const item of report.brokenExternal) {
    lines.push(`- ${item.url} (status: ${item.status || "n/a"}) from ${item.source}`);
  }
  lines.push("");

  lines.push("## 4) Redirect chains");
  lines.push("");
  if (report.redirectChains.length === 0) lines.push("- None");
  for (const item of report.redirectChains) {
    const chain = item.chain.map((s) => `${s.status}:${s.url}`).join(" -> ");
    const loopLabel = item.isLoop ? " [LOOP]" : "";
    lines.push(`- ${chain} -> ${item.finalUrl}${loopLabel}`);
  }
  lines.push("");

  lines.push("## 5) Missing assets");
  lines.push("");
  if (report.missingAssets.length === 0) lines.push("- None");
  for (const item of report.missingAssets) {
    lines.push(`- [${item.assetKind}] ${item.url} (status: ${item.status || "n/a"}) from ${item.source}`);
  }
  lines.push("");

  lines.push("## 6) Recommended fixes (with file paths)");
  lines.push("");
  lines.push("- For internal link/asset failures, update source URLs in `/Users/saramcghee/Documents/New project/src/App.jsx`.");
  lines.push("- For missing SEO tags, add `<title>` and OG/meta tags in `/Users/saramcghee/Documents/New project/index.html`.");
  lines.push("- If redirects are unintentional, replace redirected URLs with canonical URLs in `/Users/saramcghee/Documents/New project/src/App.jsx`.");

  if (report.seoIssues.length > 0) {
    lines.push("");
    lines.push("### SEO/meta issues");
    for (const issue of report.seoIssues) {
      lines.push(`- ${issue.page}: missing ${issue.missing.join(", ")}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const config = parseArgs(process.argv.slice(2));
  const targets = [config.base, config.staging].filter(Boolean);
  if (targets.length === 0) {
    throw new Error("No target URL provided. Use --base or LINK_CHECK_BASE.");
  }

  const perTarget = [];
  for (const target of targets) {
    perTarget.push(await runSiteCheck({ siteUrl: target, config }));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    config: {
      ...config,
      targets
    },
    targets: perTarget,
    brokenInternal: perTarget.flatMap((t) => t.brokenInternal),
    brokenExternal: perTarget.flatMap((t) => t.brokenExternal),
    redirectChains: perTarget.flatMap((t) => t.redirectChains),
    missingAssets: perTarget.flatMap((t) => t.missingAssets),
    seoIssues: perTarget.flatMap((t) => t.seoIssues)
  };

  report.summary = {
    pagesCrawled: perTarget.reduce((sum, t) => sum + t.crawledPages.length, 0),
    urlsChecked: perTarget.reduce((sum, t) => sum + t.checkedUrlCount, 0),
    brokenInternal: report.brokenInternal.length,
    brokenExternal: report.brokenExternal.length,
    redirectChains: report.redirectChains.length,
    missingAssets: report.missingAssets.length,
    seoIssues: report.seoIssues.length
  };

  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.writeFile(REPORT_JSON, JSON.stringify(report, null, 2));
  await fs.writeFile(REPORT_MD, toMarkdown(report));

  const hasRedirectLoops = report.redirectChains.some((c) => c.isLoop);
  const criticalIssues =
    report.summary.brokenInternal + report.summary.missingAssets + (hasRedirectLoops ? 1 : 0);
  const externalFailure = config.failOnExternal && report.summary.brokenExternal > 0;

  if (criticalIssues > 0 || externalFailure) {
    process.exitCode = 1;
  }

  console.log(`Link report written to ${REPORT_MD} and ${REPORT_JSON}`);
  console.log(`Critical issues: ${criticalIssues}, external fail mode: ${externalFailure}`);
}

main().catch(async (error) => {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const fallback = {
    generatedAt: new Date().toISOString(),
    error: error?.message || String(error)
  };
  await fs.writeFile(REPORT_JSON, JSON.stringify(fallback, null, 2));
  await fs.writeFile(
    REPORT_MD,
    `# Link Check Report\n\nRun failed: ${fallback.error}\n`
  );
  console.error(error);
  process.exitCode = 1;
});
