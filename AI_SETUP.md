# AI Setup (V6)

BylawGuide's V6 AI features — photo review, prohibited-plant identification, and
Ask RAG — are **optional and server-side only**. The site works fully without an
API key: every AI path falls back to the existing source-based behaviour.

> The API key is read only on the server (API route handlers). It is **never**
> sent to or exposed on the client.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `OPENAI_API_KEY` | Enables all AI features. If unset, AI is disabled and the app falls back. | — |
| `AI_PROVIDER` | `openai` (default) or `none` to force-disable AI. | `openai` |
| `AI_VISION_MODEL` | Vision model for photo review & plant ID. | `gpt-4o-mini` |
| `AI_TEXT_MODEL` | Text model for Ask RAG answers. | `gpt-4o-mini` |
| `AI_EMBEDDING_MODEL` | Embedding model for RAG ingestion + query. | `text-embedding-3-small` |
| `OPENAI_BASE_URL` | Override for an OpenAI-compatible endpoint. | `https://api.openai.com/v1` |
| `DATABASE_URL` | Optional Postgres for logs / production pgvector. | — |
| `PLANT_ID_API_KEY` | Enables Plant.id species identification on the Prohibited Plants page. Separate from OpenAI — see `PLANT_ID_SETUP.md`. | — |

> **Plant.id is separate from OpenAI/RAG.** The Prohibited Plants photo
> identifier uses the Plant.id API for plant **species** identification, and a
> local BylawGuide matcher decides whether the species is one of Toronto's 10
> prohibited plants. Setup details are in `PLANT_ID_SETUP.md`. Without
> `PLANT_ID_API_KEY` the upload feature falls back gracefully and the manual
> identifier keeps working.

Set these in your shell or `.env.local` (do not commit real keys). Example:

```bash
export OPENAI_API_KEY=sk-...
```

## Photo Review accuracy and section matching

Photo Review **automatically** maps a photo to the most relevant Toronto bylaw
chapter AND section — the user does **not** need to select an issue type (the
dropdown is an optional hint only). It is a **two-stage** pipeline that separates
*seeing* (AI) from *deciding* (local, source-backed code):

**Stage 1 — careful image classification** (`lib/ai/prompts.ts` →
`PHOTO_REVIEW_SYSTEM`). The vision model analyses conservatively and returns
structured JSON: `visibleObservations`, `detectedObjects`, controlled
`possibleIssueLabels`, `searchKeywords`, `visualEvidence`, **`negativeFindings`**
(what is NOT visible — e.g. "No swimming pool is visible"), `locationContext`,
and `imageQuality`. It must **not** output bylaw chapter/section numbers, and is
told to prefer fewer well-supported labels (low confidence over a guess). The
controlled category set is `data/photo-review/issue-taxonomy.ts`.

**Stage 2 — routed section retrieval + guardrails**
(`lib/photo-review/bylaw-section-retriever.ts`):
1. The curated matcher (`bylaw-matcher.ts` over `data/photo-review-bylaw-map.ts`)
   classifies into issue categories (confidence, pool gating, evidence, links).
   Keyword matching is **whole-word** so "water pooling" no longer trips "pool".
2. **Overmatch guardrails** drop a category when the AI's negative findings rule
   it out (`negatedByFindings`) or when a required clue is absent
   (`failsRequiredClue`) — criteria in `data/photo-review/category-visual-criteria.ts`.
   E.g. Pool Fence is dropped without a visible pool; Front Yard Parking needs a
   vehicle/parking surface.
3. **Source routing** (`data/photo-review/category-source-routing.ts`) selects
   which chapters to search — primary first, then secondary (Waste → 548, then
   846/841; Heating → 497, then 835) — instead of scanning everything.
4. Sections are scored over the routed chapters (title + keyword + body + visual
   overlap + search-phrase hits, primary-chapter boost) against the **section
   index** (`data/rag/bylaw-section-index.json`, built by
   `npm run build:bylaw-section-index` from `data/extracted-bylaws/`). The top 3
   verified sections (number + title + excerpt) are attached, with a
   **source-coverage** rating and a `whyNotHigher` note.

