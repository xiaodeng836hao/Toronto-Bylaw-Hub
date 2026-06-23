"use client";
import { useState, useRef, useEffect, useCallback, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle, X, Send, Sparkles, ArrowRight, ExternalLink, Loader2,
  BookOpen, Clock, Info,
} from "lucide-react";
import { askBylawGuide, type AskApiResponse } from "@/lib/ask/client";
import { answerQuestion, type AskResult } from "@/lib/ask";

const CHIPS: { label: string; q: string }[] = [
  { label: "Fence height", q: "How high can a fence be in Toronto?" },
  { label: "Pool fence permit", q: "Do I need a pool fence enclosure permit?" },
  { label: "Soft landscaping", q: "What counts as soft landscaping?" },
  { label: "Front yard parking", q: "Can I park in my front yard?" },
  { label: "Broken window", q: "What section applies to a broken window?" },
  { label: "Missing handrail", q: "What section applies to a missing handrail?" },
  { label: "No heat", q: "What applies to no heat in a rental unit?" },
  { label: "Graffiti", q: "What should I do about graffiti on private property?" },
  { label: "Prohibited plants", q: "What are Toronto's prohibited plants?" },
  { label: "Dust control", q: "What bylaw applies to dust from construction?" },
];

const CONF_STYLE: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  medium: "bg-blue-50 text-blue-700 ring-blue-600/15",
  low: "bg-amber-50 text-amber-700 ring-amber-600/15",
};
const CONF_LABEL: Record<string, string> = { high: "Strong source match", medium: "Possible match", low: "Weak match" };

const DISCLAIMER = "Reference only. Not legal advice or an official City determination.";
const NO_SOURCE = "I could not find a clear source-based answer in the current guide.";

interface ResultState {
  query: string;
  api: AskApiResponse;
  local: AskResult;
}

