import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  bylawChapters, getChapterBySlug, OFFICIAL_311_URL,
} from "@/lib/mock-data";
import { getChapterContent, type ComplexityLevel, type RelatedTopic } from "@/lib/chapter-content";
import SourceBadge from "@/components/SourceBadge";
import {
  FENCE_HEIGHT_TABLE, FENCE_HEIGHT_MEASUREMENT_NOTE, FENCE_SCHOOL_NOTE,
  FENCE_RESTRICTIONS, FENCE_DRIVEWAY_VISIBILITY, FENCE_DECK_RULES, POOL_FENCE_REDIRECT,
} from "@/lib/fence-447";
import FenceHeightHelper from "./FenceHeightHelper";
import {
  ArrowLeft, ArrowRight, ExternalLink, Download, FileText, ListChecks,
  HelpCircle, AlertCircle, Users, Tag, BookOpen, ChevronRight, Info, Phone,
  ClipboardCheck, Wrench, AlertTriangle, CheckCircle2, XCircle, Layers, Compass, Hash,
  Ruler, Waves, Car, SquareStack, Ban,
} from "lucide-react";

export function generateStaticParams() {
  return bylawChapters.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ chapter: string }> }
): Promise<Metadata> {
  const { chapter } = await params;
  const ch = getChapterBySlug(chapter);
  if (!ch) return { title: "Chapter Not Found" };
  const content = getChapterContent(ch.slug);
  return {
    title: `${ch.title} (Chapter ${ch.chapterNumber})`,
    description: content?.plainLanguageOverview ?? ch.plainLanguageSummary,
  };
}

const COMPLEXITY: Record<ComplexityLevel, { label: string; notice: string; box: string; chip: string }> = {
  simple: {
    label: "Focused chapter",
    notice: "This chapter is relatively focused. The key practical requirements are summarized below in simple terms.",
    box: "border-emerald-200 bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
  },
  moderate: {
    label: "Moderate chapter",
    notice: "This chapter covers a few related topics. The key practical requirements are summarized below in simple terms; review the official bylaw for full details.",
    box: "border-amber-200 bg-amber-50",
    chip: "bg-amber-100 text-amber-700",
  },
  complex: {
    label: "Complex chapter",
    notice: "This chapter is complex. This page summarizes common resident-facing requirements only. Always review the official bylaw for complete requirements.",
    box: "border-indigo-200 bg-indigo-50",
    chip: "bg-indigo-100 text-indigo-700",
  },
};

