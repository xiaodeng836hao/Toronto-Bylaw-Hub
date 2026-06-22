#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — RAG ingestion (V6)
//
//  Builds the local embedding index at data/rag/index.json from the parsed
//  Municipal Code sections (lib/bylaw-sections.json). Safe to re-run (overwrites).
//
//  Usage:   OPENAI_API_KEY=sk-... node scripts/ingest-rag.mjs
//  Without a key it prints guidance and exits 0 (the app falls back to keyword
//  retrieval). For production, see RAG_SOURCE_MAINTENANCE.md (pgvector path).
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "rag", "index.json");
const MODEL = process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small";
const BASE_URL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const KEY = process.env.OPENAI_API_KEY;

if (!KEY || process.env.AI_PROVIDER === "none") {
  console.log("[ingest-rag] No OPENAI_API_KEY found — skipping embedding build.");
  console.log("[ingest-rag] The app will use keyword retrieval until an index is built.");
  process.exit(0);
}

function chunkText(text, maxChars = 900, overlap = 120) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (!clean) return [];
  if (clean.length <= maxChars) return [clean];
  const sentences = clean.match(/[^.!?]+[.!?]?/g) || [clean];
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > maxChars && current) {
      chunks.push(current.trim());
      current = overlap > 0 ? current.slice(-overlap) + s : s;
    } else current += s;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function buildChunks() {
  const sections = JSON.parse(readFileSync(path.join(ROOT, "lib", "bylaw-sections.json"), "utf8"));
  const out = [];
  const seen = new Set();
  for (const s of sections) {
    const body = (s.body || "").trim();
    if (body.length < 40) continue;
    const header = `${s.chapterTitle} — ${s.sectionCode} ${s.sectionTitle}`.trim();
    chunkText(body).forEach((text, i) => {
      const id = `${s.chapterNumber}:${s.sectionCode}:${i}`;
      if (seen.has(id)) return;
      seen.add(id);
      out.push({ id, chapter: s.chapterNumber, section: s.sectionCode, sectionTitle: s.sectionTitle, text: `${header}\n${text}` });
    });
  }
  return out;
}

async function embedBatch(texts) {
  const res = await fetch(`${BASE_URL}/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ model: MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Embedding API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.data.map((d) => d.embedding);
}

async function main() {
  const chunks = buildChunks();
  console.log(`[ingest-rag] Built ${chunks.length} chunks. Embedding with ${MODEL}…`);
  const BATCH = 96;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const vectors = await embedBatch(batch.map((c) => c.text));
    batch.forEach((c, j) => { c.embedding = vectors[j]; });
    console.log(`[ingest-rag] Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ model: MODEL, createdAt: new Date().toISOString(), chunks }, null, 0));
  console.log(`[ingest-rag] Wrote ${OUT} (${chunks.length} chunks).`);
}

main().catch((err) => { console.error("[ingest-rag] Failed:", err.message); process.exit(1); });
