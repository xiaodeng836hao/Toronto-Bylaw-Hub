// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — AI provider abstraction (V6) — SERVER ONLY
//
//  A thin, provider-agnostic wrapper around an OpenAI-compatible API, called via
//  fetch (no SDK dependency). The API key is read from the server environment and
//  is NEVER sent to the client. If no key is configured, `isAiConfigured()`
//  returns false and callers fall back to the existing source-based behavior.
//
//  Env vars: OPENAI_API_KEY, AI_PROVIDER (default "openai"; "none" disables),
//  AI_VISION_MODEL, AI_TEXT_MODEL, AI_EMBEDDING_MODEL, OPENAI_BASE_URL.
//
//  IMPORTANT: import this module ONLY from server code (API route handlers under
//  app/api/** and node scripts). It reads OPENAI_API_KEY from the server env and
//  must never be bundled into a client component.
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER = process.env.AI_PROVIDER ?? "openai";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const VISION_MODEL = process.env.AI_VISION_MODEL ?? "gpt-4o-mini";
const TEXT_MODEL = process.env.AI_TEXT_MODEL ?? "gpt-4o-mini";
export const EMBEDDING_MODEL = process.env.AI_EMBEDDING_MODEL ?? "text-embedding-3-small";

/** True only when a usable AI provider + key are configured server-side. */
export function isAiConfigured(): boolean {
  return PROVIDER !== "none" && Boolean(process.env.OPENAI_API_KEY);
}

function apiKey(): string {
  const k = process.env.OPENAI_API_KEY;
  if (!k) throw new Error("AI is not configured");
  return k;
}

export interface ChatImage {
  /** data: URL (base64) or https URL. */
  url: string;
}

interface ChatOpts {
  system: string;
  user: string;
  images?: ChatImage[];
  maxTokens?: number;
  temperature?: number;
  vision?: boolean;
}

/**
 * Run a chat completion and parse a JSON object from the response.
 * Throws on network/parse errors so callers can present a graceful fallback.
 */
export async function chatJSON<T>(opts: ChatOpts): Promise<T> {
  const model = opts.vision ? VISION_MODEL : TEXT_MODEL;
  const userContent: unknown = opts.images?.length
    ? [
        { type: "text", text: opts.user },
        ...opts.images.map((img) => ({ type: "image_url", image_url: { url: img.url, detail: "low" } })),
      ]
    : opts.user;

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey()}` },
    body: JSON.stringify({
      model,
      temperature: opts.temperature ?? 0.2,
      max_tokens: opts.maxTokens ?? 700,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const status = res.status;
    throw new Error(`AI provider error (${status})`);
  }
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  return JSON.parse(text) as T;
}

/** Generate embeddings for one or more texts. Throws if not configured. */
export async function embed(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${BASE_URL}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey()}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Embedding error (${res.status})`);
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.data ?? []).map((d: any) => d.embedding as number[]);
}

export async function embedOne(text: string): Promise<number[]> {
  const [v] = await embed([text]);
  return v;
}
