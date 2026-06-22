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
