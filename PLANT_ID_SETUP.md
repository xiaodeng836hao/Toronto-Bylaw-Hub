# Plant.id Setup (V6.1)

The Prohibited Plants Identifier can use the **Plant.id** API (Kindwise) for real
plant **species** identification. BylawGuide then compares the suggested species,
locally, against Toronto's 10 prohibited plants. Plant.id is **never** asked about
bylaws — the prohibited-plant decision is made by our own matcher.

> This integration is **separate** from the general OpenAI / RAG setup
> (`AI_SETUP.md`). Plant.id handles species identification; the BylawGuide matcher
> (`lib/plant-id/prohibited-plant-matcher.ts`) handles Toronto prohibited-plant
> matching.

## Get a key

Plant.id is operated by **Kindwise**. Get an API key from the Kindwise admin console:

1. Product page: https://www.kindwise.com/plant-id
2. Sign up / sign in and create an API key at: https://admin.kindwise.com
3. The key works with the Plant.id v3 endpoint (`https://api.plant.id/v3/identification`, `Api-Key` header).

## Set the key (server-side only)

Add to `.env.local` (dev) or your hosting provider's environment (production):

```bash
PLANT_ID_API_KEY=your_key_here
```

Do **not** prefix it with `NEXT_PUBLIC_`. It is read only inside the server route
`app/api/plant-id/identify/route.ts` via `lib/plant-id/client.ts` and is never
sent to the browser.

## Request flow

1. User uploads a photo on `/prohibited-plants` ("Identify a Possible Prohibited Plant").
2. The image is validated server-side (JPG/PNG/WEBP, ≤ 8 MB) and converted to
   base64 in memory — **not stored**.
3. `POST https://api.plant.id/v3/identification` is called with the image and
   `details=common_names,url,taxonomy,synonyms`.
4. The response is normalized to species suggestions.
5. The local matcher compares suggestions to Toronto's 10 prohibited plants
   (by scientific name, synonym/alias, common name, and genus-fallback).
6. The route returns a structured result with any prohibited matches, confidence,
   safety warnings, official sources, and a disclaimer.

## Limits & privacy

- **File types:** JPG, PNG, WEBP. **Max size:** 8 MB (matches the Photo Review limit).
- **Storage:** uploaded images are not stored; only used for the single request.
- Users are told not to upload people, faces, licence plates, addresses, or
  personal information.

## Rate limiting

The route uses the shared in-memory limiter (`lib/ai/guard.ts`). For multi-instance
production, swap in a durable store (Redis / Vercel KV). Exceeding the limit
returns: "Too many plant identification requests. Please wait a moment and try again."

## Fallback behaviour (no key)

If `PLANT_ID_API_KEY` is missing, the identify route returns `configured: false`
and the upload section shows a friendly "temporarily unavailable" message. The
**manual identifier, season/hazard filters, plant profiles, growth-stage
descriptions, and safe removal guidance all keep working** — the page never
depends on Plant.id.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "temporarily unavailable" notice | `PLANT_ID_API_KEY` unset, or 401/403 (invalid key) |
| "busy right now / too many requests" | Plant.id 429 or local rate limit |
| "does not appear to clearly show a plant" | Plant.id `is_plant` was false |
| "No clear match found" | Species identified but not on Toronto's prohibited list (or uncertain) |

## Testing

With `PLANT_ID_API_KEY` set and `npm run dev`:

1. Clear giant hogweed photo → possible match + strong skin-exposure warning + profile link.
2. Poison ivy photo → possible match + avoid-skin-contact / do-not-burn warning.
3. Unrelated houseplant → species suggestions shown, "no clear match".
4. Blurry photo → low confidence / no clear match.
5. Non-image file → validation error.
6. Remove the key → graceful fallback; manual identifier still works.
