#!/usr/bin/env node
/**
 * Preflight launch check — dependency-free, no test framework.
 *
 * Run with:  npm run preflight
 *
 * Verifies, before a production deploy:
 *   1. No forbidden URLs in source (localhost, *.vercel.app preview URLs).
 *   2. No references to removed features (311 Navigator, Officer Tools).
 *   3. Required public routes exist.
 *   4. Forbidden routes do NOT exist (311 Navigator, Officer Tools, admin, login).
 *   5. SEO config uses the production domain (https://bylawguide.ca), not
 *      localhost / a preview URL.
 *
 * Exits non-zero if any check fails so it can gate CI / a deploy.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SCAN_DIRS = ["app", "lib", "components"];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);

const failures = [];
const fail = (msg) => failures.push(msg);

// ── 1 & 2. Forbidden-pattern scan ────────────────────────────────────────────
const FORBIDDEN = [
  { name: "localhost URL", re: /https?:\/\/localhost|\blocalhost:\d{2,5}\b/i },
  { name: "Vercel preview URL", re: /\bhttps?:\/\/[a-z0-9-]+\.vercel\.app/i },
  { name: "311 Navigator route", re: /["'`/]311[-_]?navigator/i },
  { name: "Officer Tools reference", re: /officer[-\s]?tools/i },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (SCAN_EXT.has(extname(p)) && !p.endsWith("preflight.mjs")) out.push(p);
  }
  return out;
}

let scanned = 0;
for (const d of SCAN_DIRS) {
  const abs = join(ROOT, d);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs)) {
    scanned++;
    const text = readFileSync(file, "utf8");
    for (const { name, re } of FORBIDDEN) {
      if (re.test(text)) fail(`Forbidden pattern (${name}) found in ${file.replace(ROOT, ".")}`);
    }
  }
}

// ── 3. Required routes exist ─────────────────────────────────────────────────
const REQUIRED = [
  "app/page.tsx",
  "app/tmc-chapters/page.tsx",
  "app/tmc-chapters/[chapter]/page.tsx",
  "app/pool-fence-guide/page.tsx",
  "app/zoning/page.tsx",
  "app/prohibited-plants/page.tsx",
  "app/prohibited-plants/[slug]/page.tsx",
  "app/photo-review/page.tsx",
  "app/feedback/page.tsx",
  "app/noise-complaints/page.tsx",
  "app/search/page.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/not-found.tsx",
];
for (const r of REQUIRED) {
  if (!existsSync(join(ROOT, r))) fail(`Required route/file missing: ${r}`);
}

// ── 4. Forbidden routes do NOT exist ─────────────────────────────────────────
const FORBIDDEN_ROUTES = [
  "app/311-navigator",
  "app/311navigator",
  "app/officer-tools",
  "app/officer",
  "app/admin",
  "app/login",
  "app/register",
];
for (const r of FORBIDDEN_ROUTES) {
  if (existsSync(join(ROOT, r))) fail(`Forbidden route should not exist: ${r}`);
}

// ── 5. SEO config uses the production domain ─────────────────────────────────
const cfgPath = join(ROOT, "lib/site-config.ts");
if (!existsSync(cfgPath)) {
  fail("lib/site-config.ts is missing");
} else {
  const cfg = readFileSync(cfgPath, "utf8");
  if (!cfg.includes("https://bylawguide.ca")) fail("site-config.ts does not use https://bylawguide.ca");
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`Preflight: scanned ${scanned} source files.`);
if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✓ All preflight checks passed.");
