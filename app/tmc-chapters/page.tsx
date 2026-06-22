"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { bylawChapters, tmcCategories } from "@/lib/mock-data";
import { getChapterContent } from "@/lib/chapter-content";
import type { BylawSection } from "@/app/api/bylaw-search/route";
import {
  Search, ExternalLink, Download, FileText, Loader2,
  BookOpen, X, ArrowRight,
} from "lucide-react";
import SourceBadge from "@/components/SourceBadge";

function HighlightedExcerpt({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <mark key={i} className="bg-yellow-100 text-yellow-900 rounded px-0.5 font-medium not-italic">
            {part.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function chapterBadge(chapterNumber: string) {
  return /^[\d-]+$/.test(chapterNumber) ? `Ch. ${chapterNumber}` : chapterNumber;
}

export default function TMCChaptersPage() {
  // PDF keyword search state
  const [pdfQuery, setPdfQuery] = useState("");
  const [pdfResults, setPdfResults] = useState<BylawSection[] | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [pdfSearched, setPdfSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Chapter browse state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");

  async function handlePdfSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!pdfQuery.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setPdfLoading(true);
    setPdfError("");
    setPdfSearched(true);

    try {
      const res = await fetch(`/api/bylaw-search?q=${encodeURIComponent(pdfQuery.trim())}`, {
        signal: ac.signal,
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setPdfResults(data.results);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") setPdfError("Search failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  function clearPdfSearch() {
    setPdfQuery("");
    setPdfResults(null);
    setPdfSearched(false);
    setPdfError("");
  }

  const filtered = bylawChapters.filter((ch) => {
    const matchesCategory = category === "All" || ch.category === category;
    const q = search.trim().toLowerCase();
    if (!q) return matchesCategory;

    // Search across base fields + the richer chapter content (key requirements,
    // common questions, compliance steps, related topics, tags).
    const content = getChapterContent(ch.slug);
    const haystack = [
      ch.title, ch.chapterNumber, ch.plainLanguageSummary,
      ...ch.tags, ...ch.relatedIssueTypes,
      content?.plainLanguageOverview ?? "",
      ...(content?.keyRequirements.flatMap((r) => [r.title, r.plainLanguageExplanation, r.sectionReference]) ?? []),
      ...(content?.commonQuestions.flatMap((c) => [c.question, c.answer]) ?? []),
      ...(content?.practicalComplianceSteps.flatMap((s) => [s.title, s.description]) ?? []),
      ...(content?.relatedTopics.map((t) => t.label) ?? []),
    ].join(" ").toLowerCase();

    const terms = q.split(/\s+/).filter(Boolean);
    return matchesCategory && terms.every((t) => haystack.includes(t));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ── Page header ── */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/10 mb-4">
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Toronto Municipal Code</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Toronto Municipal Code Chapters
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Browse major Toronto Municipal Code chapters with simple summaries, common examples, and links to official sources. All descriptions are for general reference only.
        </p>
        <SourceBadge className="mt-4" />
      </div>

      {/* ── PDF Keyword Search ── */}
      <section aria-label="Search bylaw sections by keyword" className="bg-white rounded-2xl border border-blue-100 subtle-shadow mb-10">
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <h2 className="font-semibold text-gray-900 text-sm">Search Bylaw Sections by Keyword</h2>
          </div>
          <p className="text-xs text-gray-400">
            Searches directly inside official bylaw PDFs and returns matching sections with exact text. Try: <em>&ldquo;broken downpipe&rdquo;</em>, <em>&ldquo;grass height&rdquo;</em>, <em>&ldquo;pool gate&rdquo;</em>, <em>&ldquo;graffiti removal&rdquo;</em>
          </p>
        </div>

        <div className="p-5">
          <form onSubmit={handlePdfSearch} role="search" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <label htmlFor="pdf-search" className="sr-only">Search bylaw section text</label>
              <input
                id="pdf-search"
                type="search"
                value={pdfQuery}
                onChange={(e) => setPdfQuery(e.target.value)}
                placeholder='e.g. "broken downpipe", "long grass", "pool enclosure gate"'
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors"
              />
              {pdfQuery && (
                <button type="button" onClick={clearPdfSearch} aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={pdfLoading || !pdfQuery.trim()}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>

          {!pdfSearched && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-gray-400 self-center">Try:</span>
              {["broken downpipe", "grass height", "pool gate latch", "graffiti", "eavestrough", "garbage bin", "fence height"].map((ex) => (
                <button key={ex} type="button"
                  onClick={() => { setPdfQuery(ex); setTimeout(() => handlePdfSearch(), 50); }}
                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 text-xs rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors">
                  {ex}
                </button>
              ))}
            </div>
          )}

          {pdfLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching inside PDF files…
            </div>
          )}

          {pdfError && <p className="mt-4 text-sm text-red-500">{pdfError}</p>}

          {pdfSearched && !pdfLoading && pdfResults !== null && (
            <div className="mt-5">
              {pdfResults.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-20" aria-hidden="true" />
                  <p className="text-sm">No matching sections found for <strong>&ldquo;{pdfQuery}&rdquo;</strong>.</p>
                  <p className="text-xs mt-1">Try different keywords or browse the chapter list below.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-3" aria-live="polite">
                    {pdfResults.length} section{pdfResults.length !== 1 ? "s" : ""} found for <strong>&ldquo;{pdfQuery}&rdquo;</strong>
                  </p>
                  <div className="flex flex-col gap-3">
                    {pdfResults.map((r, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:bg-white hover:border-blue-100 hover:subtle-shadow transition-all">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm font-bold text-blue-700">{r.sectionCode}</span>
                              <span className="text-sm font-semibold text-gray-900">{r.sectionTitle}</span>
                            </div>
                            <span className="text-xs text-gray-400 mt-0.5 block">
                              Chapter {r.chapterNumber} – {r.chapterTitle}
                            </span>
                          </div>
                          <a
                            href={`/pdfs/${r.pdfFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            PDF
                          </a>
                        </div>
                        {r.sectionText && (
                          <div className="mt-2 max-h-72 overflow-y-auto rounded-lg bg-white border border-gray-100 px-3.5 py-3">
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                              <HighlightedExcerpt text={r.sectionText} />
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-4 h-4 text-gray-400" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Browse All Chapters</h2>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* ── Chapter Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="chapter-filter" className="sr-only">Filter chapters</label>
          <input
            id="chapter-filter"
            type="search"
            placeholder="Filter chapters by number, title, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-400 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by category">
          {tmcCategories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-5" aria-live="polite">
        {filtered.length} chapter{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* ── Chapter Cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
          <p>No chapters match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((ch) => (
            <article key={ch.slug} className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 sm:p-6 flex flex-col">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 text-center flex-shrink-0 whitespace-nowrap ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                  {chapterBadge(ch.chapterNumber)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 leading-snug">
                    <Link
                      href={`/tmc-chapters/${ch.slug}`}
                      className="hover:text-blue-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {ch.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ch.plainLanguageSummary}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ch.category}</span>
                {ch.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/tmc-chapters/${ch.slug}`}
                  className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg"
                >
                  View Chapter <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <a href={ch.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official Source
                </a>
                {ch.pdfUrl && (
                  <a href={ch.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-3.5 h-3.5" aria-hidden="true" /> PDF
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
