# RAG Source Maintenance (V6)

How to keep the Ask RAG corpus accurate and source-based. The retrieval engine
has two paths (see `lib/rag/retrieve.ts`):

1. **Embeddings** (when `OPENAI_API_KEY` is set and `data/rag/index.json` exists)
   — cosine similarity over the parsed Municipal Code sections.
2. **Keyword fallback** (default) — the curated knowledge index
   (`data/knowledge-index.ts`) via `searchKnowledge`.

## Corpus sources

- **Parsed Municipal Code** — `lib/bylaw-sections.json`, produced by
  `npm run build:bylaw-index` from the official chapter PDFs. This is the
  embeddable text corpus.
- **Curated knowledge index** — `data/knowledge-index.ts` (front-line answers,
  drives the keyword fallback and the V5 Ask page).
- **Source metadata** — `data/rag/source-manifest.ts` maps a chapter number to
  its title, official URL, internal page, and `lastReviewed` date.

Excluded by design: 311 Navigator, Officer Tools, test/draft pages, and detailed
Noise content (Noise always returns the Coming Soon message via `isNoiseQuery`).

## Add or update a source document

1. Add/refresh the chapter PDF text, then rebuild the parsed sections:
   `npm run build:bylaw-index` (regenerates `lib/bylaw-sections.json`).
2. If it is a new chapter, add its metadata to `CHAPTER_META` in
   `data/rag/source-manifest.ts` (title, optional official/internal URLs).
3. Re-run ingestion to refresh embeddings: `npm run ingest-rag`.
4. For curated answers, add/adjust a `KnowledgeItem` in `data/knowledge-index.ts`
   (see `CONTENT_MAINTENANCE.md`).

## Re-running ingestion

```bash
OPENAI_API_KEY=sk-... npm run ingest-rag
```

- Safe to re-run — it overwrites `data/rag/index.json`.
- Chunks are de-duplicated by `chapter:section:index`.
- Chunk size ~900 chars with ~120 char overlap (`lib/rag/chunk.ts`); headings are
  prepended to each chunk so chapter/section context is preserved.

## Chunk metadata

Each indexed chunk carries: `id`, `chapter`, `section`, `sectionTitle`, `text`,
`embedding`. At query time it is enriched with `sourceTitle`, `sourceType`,
`internalUrl`, `officialUrl`, and `lastReviewed` from the manifest, and shown in
the answer's "Sources used" panel.

## Updating last-reviewed dates

Update `REVIEWED` (and any per-chapter override) in
`data/rag/source-manifest.ts` when you re-verify content against the official
source. The date appears on every source card.

## Avoiding unsupported claims

- The RAG prompt (`lib/ai/prompts.ts → ASK_RAG_SYSTEM`) answers **only** from
  retrieved snippets and must not invent section numbers or requirements.
- If retrieval returns nothing, the route returns `mode: "none"` and the UI shows
  "I could not find a clear source-based answer".
- Keep wording cautious; never present output as an official determination.

## Photo Review bylaw section matching

Photo Review maps an **image** (not a text query) to source-backed bylaw
**sections** (full flow in `AI_SETUP.md` → "Photo Review bylaw section
matching"):

- The image AI returns only **observations + issue labels + searchKeywords** —
  never chapter/section numbers.
- The PDF/Markdown-derived **section index** is the source of truth:
  - Source Markdown lives in `data/extracted-bylaws/` (one file per chapter).
  - `scripts/build-bylaw-section-index.mjs` parses it into
    `data/rag/bylaw-section-index.json` (run `npm run build:bylaw-section-index`).
    It splits on `§` headings, strips page banners/footers, and derives keywords.
  - The retriever (`lib/photo-review/bylaw-section-retriever.ts`) scores those
    sections against the AI search terms and attaches the best ones, each marked
    `verified` with a source excerpt.
- The curated map (`data/photo-review-bylaw-map.ts`) is the **fallback only** for
  the section reference: it supplies the issue category, confidence, pool gating,
  evidence, and official links, and provides "needs-verification" sections when
  the index has no clear match (e.g. Dust 417, Zoning — not yet in the corpus).
- **V6.4 accuracy layer:** the AI returns `negativeFindings` and a controlled
  category (`data/photo-review/issue-taxonomy.ts`); the retriever applies
  overmatch guardrails (`data/photo-review/category-visual-criteria.ts`) and
  searches only the routed chapters first (`data/photo-review/category-source-routing.ts`,
  primary then secondary — e.g. waste → 548 then 846/841). When you add a new
  category or chapter, update the taxonomy, the routing map, and (if it needs a
  required clue or negative-killer) the visual-criteria file — keyed by the same
  curated id.
- **To add/refresh a chapter's section coverage:** drop its extracted Markdown
  into `data/extracted-bylaws/` (keep the `§` headings + section titles intact),
  re-run `npm run build:bylaw-section-index`, and verify on `/photo-review`. Also
  register the chapter in `CHAPTER_META` (both the build script and
  `data/rag/source-manifest.ts`) so titles, official URLs and internal pages
  resolve.
- This pipeline is independent of the embedding vector index — it works with or
  without `data/rag/index.json` and without an API key (client curated fallback).

## Ask BylawGuide section grounding (V6.7)

Ask now retrieves precise SECTION-level chunks the same way Photo Review does,
instead of broad page-level knowledge items (full flow in `AI_SETUP.md` → "Ask
BylawGuide accuracy system"):

- The question is classified (`lib/ask/classify-query.ts`) using resident-language
  synonyms (`data/ask/synonyms.ts`) + the curated matcher, then routed to source
  chapters (`data/photo-review/category-source-routing.ts`).
- `lib/ask/section-retrieve.ts` scores sections in the routed chapters of the
  Markdown index (and the §629 selector for Property Standards), returning
  `RagChunkRef[]`. The Ask route prefers these; it falls back to the curated
  knowledge index for topics not yet in the corpus (Zoning, Landscaping, Dust).
- **To improve an Ask answer:** add the chapter's Markdown to
  `data/extracted-bylaws/` and re-index (`npm run build:bylaw-section-index`), add
  resident phrasings to `data/ask/synonyms.ts`, and add a case to
  `data/ask/ask-evaluation-cases.ts`. Then run `npm run eval:ask` — it must stay
  green. Never add a section number that is not in the source.

## Production: PostgreSQL + pgvector

The local JSON store is for development / single-instance use. For production:

1. Enable the `vector` extension on Postgres.
2. Add a `RagChunk.embedding vector(1536)` column (model-dependent dimension)
   and an ivfflat/hnsw index. Suggested Prisma models are in `prisma/schema.prisma`
   (`RagSource`, `RagChunk`, `AskQueryLog`, `AIImageAnalysis`) — `embedding` is
   stored as JSON there; switch to a pgvector column + `Unsupported("vector")`
   with the `postgresqlExtensions` preview feature when adopting pgvector.
3. Replace `loadLocalIndex()` + cosine in `lib/rag/retrieve.ts` with a SQL
   `ORDER BY embedding <=> $query LIMIT n` query. The caller interface is
   unchanged.