**Property Standards precision (Chapter 629).** Because Chapter 629 is huge and
broad, a dedicated selector (`lib/photo-review/property-standards-selector.ts`)
scores the curated section keyword groups in
`data/photo-review/property-standards-keywords.ts` (visual / resident / technical
/ section-term keywords, with negative-keyword penalties) and picks the MOST
SPECIFIC § 629 section — e.g. a ceiling water stain → `§ 629-27 Walls and
ceilings`, a missing handrail → `§ 629-19`, a leaking gutter → `§ 629-20`. The
section number + excerpt still come from the indexed Markdown, and the match's
display category is set to the specific group (e.g. "Interior Walls / Ceilings").
Cross-chapter guardrails (`propertyStandardsGuardrails` + per-group
`negativeKeywords`) keep § 629 to genuine *maintenance* conditions so it doesn't
override Chapter 447 (fence height), 485 (graffiti), 489 (weeds), or 548
(dumping) when those clearly apply.

**The API route** (`app/api/ai/photo-review/route.ts`) runs Stage 1 → Stage 2 and
returns `{ analysis, matches, noStrongMatch, debug? }` (debug only in dev). **The
UI** (`app/photo-review/page.tsx`) shows an *Image understanding* panel
(observations, objects, location, image quality, negative findings), then each
match's chapter, matched section number + title + **source excerpt**, source-
coverage badge, matched keywords, *why this may apply* / *why not higher*, a *to
confirm, include…* hint (required clues), evidence checklist, related guide page,
Ask link, and official sources. Upload tips and an optional location field help
users supply better input. A dev-only debug panel shows selected chapters,
tokens, section scores, and dropped categories.

**Client fallback is index-free.** The ~330KB section index is **server-only**
(imported by the retriever, never the page). The client uses `curatedMatch`
(`lib/photo-review/match-shared.ts`) for the description/selection fallback when
AI is off — chapter-level matches with "needs verification" sections.

**Sections are sourced, never invented.** Verified sections come straight from
the indexed Municipal Code Markdown. When the index has no clear section for a
chapter (e.g. Dust 417 and Zoning are not in the Markdown corpus yet), or no
section clears the score threshold, the match shows "Section reference needs
verification" instead of a fabricated number. The AI never supplies sections.

> **Coverage gap:** the Markdown corpus currently covers 13 TMC chapters (395,
> 447, 480, 485, 489, 497, 548, 629, 632, 659, 835, 841, 846). Dust (417), the
> Zoning By-law, and Landscaping are matched at chapter level only until their
> source text is added to `data/extracted-bylaws/` and re-indexed.

## Ask BylawGuide accuracy system

Ask (`/ask`, route `app/api/ai/ask/route.ts`) is grounded the same way as Photo
Review: it classifies the question, retrieves precise SECTION-level source
chunks, then the AI answers using ONLY those chunks. The pipeline:

1. **Noise gate** — `isNoiseQuery` short-circuits to the Coming Soon placeholder.
2. **Classify** (`lib/ask/classify-query.ts`) — expands the question with
   resident-language synonyms (`data/ask/synonyms.ts`, e.g. "leaking ceiling" →
   "walls and ceilings / roof / property standards") then reuses the curated
   matcher (`matchBylaws`) to pick the topic and the routed source chapters.
3. **Section retrieval** (`lib/ask/section-retrieve.ts`, server-only) — scores
   sections in the routed chapters of the Markdown-derived index; for Property
   Standards it uses the §629 keyword selector. Returns `RagChunkRef[]` — the
   same shape the Ask UI + answer generator already consume. If the topic is
   known but not in the corpus (Zoning, Landscaping, Dust) it returns nothing and
   the route **falls back to the curated knowledge index** (`lib/rag/retrieve`);
   if the topic is unknown it does a best-effort broad search of all chapters.
