# Content Maintenance — Ask & Knowledge Index (V5)

This guide explains how to keep the **Ask BylawGuide** feature and the improved
site-wide search accurate, source-based, and safe. The single source of truth is
`data/knowledge-index.ts`; the retrieval engine is `lib/ask.ts`.

> **Golden rule:** every answer must be source-based and cautious. BylawGuide is
> an independent public reference tool — never an official City determination,
> never legal advice.

---

## 1. How to add a new knowledge item

1. Open `data/knowledge-index.ts` and add an object to `knowledgeItems`.
2. Fill in every field of the `KnowledgeItem` interface:
   - `id` — unique kebab-case slug (e.g. `pool-fence-gate-self-closing`).
   - `title` — the question or topic as a short phrase.
   - `type` — one of the `KnowledgeType` values (TMC Chapter, Fence, Pool Fence
     Guide, Zoning, Landscaping, Prohibited Plant, Photo Review, Coming Soon,
     Official Source).
   - `topic` — broad bucket used for ranking (e.g. "Pool Fence", "Zoning").
   - `summary` — one sentence, cautious.
   - `keywords` / `synonyms` — see sections 2 and 3.
   - `relatedQuestions` — natural phrasings users might type.
   - `sourceText` — a short, faithful summary/excerpt of the official source.
   - `plainLanguageAnswer` — the reference answer shown on the Ask page.
   - `relatedChapter` — e.g. "Chapter 447 — Fences" or a Zoning chapter, or `null`.
   - `relatedSections` — **only verified** section references (see section 6).
   - `officialSources` — `{ title, type, url }` objects (see section 3).
   - `internalUrl` — the BylawGuide page this maps to.
   - `lastReviewed` — see section 4.
   - `cautionLevel` — drives the disclaimer (see `components/AnswerDisclaimer.tsx`).
   - `nextSteps` — practical, non-legal steps.
3. Run `npx tsc --noEmit` to confirm types, then test on `/ask`.

No other file needs editing — the Ask page and the site search both read from the
index automatically.

## 2. How to add keywords

- Put the words a resident would literally type into `keywords`.
- Include both the formal term and casual variants (e.g. `air conditioner`, `ac`,
  `condenser`).
- Keywords are weighted higher than summary text in scoring (`lib/ask.ts`).

## 3. How to add synonyms and official source links

- **Synonyms:** add resident-friendly equivalents to the item's `synonyms`, and —
  if the phrase should help across multiple items — add it to a group in
  `synonymGroups` at the bottom of `data/knowledge-index.ts`. Synonym groups also
  power the improved site-wide search (`searchContent` in `lib/mock-data.ts`).
- **Official sources:** add `{ title, type, url }` to `officialSources`. Use the
  shared constants (`SRC_311`, `SRC_ZONING_REVIEW`, …) where they fit, and always
  link to an official `toronto.ca` page or the Municipal Code PDF.

## 4. How to update "last reviewed" dates

- Each item has `lastReviewed` (currently driven by the `REVIEWED` constant).
- When you re-check an item against the official source, set its `lastReviewed`
  to the date you verified it (`YYYY-MM-DD`). The date is shown in the "Sources
  used" panel on the Ask page.

## 5. How to avoid unsupported legal claims

- Never write "this is a violation", "you must", or "the City will".
- Prefer "generally", "may", "usually", "verify with official City sources".
- Do not state outcomes (approval, fines, enforcement). Describe the rule and
  point to the official source and the relevant guide.
- Keep the disclaimer (`AnswerDisclaimer`) on every answer.

## 6. How to handle complex zoning requirements

- Zoning is property-specific. Use `cautionLevel: "property-specific"` so the
  extra "depends on overlays, exceptions, measurements, exact zone" line appears.
- Only cite section numbers you have verified against By-law 569-2013 (the
  markdown sources live outside the repo). If you cannot verify a section, leave
  `relatedSections: []` and say "Needs source verification" in prose instead of
  inventing a number.
- Always direct users to confirm their zone in the Zoning Map Viewer.

## 7. How to add future Noise content safely

- Noise is intentionally a **Coming Soon** placeholder. The item with
  `type: "Coming Soon"` and `topic: "Noise"` must keep returning only
  "Noise Complaints content is currently under development."
- `isNoiseQuery()` in `lib/ask.ts` and the `/noise` handling in `searchContent`
  route all noise queries to the placeholder. When real Noise content is ready:
  1. Build the Noise page content first.
  2. Add proper Noise knowledge items (with sources).
  3. Relax `isNoiseQuery` / the search special-case carefully, and remove the
     "Coming Soon" gate only once the content is source-based and reviewed.

## 8. How to keep Ask answers source-based

- The Ask page (`app/ask/AskClient.tsx`) only ever renders fields from a matched
  `KnowledgeItem`. It cannot answer beyond the index.
- The optional AI route (`app/api/ask-ai/route.ts`) is **off unless**
  `OPENAI_API_KEY` is set. Even then it only summarizes retrieved snippets, never
  answers without sources, and never returns the key to the client.
- If retrieval returns nothing, the page shows the no-result state — do not add
  fallback "best guess" answers.

## 9. Feedback

- Ask answers have a "Was this answer helpful?" control posting to
  `app/api/ask-feedback/route.ts`. It writes to the existing `Feedback` model when
  a database is configured (mapped to `userType: "ask"`), otherwise logs. No
  schema migration is required. Review feedback to find missing/unclear items and
  add or improve knowledge items accordingly.
