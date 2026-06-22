"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles, Search, ArrowRight, ExternalLink, FileText, BookOpen,
  Clock, Info, Lightbulb, ListChecks, ThumbsUp, ThumbsDown, CheckCircle2,
  Link2, Compass, AlertTriangle,
} from "lucide-react";
import { answerQuestion, type AskResult, type AskConfidence } from "@/lib/ask";
import type { KnowledgeItem } from "@/data/knowledge-index";
import AnswerDisclaimer from "@/components/AnswerDisclaimer";

const PLACEHOLDER = "e.g. Can I pave my entire front yard?";

const EXAMPLE_QUESTIONS = [
  "Can I pave my entire front yard?",
  "How high can my fence be?",
  "Do I need a pool fence enclosure permit?",
  "What counts as soft landscaping?",
  "How do I remove giant hogweed safely?",
  "What should I do about graffiti on private property?",
  "What bylaw applies to no heat in a rental unit?",
];

const CHIPS: { label: string; q: string }[] = [
  { label: "Fence height", q: "How high can my fence be?" },
  { label: "Pool fence permit", q: "Do I need a pool fence enclosure permit?" },
  { label: "Soft landscaping", q: "What counts as soft landscaping?" },
  { label: "Front yard parking", q: "Can I park in my front yard?" },
  { label: "Graffiti removal", q: "What should I do about graffiti on private property?" },
  { label: "Prohibited plants", q: "What are Toronto's prohibited plants?" },
  { label: "Dust control", q: "What bylaw applies to dust from construction?" },
  { label: "Property standards", q: "What are property standards?" },
  { label: "Heating / vital services", q: "What applies to no heat in a rental unit?" },
  { label: "Zoning setbacks", q: "What are the zoning setbacks for my house?" },
];

const CONFIDENCE_META: Record<AskConfidence, { label: string; cls: string; note: string }> = {
  high: { label: "Strong source match", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/15", note: "A clear related topic was found in the guide." },
  medium: { label: "Possible match", cls: "bg-blue-50 text-blue-700 ring-blue-600/15", note: "A related topic was found — verify it fits your situation." },
  low: { label: "Weak match", cls: "bg-amber-50 text-amber-700 ring-amber-600/15", note: "This may be related, but the source match is not strong. Please verify with official City sources." },
};

export default function AskClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // The URL's ?q= is the source of truth for the active query/answer.
  const urlQuery = searchParams.get("q") ?? "";
  const [input, setInput] = useState(urlQuery);

  // Sync the editable input when the URL query changes externally (prefilled
  // links, navbar) — React's "adjust state during render" pattern, no effect.
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    setInput(urlQuery);
  }

  const result: AskResult | null = useMemo(
    () => (urlQuery.trim() ? answerQuestion(urlQuery) : null),
    [urlQuery]
  );

  const runQuery = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      setInput(trimmed);
      router.replace(trimmed ? `/ask?q=${encodeURIComponent(trimmed)}` : "/ask", { scroll: false });
    },
    [router]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700 ring-1 ring-inset ring-blue-600/10 mb-4">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Source-based reference</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Ask BylawGuide</h1>
        <p className="text-gray-500 max-w-2xl">
          Ask simple questions about selected Toronto bylaw topics and get source-based reference answers. This is
          not legal advice or an official City determination — answers are summarized from this guide and link to official sources.
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); runQuery(input); }}
        role="search"
        className="relative mb-4"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        <label htmlFor="ask-input" className="sr-only">Ask a bylaw question</label>
        <input
          id="ask-input"
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={PLACEHOLDER}
          autoFocus
          className="w-full pl-12 pr-24 py-3.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 transition-colors"
        />
        <button
          type="submit"
          className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg"
        >
          Ask <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </form>

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Suggested questions">
        <span className="text-xs text-gray-400 self-center">Try:</span>
        {CHIPS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => runQuery(c.q)}
            className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {!result && <EmptyIntro onPick={runQuery} />}
      {result && <AnswerView result={result} onPick={runQuery} />}

      {/* Standing notice */}
      <div className="mt-10 p-4 rounded-xl border border-blue-100 bg-blue-50/60 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-blue-900">
          BylawGuide is an independent public reference tool — it is <span className="font-medium">not</span> the City of Toronto and does not provide legal
          advice or official determinations. Always confirm with official City of Toronto sources.
        </p>
      </div>
    </div>
  );
}