4. **Answer** (`lib/rag/answer.ts` → `ASK_RAG_SYSTEM`) — when AI is configured,
   generates a concise answer grounded ONLY in the retrieved chunks, with no
   invented section numbers and the required cautious/zoning/property-standards
   wording. Without a key, the client renders the existing local (V5) answer.

The response includes `topic`, `coverage` (strong / partial / chapter-only /
needs-verification), `retrievalMode` (`section-index` or the keyword/embedding
fallback), and `sources` (chapter + section + excerpt + internal/official links).

**Regression tests:** `npm run eval:ask` runs `scripts/evaluate-ask-accuracy.mjs`
over `data/ask/ask-evaluation-cases.ts` (deterministic, no key) and asserts the
expected topic / chapter / section for each question — run it after changing
bylaw Markdown, keywords, routing, or synonyms.

## Fallback behaviour (no key)

- **Photo Review** → the AI image card is replaced by a friendly "AI analysis is
  currently unavailable" notice, and the page falls back to the **local matcher**
  run over the optional description + selected issue (chapter-level matches with
  "needs verification" sections).
- **Prohibited Plants** → the upload section shows the unavailable notice; the
  static plant cards and identifier wizard still work.
- **Ask** → uses the existing local keyword retrieval + source-based answer
  (no AI card). The `/api/ai/ask` route returns `mode: "local-fallback"`.

## RAG ingestion

The local vector index lives at `data/rag/index.json` (gitignored / optional).
Build it from the parsed Municipal Code sections (`lib/bylaw-sections.json`):

```bash
OPENAI_API_KEY=sk-... npm run ingest-rag
```

Without a key the script prints guidance and exits 0 (keyword retrieval is used).
Re-running overwrites the index safely. See `RAG_SOURCE_MAINTENANCE.md`.

## Testing the AI features

With `OPENAI_API_KEY` set and `npm run dev` running:

- **Photo review** — upload a JPG/PNG/WEBP at `/photo-review`, click **Analyze
  Photo** (no issue type needed — it auto-detects). Confirm the matched **section
  number + source excerpt** appears: graffiti → Chapter 485 (§ 485-x); fence (no
  pool) → § 447-1.2 *Restrictions on fences; height* without the Pool Fence
  Guide; pool gate → § 447-1.3 *Swimming pool enclosures* **with** the Pool Fence
  Guide; overgrown weeds → Chapter 489 / *Schedule A*; waste → § 548-x; a photo
  with several issues → multiple ranked matches (top 3 + "show more"); an unclear
  photo → low confidence / no strong match; a noise photo → Coming Soon only.
  Dust (417) and zoning show "Section reference needs verification" (not yet in
  the Markdown corpus). The dev-only debug panel shows tokens + section scores.
  Try an unsupported file type and an >8 MB file (rejected server-side).
- **Plant ID** — at `/prohibited-plants`, use **Upload a Plant Photo**. Try
  poison ivy, giant hogweed, an unrelated plant (should say "cannot confidently
  identify"), and an unclear photo.
- **Ask RAG** — at `/ask`, ask "How high can my front yard fence be?", "What
  counts as soft landscaping?", "What does Chapter 417 say about dust?". A
  "noise complaint" query must return the Coming Soon message only.

## Privacy

Uploaded images are converted to a data URL in-memory for a single AI request
and are **not stored**. Users are told not to upload faces, licence plates, or
personal information. Do not add persistent image storage without informing users.

## Rate limiting

A lightweight in-memory rate limit (`lib/ai/guard.ts`) protects the AI routes
(per-instance). For multi-instance production, replace it with a shared store
(e.g. Redis / Vercel KV) — the interface is a single `rateLimit(key)` call.

## Cost control

- AI runs only on explicit submit (never per keystroke).
- Images are sent at `detail: "low"`; uploads capped at 8 MB.
- Retrieval is limited to the top 6 chunks; answers are length-capped.
