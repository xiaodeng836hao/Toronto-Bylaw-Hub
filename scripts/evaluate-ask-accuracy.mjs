// ─────────────────────────────────────────────────────────────────────────────
//  Ask BylawGuide accuracy evaluation (V6.7) — `npm run eval:ask`
//
//  Deterministic regression harness for the Ask section retriever. It mirrors the
//  runtime pipeline in lib/ask/* (classify → route → score sections → §629
//  selector) using the SAME data files, and checks each case in
//  data/ask/ask-evaluation-cases.ts for the expected topic / chapter / section.
//  Pure data-driven — no AI key required. Run after changing bylaw MD, keywords,
//  routing, or synonyms. (Node ≥ 22 strips the imported TS types.)
// ─────────────────────────────────────────────────────────────────────────────

import idx from "../data/rag/bylaw-section-index.json" with { type: "json" };
import { photoReviewBylawMap } from "../data/photo-review-bylaw-map.ts";
import { CATEGORY_SOURCE_ROUTING } from "../data/photo-review/category-source-routing.ts";
import { propertyStandardsKeywordGroups } from "../data/photo-review/property-standards-keywords.ts";
import { expandQuery } from "../data/ask/synonyms.ts";
import { askEvaluationCases } from "../data/ask/ask-evaluation-cases.ts";

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
const hasWord = (h, w) => new RegExp(`(?:^|[^a-z0-9])${w.replace(/[-]/g, "\\-")}(?:[^a-z0-9]|$)`).test(h);
function contains(h, term) {
  const t = norm(term);
  if (!t) return false;
  if (!t.includes(" ")) return hasWord(h, t);
  if (h.includes(t)) return true;
  const sig = t.split(" ").filter((w) => w.length >= 4);
  return sig.length >= 2 && sig.every((w) => hasWord(h, w));
}

// Chapter → visual keywords (mirrors section-keyword-builder).
const chapterVisual = {};
for (const cat of photoReviewBylawMap) {
  if (!cat.chapterSlug) continue;
  (chapterVisual[cat.chapterSlug] ??= new Set());
  for (const k of [...cat.triggerKeywords, ...cat.aiLabels]) chapterVisual[cat.chapterSlug].add(k.toLowerCase());
}

const NOISE_RE = /\bnoise\b|\bnoisy\b|\bloud\b|\bbarking\b|amplified/;

// Topic classification (mirrors bylaw-matcher word-boundary scoring + pool gating).
function classify(query) {
  const q = norm(expandQuery(query));
  if (NOISE_RE.test(query.toLowerCase())) return { topicId: null, topicLabel: "Noise", isNoise: true };
  let best = null;
  for (const cat of photoReviewBylawMap.filter((c) => !c.comingSoon)) {
    let score = 0; let pool = false;
    for (const l of cat.aiLabels) if (contains(q, l)) { score += 5; if (/pool/.test(l)) pool = true; }
    for (const k of cat.triggerKeywords) if (contains(q, k)) { score += 2; if (/pool/.test(k)) pool = true; }
    if (cat.poolOnly && !pool) continue;
    if (score > 0 && (!best || score > best.score)) best = { topicId: cat.id, topicLabel: cat.issueCategory, score };
  }
  return best ? { ...best, isNoise: false } : { topicId: null, topicLabel: null, isNoise: false };
}

function routedChapters(topicId) {
  const r = CATEGORY_SOURCE_ROUTING[topicId];
  if (!r) return [];
  const out = []; const seen = new Set();
  for (const c of r.primary) if (!seen.has(c)) { seen.add(c); out.push({ chapter: c, primary: true }); }
  for (const c of r.secondary) if (!seen.has(c)) { seen.add(c); out.push({ chapter: c, primary: false }); }
  return out.filter((c) => idx.some((s) => s.chapterNumber === c.chapter && s.hasBody));
}

const STOP = new Set(["the", "and", "for", "any", "with", "that", "this", "from", "are", "what", "which", "section", "applies", "apply", "does", "can", "how", "when", "where", "about", "bylaw", "by-law", "toronto", "rule", "rules", "need", "needs", "your"]);
const tokenize = (s) => [...new Set(norm(s).split(" ").filter((w) => w.length >= 4 && !STOP.has(w)))];

function scoreSection(sec, tokens, phrases, primary) {
  const tw = new Set(norm(sec.sectionTitle).split(" "));
  const kw = new Set(sec.keywords);
  const visual = chapterVisual[sec.chapterNumber] ?? new Set();
  const bw = new Set(norm(sec.sourceText).split(" "));
  let score = 0;
  for (const t of tokens) {
    if (tw.has(t)) score += 3; else if (kw.has(t)) score += 2; else if (bw.has(t)) score += 1;
    if (visual.has(t)) score += 1;
  }
  const hay = `${norm(sec.sectionTitle)} ${norm(sec.sourceText)}`;
  for (const p of phrases) if (p.length >= 5 && hay.includes(p)) score += 4;
  if (score > 0 && primary) score += 1;
  return score;
}