function RelatedTopicLink({ topic }: { topic: RelatedTopic }) {
  const inner = (
    <>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{topic.label}</p>
        {topic.description && <p className="text-xs text-gray-500 mt-0.5">{topic.description}</p>}
      </div>
      {topic.external
        ? <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
        : <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />}
    </>
  );
  const cls = "group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 subtle-shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";
  return topic.external
    ? <a href={topic.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
    : <Link href={topic.href} className={cls}>{inner}</Link>;
}

export default async function ChapterDetailPage(
  { params }: { params: Promise<{ chapter: string }> }
) {
  const { chapter } = await params;
  const ch = getChapterBySlug(chapter);
  if (!ch) notFound();

  const content = getChapterContent(ch.slug);
  const related = ch.relatedChapters
    .map((slug) => getChapterBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const badge = /^[\d-]+$/.test(ch.chapterNumber) ? `Chapter ${ch.chapterNumber}` : ch.chapterNumber;
  const isFence = ch.slug === "447";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/tmc-chapters"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All TMC Chapters
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-semibold ring-1 ring-inset ring-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            {badge}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{ch.category}</span>
          {content && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${COMPLEXITY[content.complexityLevel].chip}`}>
              {COMPLEXITY[content.complexityLevel].label}
            </span>
          )}
          <span className="text-xs text-gray-400">{ch.codeRef}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{ch.title}</h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">{ch.plainLanguageSummary}</p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-5">
          <a href={ch.officialUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg">
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View Official Source
          </a>
          {ch.pdfUrl && (
            <a href={ch.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" aria-hidden="true" /> Download PDF
            </a>
          )}
          <a href={OFFICIAL_311_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Phone className="w-3.5 h-3.5" aria-hidden="true" /> Report through 311
          </a>
        </div>
        <SourceBadge className="mt-5" />
      </header>

      {/* Complexity notice */}
      {content && (
        <div className={`mb-6 p-4 rounded-xl border flex gap-3 ${COMPLEXITY[content.complexityLevel].box}`}>
          <Layers className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-gray-700">{COMPLEXITY[content.complexityLevel].notice}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Simple Overview */}
          {content && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
                <BookOpen className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Simple Overview
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{content.plainLanguageOverview}</p>
              <p className="text-xs text-gray-500 mt-3"><span className="font-medium">Who it applies to:</span> {ch.whoItApplies}</p>
            </section>
          )}

          {/* Pool Fence redirect (447 only) */}
          {isFence && (
            <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                <Waves className="w-5 h-5 text-sky-600" aria-hidden="true" />
                {POOL_FENCE_REDIRECT.title}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{POOL_FENCE_REDIRECT.text}</p>
              <Link
                href={POOL_FENCE_REDIRECT.href}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {POOL_FENCE_REDIRECT.buttonLabel} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <p className="mt-3 text-xs text-sky-800/80">{POOL_FENCE_REDIRECT.note}</p>
            </section>
          )}

          {/* Key Requirements */}
          {content && content.keyRequirements.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <ClipboardCheck className="w-5 h-5 text-blue-500" aria-hidden="true" />
                {content.complexityLevel === "complex" ? "Top Practical Requirements" : "Key Requirements"}
              </h2>
              <div className="flex flex-col gap-4">
                {content.keyRequirements.map((r) => (
                  <div key={r.title} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm">{r.title}</h3>
                      <span className="inline-flex items-center gap-1 flex-shrink-0 text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        <Hash className="w-3 h-3" aria-hidden="true" />{r.sectionReference}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.plainLanguageExplanation}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Compliance looks like
                        </p>
                        <p className="text-xs text-emerald-900">{r.complianceExample}</p>
                      </div>
                      <div className="rounded-lg bg-rose-50 border border-rose-100 p-2.5">
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 uppercase tracking-wide mb-0.5">
                          <XCircle className="w-3 h-3" aria-hidden="true" /> May be a concern
                        </p>
                        <p className="text-xs text-rose-900">{r.nonComplianceExample}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Fence Height Requirements table (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <Ruler className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Fence Height Requirements
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Maximum fence heights from Chapter 447, § 447-1.2B, Table 1. Find the row that matches where your fence
                is, then read across to your property type (or the hedge column for vegetation).
              </p>

              {/* Desktop / tablet: table (fixed layout so columns stay balanced) */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full min-w-[560px] table-fixed text-left border-collapse">
                  <colgroup>
                    <col className="w-[5%]" />
                    <col className="w-[43%]" />
                    <col className="w-[18%]" />
                    <col className="w-[17%]" />
                    <col className="w-[17%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 text-[11px] uppercase tracking-wide text-gray-500 align-bottom">
                      <th className="p-2.5 font-semibold">#</th>
                      <th className="p-2.5 font-semibold">Fence situation / location</th>
                      <th className="p-2.5 font-semibold">
                        Residential
                        <span className="block normal-case tracking-normal text-[10px] text-gray-400 font-normal">single / multiple</span>
                      </th>
                      <th className="p-2.5 font-semibold">Non-residential</th>
                      <th className="p-2.5 font-semibold">Hedge / vegetation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {FENCE_HEIGHT_TABLE.map((r) => (
                      <tr key={r.item} className="align-top hover:bg-gray-50/60">
                        <td className="p-2.5 text-sm font-bold text-gray-400">{r.item}</td>
                        <td className="p-2.5">
                          <p className="text-sm font-medium text-gray-900">{r.situation}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{r.description}</p>
                        </td>
                        <td className="p-2.5 text-sm font-semibold text-gray-900">{r.residential}</td>
                        <td className="p-2.5 text-sm font-semibold text-gray-900">{r.nonResidential}</td>
                        <td className="p-2.5 text-sm font-semibold text-gray-700">{r.hedge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: stacked cards */}
              <div className="sm:hidden flex flex-col gap-3">
                {FENCE_HEIGHT_TABLE.map((r) => (
                  <div key={r.item} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex-shrink-0">{r.item}</span>
                      <p className="text-sm font-semibold text-gray-900">{r.situation}</p>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{r.description}</p>
                    <dl className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-gray-50 p-2">
                        <dt className="text-[10px] uppercase tracking-wide text-gray-400">Residential</dt>
                        <dd className="text-sm font-semibold text-gray-900">{r.residential}</dd>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2">
                        <dt className="text-[10px] uppercase tracking-wide text-gray-400">Non-res.</dt>
                        <dd className="text-sm font-semibold text-gray-900">{r.nonResidential}</dd>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-2">
                        <dt className="text-[10px] uppercase tracking-wide text-gray-400">Hedge</dt>
                        <dd className="text-sm font-semibold text-gray-700">{r.hedge}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl border border-gray-200 bg-gray-50 flex gap-2.5">
                <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p>{FENCE_HEIGHT_MEASUREMENT_NOTE}</p>
                  <p className="mt-1.5">{FENCE_SCHOOL_NOTE}</p>
                </div>
              </div>
            </section>
          )}

          {/* Fence Height Helper (447 only) */}
          {isFence && <FenceHeightHelper />}

          {/* General Fence Restrictions (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Ban className="w-5 h-5 text-rose-500" aria-hidden="true" />
                General Fence Restrictions
              </h2>
              <div className="flex flex-col gap-3">
                {FENCE_RESTRICTIONS.map((r) => (
                  <div key={r.title} className="rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{r.title}</h3>
                      <span className="inline-flex items-center gap-1 flex-shrink-0 text-[11px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        <Hash className="w-3 h-3" aria-hidden="true" />{r.sectionReference}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Driveways and Visibility (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <Car className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Driveways and Visibility
              </h2>
              <p className="text-xs text-gray-500 mb-4">{FENCE_DRIVEWAY_VISIBILITY.sectionReference}</p>
              <ul className="flex flex-col gap-2.5 mb-4">
                {FENCE_DRIVEWAY_VISIBILITY.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Practical example</p>
                <p className="text-sm text-blue-900">{FENCE_DRIVEWAY_VISIBILITY.example}</p>
              </div>
            </section>
          )}

          {/* Fences on Unroofed Decks (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <SquareStack className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Fences on Unroofed Decks
              </h2>
              <p className="text-xs text-gray-500 mb-4">{FENCE_DECK_RULES.sectionReference}</p>
              <ul className="flex flex-col gap-2.5 mb-4">
                {FENCE_DECK_RULES.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Practical example</p>
                <p className="text-sm text-blue-900">{FENCE_DECK_RULES.example}</p>
              </div>
            </section>
          )}

          {/* Practical Compliance Guide */}
          {content && content.practicalComplianceSteps.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Wrench className="w-5 h-5 text-blue-500" aria-hidden="true" />
                {ch.slug === "417" ? "How to Reduce or Eliminate Dust" : isFence ? "Before You Build or Replace a Fence" : "Practical Compliance Guide"}
              </h2>
              <ol className="flex flex-col gap-3">
                {content.practicalComplianceSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.title}</p>
                      <p className="text-sm text-gray-600">{s.description}</p>
                      {s.caution && (
                        <p className="mt-1 inline-flex items-start gap-1 text-xs text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" /> {s.caution}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Common Questions (answered) */}
          {content && content.commonQuestions.length > 0 ? (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <HelpCircle className="w-5 h-5 text-violet-500" aria-hidden="true" />
                Common Questions
              </h2>
              <div className="flex flex-col gap-3">
                {content.commonQuestions.map((q) => (
                  <details key={q.question} className="group rounded-xl border border-gray-100 bg-gray-50/60 overflow-hidden">
                    <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                      {q.question}
                      <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" />
                    </summary>
                    <div className="px-4 pb-4 pt-0 text-sm text-gray-700">
                      <p className="leading-relaxed">{q.answer}</p>
                      {q.sectionReference && (
                        <p className="mt-2 text-xs text-gray-500"><span className="font-medium">Reference:</span> {q.sectionReference}</p>
                      )}
                      {q.practicalNextStep && (
                        <p className="mt-1 inline-flex items-start gap-1 text-xs text-blue-700">
                          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" aria-hidden="true" /> {q.practicalNextStep}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <HelpCircle className="w-5 h-5 text-violet-500" aria-hidden="true" />
                Common Resident Questions
              </h2>
              <ul className="flex flex-col gap-2.5">
                {ch.commonResidentQuestions.map((q) => (
                  <li key={q}>
                    <Link
                      href={`/ask?q=${encodeURIComponent(q)}`}
                      className="group flex items-center justify-between gap-3 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 hover:bg-blue-50/60 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {q}
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-400">Tap a question to get a source-based reference answer on the Ask page.</p>
            </section>
          )}

          {/* What this covers */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <ListChecks className="w-5 h-5 text-blue-500" aria-hidden="true" />
              What This Chapter Generally Covers
            </h2>
            <ul className="flex flex-col gap-2.5">
              {ch.whatThisCovers.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Common examples */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" aria-hidden="true" />
              {isFence ? "Common Non-Compliance Examples" : "Common Examples"}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ch.commonExamples.map((ex) => (
                <li key={ex} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  {ex}
                </li>
              ))}
            </ul>
          </section>

          {/* Related Topics */}
          {content && content.relatedTopics.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Compass className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Related Topics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.relatedTopics.map((t) => (
                  <RelatedTopicLink key={t.label} topic={t} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Who it applies to */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
              <Users className="w-4 h-4 text-blue-500" aria-hidden="true" />
              Who It Applies To
            </h2>
            <p className="text-sm text-gray-600">{ch.whoItApplies}</p>
          </section>

          {/* Related issue types */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
              <Tag className="w-4 h-4 text-purple-500" aria-hidden="true" />
              Related Issue Types
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {ch.relatedIssueTypes.map((t) => (
                <span key={t} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <Link
              href="/photo-review"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Try the Photo Review Helper <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </section>

          {/* Related chapters */}
          {related.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                <BookOpen className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                Related Chapters
              </h2>
              <ul className="flex flex-col gap-1.5">
                {related.map((rc) => (
                  <li key={rc.slug}>
                    <Link
                      href={`/tmc-chapters/${rc.slug}`}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span className="truncate">{rc.title}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 311 helper */}
          <section className="bg-blue-600 rounded-2xl p-5 text-white">
            <h2 className="font-semibold text-sm mb-1">Want to report a concern?</h2>
            <p className="text-blue-100 text-xs mb-3">
              The City of Toronto&apos;s 311 service handles bylaw complaints and service requests.
            </p>
            <a
              href={OFFICIAL_311_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Visit Toronto 311
            </a>
          </section>
        </aside>
      </div>

      {/* Source notice */}
      {content && (
        <div className="mt-8 p-4 rounded-xl border border-gray-200 bg-gray-50 flex gap-3">
          <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-sm text-gray-600 leading-relaxed">{content.sourceNotes}</p>
            <p className="text-xs text-gray-400 mt-1.5">Last reviewed: {content.lastReviewed}</p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-5 rounded-xl border border-amber-200 bg-amber-50 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-amber-800">
          Information on this page is summarized for general reference only and is not legal advice. Always confirm the official requirement using the City of Toronto Municipal Code or other official City sources.
        </p>
      </div>
    </div>
  );
}