// ── Empty / intro state ─────────────────────────────────────────────────────
function EmptyIntro({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
      <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
        <Lightbulb className="w-4 h-4 text-blue-500" aria-hidden="true" /> Example questions
      </p>
      <ul className="flex flex-col gap-2">
        {EXAMPLE_QUESTIONS.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onPick(q)}
              className="group w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
              {q}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Answer view ─────────────────────────────────────────────────────────────
function AnswerView({ result, onPick }: { result: AskResult; onPick: (q: string) => void }) {
  if (result.status === "noise") {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/40 p-6 flex items-start gap-3">
        <Clock className="w-6 h-6 text-amber-500 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold text-gray-900 mb-1">Noise Complaints — Coming Soon</p>
          <p className="text-sm text-gray-600">Noise Complaints content is currently under development.</p>
          <Link href="/noise-complaints" className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
            View status <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  if (result.status === "none" || !result.answer) {
    return <NoResult query={result.query} />;
  }

  const a = result.answer;
  const conf = result.confidence ? CONFIDENCE_META[result.confidence] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Low-confidence banner */}
      {result.status === "low-confidence" && (
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-800">
            This may be related, but the source match is not strong. Please verify with official City sources or try simpler keywords.
          </p>
        </div>
      )}

      {/* Primary answer card */}
      <article className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15">
            {a.type}
          </span>
          {a.relatedChapter && <span className="text-xs text-gray-500">{a.relatedChapter}</span>}
          {a.relatedSections.map((s) => (
            <span key={s} className="font-mono text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{s}</span>
          ))}
          {conf && (
            <span className={`ml-auto inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${conf.cls}`}>
              {conf.label}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-2">{a.title}</h2>

        {/* Short answer */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 mb-4">
          <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-1">Reference answer</p>
          <p className="text-sm text-gray-800 leading-relaxed">{a.plainLanguageAnswer}</p>
        </div>

        {/* Source note */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3 h-3" aria-hidden="true" /> Source-based summary
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{a.sourceText}</p>
        </div>

        {/* Next steps */}
        {a.nextSteps.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" /> Practical next steps
            </p>
            <ul className="flex flex-col gap-1.5">
              {a.nextSteps.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Internal + official actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={a.internalUrl}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" aria-hidden="true" /> Open related guide
          </Link>
          {a.officialSources.slice(0, 1).map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official source
            </a>
          ))}
        </div>
      </article>

      {/* Sources used panel */}
      <section aria-label="Sources used" className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" aria-hidden="true" /> Sources used
        </h3>
        <p className="text-sm text-gray-500 mb-4">This answer is based on the following BylawGuide content and official sources.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Internal source */}
          <Link href={a.internalUrl} className="group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
            <div>
              <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{a.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">BylawGuide · {a.type}</p>
              <p className="text-[11px] text-gray-400 mt-1">Last reviewed {a.lastReviewed}</p>
            </div>
            <Link2 className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
          </Link>
          {/* Official sources */}
          {a.officialSources.map((src) => (
            <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{src.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{src.type ?? "Official source"}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <AnswerDisclaimer cautionLevel={a.cautionLevel} />

      {/* Feedback */}
      <AskFeedback query={result.query} answerId={a.id} />

      {/* Related topics */}
      {result.related.length > 0 && (
        <section aria-label="Related topics">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-500" aria-hidden="true" /> Related topics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.related.map((r) => (
              <RelatedCard key={r.id} item={r} onPick={onPick} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function RelatedCard({ item, onPick }: { item: KnowledgeItem; onPick: (q: string) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200">{item.type}</span>
      </div>
      <button type="button" onClick={() => onPick(item.title)} className="text-left text-sm font-semibold text-gray-900 hover:text-blue-700 transition-colors">
        {item.title}
      </button>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
      <Link href={item.internalUrl} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-auto">
        Open guide <ArrowRight className="w-3 h-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

// ── No-result state ─────────────────────────────────────────────────────────
function NoResult({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-8 text-center">
      <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" aria-hidden="true" />
      <p className="font-semibold text-gray-700 mb-1">I couldn&apos;t find a clear match in the current guide</p>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
        I could not find a clear source-based answer for &ldquo;{query}&rdquo; in the current BylawGuide content. Please check the official
        City of Toronto source or try a different search term.
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <Link href="/tmc-chapters" className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">Browse Bylaw Chapters</Link>
        <Link href="/zoning" className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Zoning</Link>
        <Link href="/search" className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Search the site</Link>
        <Link href="/feedback" className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Suggest missing content</Link>
      </div>
    </div>
  );
}

// ── Feedback control ────────────────────────────────────────────────────────
function AskFeedback({ query, answerId }: { query: string; answerId: string }) {
  const [choice, setChoice] = useState<null | "yes" | "no">(null);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const send = async (helpful: boolean, withComment: string) => {
    try {
      await fetch("/api/ask-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, answerId, helpful, comment: withComment }),
      });
    } catch {
      // Non-blocking: feedback is best-effort.
    }
  };

  if (sent) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700 px-1">
        <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Thanks — your feedback helps improve this guide.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Was this answer helpful?</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setChoice("yes"); send(true, ""); setSent(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" /> Yes
          </button>
          <button
            type="button"
            onClick={() => setChoice("no")}
            aria-pressed={choice === "no"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors ${choice === "no" ? "border-rose-300 text-rose-700 bg-rose-50" : "border-gray-200 bg-white text-gray-700 hover:border-rose-300 hover:text-rose-700"}`}
          >
            <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" /> No
          </button>
        </div>
      </div>
      {choice === "no" && (
        <form
          onSubmit={(e) => { e.preventDefault(); send(false, comment); setSent(true); }}
          className="mt-3"
        >
          <label htmlFor="ask-fb" className="block text-xs text-gray-500 mb-1.5">What was missing or unclear? (optional)</label>
          <textarea
            id="ask-fb"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            maxLength={1000}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400"
            placeholder="Tell us what would have helped…"
          />
          <button type="submit" className="btn-primary mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg">
            Send feedback
          </button>
        </form>
      )}
    </div>
  );
}