// §629 property-standards selector (mirrors property-standards-selector).
const PSW = { sectionTerm: 40, visual: 35, resident: 25, technical: 20, title: 30, multi: 20, neg: -35 };
function scoreGroup(g, h) {
  const count = (list, cap) => { let n = 0; for (const kw of list) { if (contains(h, kw)) { n++; if (n >= cap) break; } } return n; };
  const vis = count(g.visualKeywords, 4), res = count(g.residentKeywords, 3), tech = count(g.technicalKeywords, 3), terms = count(g.sectionTerms, 2);
  let s = vis * PSW.visual + res * PSW.resident + tech * PSW.technical + terms * PSW.sectionTerm;
  const titleHit = norm(g.sectionTitle).split(" ").filter((w) => w.length >= 5).some((w) => h.includes(w));
  if (vis + res + tech + terms >= 1 && titleHit) s += PSW.title;
  if (vis + res + tech + terms >= 2) s += PSW.multi;
  s += count(g.negativeKeywords ?? [], 3) * PSW.neg;
  return s;
}

function retrieve(query) {
  const cls = classify(query);
  if (cls.isNoise) return { topicLabel: "Noise", isNoise: true, top: [] };
  const tokens = tokenize(expandQuery(query));
  const phrases = [norm(query)].filter((p) => p.length >= 5);
  const routed = routedChapters(cls.topicId);
  // Broad fallback: when no topic routes, search every indexed chapter (mirrors runtime).
  const allChapters = [...new Set(idx.filter((s) => s.hasBody).map((s) => s.chapterNumber))].map((c) => ({ chapter: c, primary: false }));
  const candidates = routed.length ? routed : (cls.topicId === null ? allChapters : []);
  const scored = candidates
    .flatMap(({ chapter, primary }) => idx.filter((s) => s.chapterNumber === chapter && s.hasBody).map((s) => ({ s, score: scoreSection(s, tokens, phrases, primary) })))
    .filter((x) => x.score >= 3).sort((a, b) => b.score - a.score);

  if (cls.topicId === "property-standards" || candidates.some((c) => c.chapter === "629")) {
    const h = norm(expandQuery(query));
    const ps = propertyStandardsKeywordGroups.map((g) => ({ g, score: scoreGroup(g, h) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
    if (ps.length) {
      const psTop = ps.slice(0, 3).map((x) => ({ chapter: "629", section: `§ ${x.g.section}`, score: x.score }));
      return { topicLabel: cls.topicLabel, isNoise: false, top: psTop };
    }
  }
  return { topicLabel: cls.topicLabel, isNoise: false, top: scored.slice(0, 5).map((x) => ({ chapter: x.s.chapterNumber, section: x.s.sectionNumber, score: x.score })) };
}

let pass = 0;
const fails = [];
for (const c of askEvaluationCases) {
  const r = retrieve(c.question);
  let ok = true;
  const reasons = [];
  if (c.expectNoise) {
    ok = r.isNoise;
    if (!ok) reasons.push("expected noise placeholder");
  } else {
    if (r.isNoise) { ok = false; reasons.push("wrongly classified as noise"); }
    if (c.expectedChapter) {
      const inTop = r.top.slice(0, 3).some((t) => t.chapter === c.expectedChapter);
      if (!inTop) { ok = false; reasons.push(`expected chapter ${c.expectedChapter}, top=${r.top.slice(0, 3).map((t) => t.chapter).join(",") || "none"}`); }
    }
    if (c.expectedSectionContains) {
      const inTop = r.top.slice(0, 3).some((t) => (t.section || "").includes(c.expectedSectionContains));
      if (!inTop) { ok = false; reasons.push(`expected section ~${c.expectedSectionContains}, top=${r.top.slice(0, 3).map((t) => t.section).join(",") || "none"}`); }
    }
  }
  if (ok) pass++; else fails.push({ q: c.question, reasons });
  const mark = ok ? "PASS" : "FAIL";
  const detail = c.expectNoise ? "noise→ComingSoon" : `${r.topicLabel ?? "—"} | ${r.top.slice(0, 2).map((t) => t.section || t.chapter).join(", ") || "no section"}`;
  console.log(`${mark}  ${c.question}\n      → ${detail}${ok ? "" : "  [" + fails.at(-1).reasons.join("; ") + "]"}`);
}

console.log(`\n${pass}/${askEvaluationCases.length} cases passed`);
if (pass < askEvaluationCases.length) process.exit(1);
