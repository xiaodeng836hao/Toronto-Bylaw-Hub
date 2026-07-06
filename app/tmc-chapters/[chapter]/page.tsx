import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  bylawChapters, getChapterBySlug, OFFICIAL_311_URL,
} from "@/lib/mock-data";
import { getChapterContent, type ComplexityLevel } from "@/lib/chapter-content";
import SourceBadge from "@/components/SourceBadge";
import {
  FENCE_HEIGHT_TABLE, FENCE_HEIGHT_MEASUREMENT_NOTE, FENCE_SCHOOL_NOTE,
  POOL_FENCE_REDIRECT,
} from "@/lib/fence-447";
import FenceHeightHelper from "./FenceHeightHelper";
import {
  CHAPTER_548_PDF, PROHIBITED_WASTE, PROHIBITED_WASTE_INTRO,
  PROHIBITED_WASTE_NOTE, LITTERING_PENALTIES,
  type WasteIconKey, type WasteToneKey,
} from "@/lib/littering-548";
import {
  PREVENTION_INTRO, PREVENTION_MEASURES, type PreventionIconKey,
  DIFFERENCE_INTRO, DIFFERENCE_TAGS, DIFFERENCE_MURAL, type DifferencePoint,
  GRAFFITI_PENALTIES, GRAFFITI_PENALTIES_NOTE,
  EXEMPTION_INTRO, EXEMPTION_CHECKLIST,
  EXEMPTION_CHECKLIST_NOTE, EXEMPTION_KEEP_COPIES_NOTE,
  SAMPLE_EMAIL_SUBJECT, SAMPLE_EMAIL_BODY, SAMPLE_EMAIL_NOTE,
  EXEMPTION_DISCLAIMER, GRAFFITI_EXEMPTION_EMAIL, GRAFFITI_OFFICIAL_LINKS,
  STREETARTORONTO_PAGE,
} from "@/lib/graffiti-485";
import {
  ArrowLeft, ArrowRight, ExternalLink, Download, FileText,
  HelpCircle, AlertCircle, Users, Tag, BookOpen, ChevronRight, Info, Phone,
  ClipboardCheck, Wrench, AlertTriangle, CheckCircle2, XCircle, Layers, Hash,
  Ruler, Waves, Car, SquareStack, Ban,
  FlaskConical, SprayCan, Syringe, HardHat, Leaf, Disc3, Building2,
  Lightbulb, Camera, Lock, Paintbrush, Palette, Mail, ListChecks, ShieldCheck,
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

// Prohibited-waste (Chapter 548) icon + tone lookups.
const WASTE_ICON: Record<WasteIconKey, typeof Ban> = {
  chemical: FlaskConical,
  household: SprayCan,
  automotive: Car,
  medical: Syringe,
  construction: HardHat,
  yard: Leaf,
  tire: Disc3,
  business: Building2,
};

// Graffiti-prevention (Chapter 485) icon lookup.
const PREVENTION_ICON: Record<PreventionIconKey, typeof Lightbulb> = {
  light: Lightbulb,
  camera: Camera,
  lock: Lock,
  leaf: Leaf,
  paint: Paintbrush,
  mural: Palette,
};

// Graffiti tags vs. mural (Chapter 485) comparison icon lookup.
const DIFFERENCE_ICON: Record<DifferencePoint["icon"], typeof Lightbulb> = {
  cross: XCircle,
  spray: SprayCan,
  notice: ClipboardCheck,
  check: CheckCircle2,
  brush: Paintbrush,
  shield: ShieldCheck,
};

const WASTE_TONE: Record<WasteToneKey, string> = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  orange: "bg-orange-50 text-orange-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  gray: "bg-gray-100 text-gray-600",
};

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
  const isLittering = ch.slug === "548";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
          {/* Overview + what this chapter covers (combined, concise) */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-3">
              <BookOpen className="w-5 h-5 text-blue-500" aria-hidden="true" />
              Overview
            </h2>
            {content && (
              <p className="text-sm text-gray-700 leading-relaxed">{content.plainLanguageOverview}</p>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mt-4 mb-2">
              What this chapter covers
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
              {ch.whatThisCovers.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
              <span className="font-medium">Who it applies to:</span> {ch.whoItApplies}
            </p>
          </section>

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

          {/* Penalties & Enforcement (485 only) */}
          {ch.slug === "485" && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                Penalties &amp; Enforcement
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                What can happen if graffiti vandalism is not addressed. From Chapter 485, § 485-7 and § 485-8.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {GRAFFITI_PENALTIES.map((p) => (
                  <div key={p.reference + p.offence} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <p className="text-sm font-bold text-rose-600 leading-tight">{p.maxFine}</p>
                    <p className="text-xs text-gray-600 leading-snug mt-1">{p.offence}</p>
                    <p className="text-[10px] font-mono text-gray-400 mt-1">{p.reference}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl border border-amber-200 bg-amber-50 flex gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-amber-800 leading-relaxed">{GRAFFITI_PENALTIES_NOTE}</p>
              </div>
            </section>
          )}

          {/* Know the Difference: tags vs. mural (485 only) */}
          {ch.slug === "485" && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <Palette className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Know the Difference
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{DIFFERENCE_INTRO}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Graffiti tags */}
                <div className="rounded-xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/70 to-white overflow-hidden">
                  <div className="bg-rose-50 border-b border-rose-100 px-4 py-3 text-center">
                    <p className="text-sm font-bold uppercase tracking-wide text-rose-700">{DIFFERENCE_TAGS.title}</p>
                    <p className="text-xs text-rose-900/70 mt-0.5">{DIFFERENCE_TAGS.subtitle}</p>
                  </div>
                  <div className="relative aspect-[16/10] border-b border-rose-100 bg-gray-100">
                    <Image
                      src={DIFFERENCE_TAGS.image.src}
                      alt={DIFFERENCE_TAGS.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 420px"
                      className="object-cover"
                    />
                  </div>
                  <ul className="p-4 flex flex-col gap-3">
                    {DIFFERENCE_TAGS.points.map((p) => {
                      const Icon = DIFFERENCE_ICON[p.icon];
                      return (
                        <li key={p.label} className="flex items-start gap-2.5">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex-shrink-0">
                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{p.label}</p>
                            <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{p.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {/* Mural / graffiti art */}
                <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/70 to-white overflow-hidden">
                  <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 text-center">
                    <p className="text-sm font-bold uppercase tracking-wide text-blue-700">{DIFFERENCE_MURAL.title}</p>
                    <p className="text-xs text-blue-900/70 mt-0.5">{DIFFERENCE_MURAL.subtitle}</p>
                  </div>
                  <div className="relative aspect-[16/10] border-b border-blue-100 bg-gray-100">
                    <Image
                      src={DIFFERENCE_MURAL.image.src}
                      alt={DIFFERENCE_MURAL.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 420px"
                      className="object-cover"
                    />
                  </div>
                  <ul className="p-4 flex flex-col gap-3">
                    {DIFFERENCE_MURAL.points.map((p) => {
                      const Icon = DIFFERENCE_ICON[p.icon];
                      return (
                        <li key={p.label} className="flex items-start gap-2.5">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 leading-snug">{p.label}</p>
                            <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{p.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Whether specific markings are graffiti vandalism or approved art is determined against Chapter 485 —
                see the exemption section below, and confirm with official City sources.
              </p>
            </section>
          )}

          {/* Preventing Graffiti Vandalism (485 only) */}
          {ch.slug === "485" && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                Preventing Graffiti Vandalism
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{PREVENTION_INTRO}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PREVENTION_MEASURES.map((m) => {
                  const Icon = PREVENTION_ICON[m.icon];
                  return (
                    <div key={m.title} className="rounded-xl border border-gray-100 p-4 flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">{m.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 rounded-xl border border-emerald-100 bg-emerald-50/60 flex gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Funding or support may be available through StreetARToronto programs. Check the official{" "}
                  <a href={STREETARTORONTO_PAGE} target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-emerald-700">
                    StreetARToronto page
                  </a>{" "}
                  for current application status, eligibility, and deadlines — funding is not guaranteed.
                </p>
              </div>
            </section>
          )}

          {/* Applying for a Graffiti Art / Mural Exemption (485 only) */}
          {ch.slug === "485" && (
            <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/70 to-white p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                <SprayCan className="w-5 h-5 text-violet-600" aria-hidden="true" />
                Applying for a Graffiti Art / Mural Exemption
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                If approved art or a mural has been mistaken for graffiti vandalism, an exemption may be requested.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{EXEMPTION_INTRO}</p>

              {/* Where to send */}
              <div className="rounded-xl border border-violet-200 bg-white p-4 mb-4">
                <p className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" /> Send the exemption request by email to
                </p>
                <a href={`mailto:${GRAFFITI_EXEMPTION_EMAIL}`} className="text-sm font-semibold text-violet-700 hover:underline break-all">
                  {GRAFFITI_EXEMPTION_EMAIL}
                </a>
              </div>

              {/* Checklist card — what to include in the email */}
              <div className="rounded-xl border border-gray-100 bg-white p-4 mb-4">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
                  <ListChecks className="w-4 h-4 text-violet-600" aria-hidden="true" /> What to include in the exemption email
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                  {EXEMPTION_CHECKLIST.map((c) => (
                    <li key={c.label} className="flex items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-2.5">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">{c.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{c.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500">{EXEMPTION_CHECKLIST_NOTE}</p>
              </div>

              {/* Sample email (collapsible) */}
              <details className="group rounded-xl border border-gray-100 bg-white overflow-hidden mb-4">
                <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Sample exemption email format
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" aria-hidden="true" />
                </summary>
                <div className="px-4 pb-4 pt-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Subject</p>
                  <p className="text-sm text-gray-800 font-medium mb-3">{SAMPLE_EMAIL_SUBJECT}</p>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Body</p>
                  <pre className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-gray-50 border border-gray-100 rounded-lg p-3">{SAMPLE_EMAIL_BODY}</pre>
                  <p className="mt-2 text-xs text-gray-500">{SAMPLE_EMAIL_NOTE}</p>
                </div>
              </details>

              <p className="inline-flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 mb-4">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-600" aria-hidden="true" />
                {EXEMPTION_KEEP_COPIES_NOTE}
              </p>

              {/* Official source buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {GRAFFITI_OFFICIAL_LINKS.map((l) => (
                  <a
                    key={l.href + l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-200 text-violet-700 text-xs font-medium rounded-lg hover:bg-violet-50 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" aria-hidden="true" /> {l.label}
                  </a>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 flex gap-2.5">
                <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-red-800 leading-relaxed">{EXEMPTION_DISCLAIMER}</p>
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
              <figure>
                <Image
                  src="/images/fence/prohibited-fence-examples.png"
                  alt="Illustrated examples of prohibited fences: barbed wire, chicken wire, or sharp material (allowed only above 2.5 m on 45° inward brackets); sheet metal and corrugated metal panels; electrified fences (except low-voltage livestock fencing on farmland); materials not meant for permanent fencing such as pallets, scrap boards, tarps; and temporary fences (except a snow fence from Nov 15 to Apr 15)."
                  width={1055}
                  height={1491}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-auto w-full rounded-xl border border-gray-200"
                />
                <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed">
                  <span className="font-mono text-gray-400">Source: § 447-1.2A(2)–(6)</span> · Illustrated examples of prohibited fences and their exceptions (Chapter 447). Reference only — confirm details in the official chapter.
                </figcaption>
              </figure>
            </section>
          )}

          {/* Driveways and Visibility (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <Car className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Driveways and Visibility
              </h2>
              <figure>
                <Image
                  src="/images/fence/driveways-and-visibility.png"
                  alt="Illustrated guide to fence rules near driveways: a fence within 2.4 m of where the driveway meets the lot line must be open (see-through) construction like chain-link so it does not block the view of the street; open construction gives drivers and pedestrians clear visibility, and parking-lot fences must stay open at corners; and required open fences must be kept clear of hedges, tall plants, or objects."
                  width={1122}
                  height={1402}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-auto w-full rounded-xl border border-gray-200"
                />
                <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed">
                  <span className="font-mono text-gray-400">Source: § 447-1.2C, D</span> · How fence visibility rules apply near driveways and corners (Chapter 447). Reference only — confirm details in the official chapter.
                </figcaption>
              </figure>
            </section>
          )}

          {/* Fences on Unroofed Decks (447 only) */}
          {isFence && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                <SquareStack className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Fences on Unroofed Decks
              </h2>
              <figure>
                <Image
                  src="/images/fence/fences-on-unroofed-decks.png"
                  alt="Illustrated height rules for fences on an attached, unroofed deck: a deck fence may be up to 2.0 m high, measured from the deck surface (not the ground), and only where the deck is not in a front yard and not within 2.4 m of a street-side lot line; a deck fence can therefore sit higher above the yard than a ground-level fence; and if the deck fence also acts as a guard it must also meet Chapter 629, with the stricter rule applying where Chapter 447 and Chapter 629 overlap."
                  width={1122}
                  height={1402}
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="h-auto w-full rounded-xl border border-gray-200"
                />
                <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed">
                  <span className="font-mono text-gray-400">Source: § 447-1.2B (Item 5); § 447-1.2E</span> · Fence height on an attached, unroofed deck, measured from the deck surface (Chapter 447). Reference only — confirm details in the official chapter.
                </figcaption>
              </figure>
            </section>
          )}

          {/* Prohibited Waste — Schedule B (548 only) */}
          {isLittering && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 mb-1.5">
                <Ban className="w-5 h-5 text-rose-500" aria-hidden="true" />
                Prohibited Waste — what can’t go in the garbage
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                {PROHIBITED_WASTE_INTRO}
              </p>

              {/* Category cards — 2-up on wider screens, condensed for scanning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROHIBITED_WASTE.map((c) => {
                  const Icon = WASTE_ICON[c.icon];
                  return (
                    <div key={c.category} className="flex flex-col rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 ${WASTE_TONE[c.tone]}`}>
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-tight">{c.category}</p>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">{c.scheduleRefs}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2.5">{c.examples}</p>
                      <div className="mt-auto flex items-start gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-2">
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-[11px] text-emerald-900 leading-snug">{c.disposeInstead}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Penalties — compact 3-up */}
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Penalties (§ 548-9)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {LITTERING_PENALTIES.map((p) => (
                    <div key={p.offence} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                      <p className="text-sm font-bold text-rose-600 leading-tight">{p.maxFine}</p>
                      <p className="text-xs text-gray-600 leading-snug mt-1">{p.offence}</p>
                      <p className="text-[10px] font-mono text-gray-400 mt-1">{p.reference}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note + official source */}
              <div className="mt-4 p-3 rounded-xl border border-gray-200 bg-gray-50 flex gap-2.5">
                <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  {PROHIBITED_WASTE_NOTE}{" "}
                  <a href={CHAPTER_548_PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline">
                    Official Chapter 548 PDF<ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </p>
              </div>
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


        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Compliance steps — compact, moved from the main column */}
          {content && content.practicalComplianceSteps.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
              <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                <Wrench className="w-4 h-4 text-blue-500" aria-hidden="true" />
                {ch.slug === "417" ? "How to Reduce or Eliminate Dust" : isFence ? "Before You Build or Replace a Fence" : "Practical Compliance Guide"}
              </h2>
              <ol className="flex flex-col gap-3">
                {content.practicalComplianceSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{s.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{s.description}</p>
                      {s.caution && (
                        <p className="mt-1 inline-flex items-start gap-1 text-[11px] text-amber-700">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" /> {s.caution}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Who it applies to */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-2">
              <Users className="w-4 h-4 text-blue-500" aria-hidden="true" />
              Who It Applies To
            </h2>
            <p className="text-sm text-gray-600">{ch.whoItApplies}</p>
          </section>

          {/* Common examples */}
          <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
              <AlertCircle className="w-4 h-4 text-orange-500" aria-hidden="true" />
              {isFence ? "Common Non-Compliance Examples" : "Common Examples"}
            </h2>
            <ul className="flex flex-col gap-2">
              {ch.commonExamples.map((ex) => (
                <li key={ex} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 flex-shrink-0" aria-hidden="true" />
                  {ex}
                </li>
              ))}
            </ul>
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
