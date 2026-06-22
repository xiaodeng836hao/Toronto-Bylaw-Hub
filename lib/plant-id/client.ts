// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Plant.id API client (V6.1) — SERVER ONLY
//
//  Calls the Plant.id v3 identification endpoint. The API key is read from the
//  server env (PLANT_ID_API_KEY) and is never exposed to the client. All failure
//  modes resolve to a typed error so the route can degrade gracefully.
//
//  IMPORTANT: import only from server code (app/api/**).
// ─────────────────────────────────────────────────────────────────────────────

import type { PlantIdSuggestion } from "./types";

const ENDPOINT = "https://api.plant.id/v3/identification";
const DETAILS = "common_names,url,taxonomy,synonyms";
const TIMEOUT_MS = 20_000;

export function isPlantIdConfigured(): boolean {
  return Boolean(process.env.PLANT_ID_API_KEY);
}

export type PlantIdError =
  | "not-configured"
  | "invalid-key"
  | "rate-limited"
  | "unavailable"
  | "bad-response";

export interface PlantIdClientResult {
  ok: true;
  isPlant: boolean | null;
  suggestions: PlantIdSuggestion[];
}
export interface PlantIdClientError {
  ok: false;
  error: PlantIdError;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSuggestions(json: any): PlantIdSuggestion[] {
  const list = json?.result?.classification?.suggestions;
  if (!Array.isArray(list)) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.slice(0, 5).map((s: any) => {
    const d = s?.details ?? {};
    const tx = d?.taxonomy ?? {};
    return {
      scientificName: typeof s?.name === "string" ? s.name : "",
      commonNames: Array.isArray(d?.common_names) ? d.common_names.filter((c: unknown) => typeof c === "string") : [],
      probability: typeof s?.probability === "number" ? s.probability : 0,
      taxonomy: {
        kingdom: tx?.kingdom, phylum: tx?.phylum, class: tx?.class,
        order: tx?.order, family: tx?.family, genus: tx?.genus,
      },
      plantIdUrl: typeof d?.url === "string" ? d.url : undefined,
      rawName: typeof s?.name === "string" ? s.name : undefined,
    };
  });
}

/**
 * Identify a plant from one or more base64 images (data URLs accepted).
 * Returns typed suggestions, or a typed error on any failure.
 */
export async function identifyPlant(base64Images: string[]): Promise<PlantIdClientResult | PlantIdClientError> {
  const key = process.env.PLANT_ID_API_KEY;
  if (!key) return { ok: false, error: "not-configured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${ENDPOINT}?details=${DETAILS}&language=en`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Api-Key": key },
      body: JSON.stringify({ images: base64Images, similar_images: true }),
      signal: controller.signal,
    });

    if (res.status === 401 || res.status === 403) return { ok: false, error: "invalid-key" };
    if (res.status === 429) return { ok: false, error: "rate-limited" };
    if (!res.ok) return { ok: false, error: "unavailable" };

    const json = await res.json();
    const isPlant = typeof json?.result?.is_plant?.binary === "boolean" ? json.result.is_plant.binary : null;
    const suggestions = normalizeSuggestions(json);
    return { ok: true, isPlant, suggestions };
  } catch {
    return { ok: false, error: "unavailable" };
  } finally {
    clearTimeout(timer);
  }
}
