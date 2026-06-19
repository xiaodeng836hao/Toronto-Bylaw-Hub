# SEO Checklist — Toronto Bylaw Guide

Production domain: **https://bylawguide.ca**

SEO metadata, the sitemap, and robots.txt all read the domain from
`lib/site-config.ts` (`siteConfig.siteUrl`, overridable via
`NEXT_PUBLIC_SITE_URL`). Set that env var to `https://bylawguide.ca` in
production so canonical URLs and the sitemap reference the real domain.

## Build-time (already in the app)

- [x] `metadataBase` set to the production domain (`app/layout.tsx`).
- [x] Default `<title>` + title template (`%s · Toronto Bylaw Guide`).
- [x] Default meta description (`lib/site-config.ts`).
- [x] Open Graph tags (title, description, url, siteName, locale, type).
- [x] Twitter card (`summary_large_image`).
- [x] Canonical URL via `alternates.canonical` (root = `/`).
- [x] Per-chapter `<title>` + description via `generateMetadata`.
- [x] `robots.txt` allows `/`, disallows `/api/`, points to `sitemap.xml`, sets host.
- [x] `sitemap.xml` includes Home, TMC Chapters, every chapter detail page,
      Pool Fence Guide, Zoning, Prohibited Plants (+ each plant), Photo Review,
      Search, Feedback, Noise (Coming Soon). Excludes API and removed routes.
- [x] Server-rendered, indexable text on content pages (not image-only).
- [x] One `<h1>` per page; logical heading order.

Run `npm run preflight` to confirm no localhost / preview URLs and that the
domain config is correct.

## Post-deploy — Google Search Console

- [ ] Verify the property for `https://bylawguide.ca` (DNS or HTML tag).
- [ ] Submit `https://bylawguide.ca/sitemap.xml`.
- [ ] URL Inspection → Inspect the homepage; request indexing.
- [ ] URL Inspection → Inspect main pages (TMC Chapters, Fences chapter,
      Pool Fence Guide, Zoning, Prohibited Plants, Photo Review).
- [ ] Confirm "Indexing allowed? Yes" (no stray `noindex`).
- [ ] Confirm the canonical Google chose matches the `bylawguide.ca` URL.

## Spot checks (browser)

- [ ] `https://bylawguide.ca/robots.txt` loads and lists the sitemap.
- [ ] `https://bylawguide.ca/sitemap.xml` loads and uses `bylawguide.ca` URLs.
- [ ] View source on the homepage → `<title>`, description, OG, Twitter,
      and `<link rel="canonical">` are present and use `bylawguide.ca`.
- [ ] `site:bylawguide.ca` in Google (after indexing) returns the public pages.
- [ ] No removed/old routes (311 Navigator, Officer Tools) appear in results.

## Page title / description quick reference

- Home — "Toronto Bylaw Guide"
- TMC Chapters — "TMC Chapters · Toronto Bylaw Guide"
- Chapter detail — "<Chapter title> (Chapter <n>) · Toronto Bylaw Guide"
- Pool Fence Guide / Zoning / Prohibited Plants / Photo Review / Feedback —
  "<Page> · Toronto Bylaw Guide"

Each title should be unique and describe the page; descriptions should be a
plain-English summary of the page content (no keyword stuffing).