export default function FloatingAskWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState("");

  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Sequence guard: a cleared/changed query invalidates an in-flight response.
  const reqIdRef = useRef(0);

  // Reset the answer area back to the initial chips/tip view.
  const reset = useCallback(() => {
    reqIdRef.current += 1; // ignore any in-flight response
    setResult(null);
    setError("");
    setLoading(false);
  }, []);

  // Esc closes the panel and returns focus to the button.
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t) && !buttonRef.current?.contains(t)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, close]);

  const submit = useCallback(async (q: string) => {
    const query = q.trim();
    if (!query) return;
    const id = ++reqIdRef.current;
    setInput(query);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const [api, local] = [await askBylawGuide(query, { currentPath: pathname }), answerQuestion(query)];
      if (reqIdRef.current !== id) return; // a newer query / a clear superseded this one
      setResult({ query, api, local });
    } catch {
      if (reqIdRef.current === id) setError("Something went wrong. Please try again.");
    } finally {
      if (reqIdRef.current === id) setLoading(false);
    }
  }, [pathname]);

  // Don't show on the full Ask page (the page already has this feature).
  if (pathname === "/ask") return null;

  return (
    <>
      {/* Floating button — the white pill never changes; only the gradient RING
          (and glow) shift colour on hover, by cross-fading two ring gradients. */}
      <div className="group fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-105 print:hidden">
        {/* Glow halo (hover palette) — fades in on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70"
        />
        {/* Ring A — rest palette (cool blue), fades OUT on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-70 transition-opacity duration-300 group-hover:opacity-0"
        />
        {/* Ring B — hover palette (magenta/violet), fades IN on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1.5px] rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ask BylawGuide"
          aria-expanded={open}
          aria-controls={panelId}
          className="relative inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-indigo-700 shadow-[0_8px_24px_-10px_rgba(37,99,235,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
          <span className="hidden sm:inline">Ask</span>
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label="Ask BylawGuide"
          className="fixed z-[60] bottom-[5.5rem] left-4 right-4 sm:left-auto sm:right-6 sm:w-[400px] max-h-[72vh] flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] print:hidden"
        >
          {/* Header */}
          <div className="flex items-start gap-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-3 border-b border-indigo-100">
            <Sparkles className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-indigo-900">Ask BylawGuide</p>
              <p className="text-xs text-indigo-700">Get a source-based reference answer.</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close Ask panel"
              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-indigo-500 hover:bg-white/70 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="px-4 pt-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">Ask a bylaw question</label>
            <div className="relative">
              <input
                id={`${panelId}-input`}
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  const v = e.target.value;
                  setInput(v);
                  // Clearing the box returns to the initial chips/tip view and
                  // cancels any in-flight answer so it can't pop back in.
                  if (!v.trim()) reset();
                }}
                placeholder="Ask about fences, zoning, property standards…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3.5 pr-11 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Ask"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </form>

          {/* Suggested chips (only before a result) */}
          {!result && !loading && (
            <div className="px-4 pt-3 flex flex-wrap gap-1.5">
              {CHIPS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => submit(c.q)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Answer area */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 py-6 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Searching sources…
              </div>
            )}
            {error && !loading && (
              <p className="text-sm text-rose-600 py-2">{error}</p>
            )}
            {result && !loading && <CompactAnswer state={result} onClose={close} />}
            {!result && !loading && !error && (
              <p className="text-xs text-gray-400 pt-1">
                Tip: ask a specific question, or tap a topic above. Answers are summarized from this guide and link to official sources.
              </p>
            )}
          </div>

          {/* Footer disclaimer */}
          <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-2.5">
            <p className="text-[11px] text-gray-500 leading-relaxed flex items-start gap-1.5">
              <Info className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              {DISCLAIMER}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ── Compact answer ──────────────────────────────────────────────────────────
function CompactAnswer({ state, onClose }: { state: ResultState; onClose: () => void }) {
  const { query, api, local } = state;

  // Noise → Coming Soon only.
  if (api.mode === "noise" || local.status === "noise") {
    return (
      <div className="flex items-start gap-2.5">
        <Clock className="h-5 w-5 text-amber-500 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-0.5">Noise Complaints — Coming Soon</p>
          <p className="text-sm text-gray-600">Noise Complaints content is currently under development.</p>
        </div>
      </div>
    );
  }

  const aiAnswer = api.mode === "ai-rag" ? api.answer ?? null : null;
  const localAns = local.status === "answer" || local.status === "low-confidence" ? local.answer : null;

  const answerText = aiAnswer?.shortAnswer || localAns?.plainLanguageAnswer || "";
  const explanation = aiAnswer?.explanation || (localAns ? localAns.summary : "");
  const confidence = aiAnswer?.confidence || local.confidence || null;

  // Prefer the precise section sources from the API; otherwise synthesize from
  // the local knowledge answer so an answer always shows its source.
  const sources = (api.sources && api.sources.length > 0)
    ? api.sources.slice(0, 2).map((s) => ({
        title: s.sourceTitle, section: s.section, internalUrl: s.internalUrl, officialUrl: s.officialUrl,
      }))
    : localAns
      ? [{ title: localAns.title, section: localAns.relatedSections[0] ?? null, internalUrl: localAns.internalUrl, officialUrl: localAns.officialSources[0]?.url ?? null }]
      : [];

  if (!answerText && sources.length === 0) {
    return (
      <div>
        <p className="text-sm text-gray-700">{NO_SOURCE}</p>
        <FullPageLink query={query} onClose={onClose} />
      </div>
    );
  }

  const isZoning = (api.topic ?? "").toLowerCase().includes("zoning")
    || localAns?.cautionLevel === "property-specific";

  return (
    <div className="flex flex-col gap-3">
      {confidence && (
        <span className={`self-start text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${CONF_STYLE[confidence]}`}>
          {CONF_LABEL[confidence]}
        </span>
      )}

      {answerText && <p className="text-sm font-medium text-gray-900 leading-relaxed">{answerText}</p>}
      {explanation && <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">{explanation}</p>}

      {/* Sources */}
      {sources.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <BookOpen className="h-3 w-3 text-blue-500" aria-hidden="true" /> Sources
          </p>
          <div className="flex flex-col gap-1.5">
            {sources.map((s, i) => (
              <div key={`${s.internalUrl}-${i}`} className="rounded-lg border border-gray-100 bg-gray-50/70 p-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-900">{s.title}</span>
                  {s.section && <span className="font-mono text-[10px] bg-white border border-gray-200 text-gray-700 px-1 py-0.5 rounded">{s.section}</span>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <Link href={s.internalUrl} onClick={onClose} className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700">
                    View page <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                  {s.officialUrl && (
                    <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 hover:text-gray-800">
                      Official source <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isZoning && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5">
          Zoning is property-specific. Verify with official City sources.
        </p>
      )}

      <FullPageLink query={query} onClose={onClose} />
    </div>
  );
}

function FullPageLink({ query, onClose }: { query: string; onClose: () => void }) {
  return (
    <Link
      href={`/ask?q=${encodeURIComponent(query)}`}
      onClick={onClose}
      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
    >
      Open full Ask page <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}
