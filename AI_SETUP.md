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

## Fallback behaviour (no key)

- **Photo Review** → keeps the rules-based reference result; the AI card is
  replaced by a friendly "AI analysis is currently unavailable" notice.
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
  Photo**. Try a clear fence photo, a waste photo, and an unclear photo. Try an
  unsupported file type and an >8 MB file (should be rejected server-side).
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
