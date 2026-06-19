# Deployment Checklist — Toronto Bylaw Guide

Production domain: **https://bylawguide.ca**

This app is built to run reliably on **restricted corporate/government networks**
(e.g. City of Toronto office Wi-Fi). It loads **no external runtime assets** — all
images, fonts, icons, and scripts are served from the app's own origin. Use this
checklist when deploying to the production custom domain.

## Before deploy

- [ ] **Production custom domain connected** (`bylawguide.ca`), not a
      preview/temporary deployment domain (preview domains are more likely to be
      blocked or filtered on office Wi-Fi).
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://bylawguide.ca`. This drives the canonical
      URL, `sitemap.xml`, and `robots.txt`. If unset, the app still defaults to
      `https://bylawguide.ca` (see `lib/site-config.ts`).
- [ ] **HTTPS is active** on the custom domain (valid certificate, HTTP → HTTPS
      redirect). Restricted networks often block plain HTTP.
- [ ] (Optional) `DATABASE_URL` — only needed if you want feedback stored in
      PostgreSQL. The app works without it (feedback is logged to the server
      console instead), so it is not required for the public site to function.
      If set, run `npx prisma migrate deploy` (the `Feedback` model now includes
      `feature` and `canContact`).

## Build & verify locally

- [ ] `npm install` completes without errors.
- [ ] `npm run preflight` passes (no localhost/preview URLs, no removed routes,
      required routes present, domain config correct).
- [ ] `npm run build` completes with **no TypeScript errors**.
- [ ] `npm run dev` (or `npm start` after build) serves all pages.
- [ ] All routes render: `/`, `/tmc-chapters`, `/tmc-chapters/[chapter]`,
      `/photo-review`, `/pool-fence-guide`, `/zoning`, `/prohibited-plants`,
      `/prohibited-plants/[slug]`, `/search`, `/feedback`, `/noise-complaints`.
- [ ] No broken internal links; external links reviewed (open in a new tab).
- [ ] **Mobile tested** at ~375px (no horizontal scroll; tables/cards stack).
- [ ] **Feedback form tested** end-to-end; **database connection tested** if
      `DATABASE_URL` is set.

## SEO / Google Search Console (see SEO_CHECKLIST.md)

- [ ] `robots.txt` is live at `/robots.txt`.
- [ ] `sitemap.xml` is live at `/sitemap.xml` and uses `bylawguide.ca` URLs.
- [ ] Google Search Console property verified for `bylawguide.ca`.
- [ ] Sitemap submitted to Google.
- [ ] Homepage inspected (URL Inspection) and indexing requested.
- [ ] Main pages inspected in Search Console.
- [ ] No `noindex` on production pages (the app sets `index: true`).

## Network-reliability guarantees (already built in)

- [x] **No external runtime assets** — fonts use a system font stack (no Google
      Fonts request), all images live under `/public`, icons are bundled
      (`lucide-react`), no third-party analytics/widgets/scripts.
- [x] **No iframes** for City of Toronto / 311 / maps / zoning pages — official
      resources are normal links that open in a new tab with
      `target="_blank" rel="noopener noreferrer"`.
- [x] **Relative internal links & API calls** (e.g. `/api/bylaw-search`,
      `/api/feedback`) — no hardcoded `localhost` or preview URLs.
- [x] **Graceful fallback** — local images sit on a neutral placeholder
      background, and plant pages fall back to illustrated panels, so a single
      failed resource never breaks the page.
- [x] **Security headers** set in `next.config.ts`
      (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
      `Permissions-Policy`). No strict CSP, so local assets are never blocked.

## Post-deploy testing

Test the live custom domain on each network type:

- [ ] **Mobile data** (cellular) — baseline, least restricted.
- [ ] **Home Wi-Fi** — typical residential network.
- [ ] **Restricted office Wi-Fi** (e.g. City of Toronto) — the key target.
- [ ] Open the browser **DevTools → Console & Network** on each and confirm there
      are **no blocked requests** and no mixed-content warnings.
- [ ] Confirm official links (Zoning Map Viewer, Zoning By-law, 311, Chapter PDFs)
      open in a new tab. These point to `toronto.ca` / `ontario.ca`; if *only*
      office Wi-Fi blocks them, that is the City filtering its own/other domains —
      the Bylaw Hub itself still renders fully.

## If the site is blocked only on office Wi-Fi

The app serves everything from its own domain, so a block is almost always the
network filtering the **domain itself**, not a missing resource. In that case:

- [ ] Ask the organization's **IT/network team to whitelist the custom domain**.
- [ ] Confirm HTTPS is valid (some filters block sites with cert warnings).

## Key reference URLs (external links, open in new tab)

- Zoning Map Viewer — https://map.toronto.ca/maps/map.jsp?app=ZBL_CONSULT
- Zoning By-law / Preliminary Reviews — https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/
- Toronto 311 Service Request — https://www.toronto.ca/home/311-toronto-at-your-service/create-a-service-request/
- Chapter 447 (Fence) PDF — https://www.toronto.ca/legdocs/municode/1184_447.pdf
