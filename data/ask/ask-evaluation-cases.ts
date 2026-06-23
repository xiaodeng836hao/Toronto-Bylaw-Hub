// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Ask accuracy evaluation cases (V6.7)
//
//  Manual regression set for `npm run eval:ask` (scripts/evaluate-ask-accuracy.mjs).
//  Each case asserts the topic + chapter the section retriever should pick, and —
//  where the section is in the Markdown index — the section number it should
//  surface. Cases for chapters not yet in the corpus (Dust 417, Zoning) assert
//  topic only. Keep `expectedSectionContains` to a REAL section from the source.
// ─────────────────────────────────────────────────────────────────────────────

export interface AskEvalCase {
  question: string;
  expectedTopic: string;
  /** Chapter number the top source should come from (omit if not indexed). */
  expectedChapter?: string;
  /** Substring the matched section number should contain, e.g. "629-21". */
  expectedSectionContains?: string;
  /** Noise → Coming Soon only; no section retrieval. */
  expectNoise?: boolean;
}

export const askEvaluationCases: AskEvalCase[] = [
  // ── Property Standards (Chapter 629) ──
  { question: "What section applies to a leaking ceiling?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-27" },
  { question: "What section applies to a broken window?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-21" },
  { question: "What section applies to a missing handrail?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-19" },
  { question: "What section applies to a bathroom fan not working?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-39" },
  { question: "What section applies to a clogged toilet?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-37" },
  { question: "What section applies to broken kitchen cupboards?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-34" },
  { question: "What section applies to an exposed electrical wire?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-35" },
  { question: "What section applies to a leaking roof gutter?", expectedTopic: "Property Standards", expectedChapter: "629", expectedSectionContains: "629-20" },

  // ── Fence (Chapter 447) ──
  { question: "How high can a front yard fence be?", expectedTopic: "Fence", expectedChapter: "447", expectedSectionContains: "447-1.2" },
  { question: "Does a pool gate need to self-close?", expectedTopic: "Pool Fence / Pool Enclosure", expectedChapter: "447", expectedSectionContains: "447-1.3" },
  { question: "What kind of fence material is allowed?", expectedTopic: "Fence", expectedChapter: "447", expectedSectionContains: "447-1.2" },

  // ── Waste / Graffiti (548 / 485) ──
  { question: "What bylaw applies to garbage bags left outside?", expectedTopic: "Waste / Littering / Dumping", expectedChapter: "548" },
  { question: "What bylaw applies to graffiti on a wall?", expectedTopic: "Graffiti", expectedChapter: "485" },

  // ── Prohibited plants / weeds (Chapter 489) ──
  { question: "What are Toronto's prohibited plants?", expectedTopic: "Turfgrass / Prohibited Plants", expectedChapter: "489" },
  { question: "Is giant hogweed prohibited?", expectedTopic: "Turfgrass / Prohibited Plants", expectedChapter: "489" },

  // ── Not yet in the Markdown corpus — topic only ──
  { question: "What does the dust bylaw require?", expectedTopic: "Dust" },
  { question: "Can I park in my front yard?", expectedTopic: "Zoning Concern" },

  // ── Noise → Coming Soon only ──
  { question: "How do I file a noise complaint?", expectedTopic: "Noise", expectNoise: true },
];
