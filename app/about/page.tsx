import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { OFFICIAL_311_URL } from "@/lib/mock-data";
import {
  Info, BookOpen, Users, ShieldAlert, FileSearch, MessageSquare,
  ExternalLink, ArrowRight, CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "About BylawGuide | Toronto Bylaw Reference Tool" },
  description:
    "Learn about BylawGuide, an independent plain-language reference tool for selected Toronto bylaw topics.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About BylawGuide",
    description:
      "An independent, plain-language reference tool for selected Toronto bylaw topics. Not an official City of Toronto website.",
    url: `${siteConfig.siteUrl}/about`,
    type: "website",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About BylawGuide",
  url: `${siteConfig.siteUrl}/about`,
  description:
    "An independent, plain-language reference tool for selected Toronto bylaw topics.",
  publisher: { "@type": "Organization", name: siteConfig.publisherName, url: siteConfig.siteUrl },
};

const COVERS = [
  "Toronto Municipal Code chapters (plain-language summaries)",
  "Pool fence enclosure guidance",
  "Zoning topics for residents",
  "Prohibited plants identifier",
  "A photo review helper for matching a likely bylaw",
];

const NOT = [
  "This website is not an official City of Toronto website.",
  "It is not legal advice.",
  "It does not replace the official Toronto Municipal Code, Toronto 311, Toronto Building, Municipal Licensing & Standards, or any City procedure.",
  "Always confirm requirements through official City of Toronto sources.",
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/10 mb-4">
          <Info className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">About</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">About BylawGuide</h1>
        <p className="text-gray-500 text-lg">A plain-language reference tool for Toronto bylaw information.</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* What this website does */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
            <BookOpen className="w-5 h-5 text-blue-500" aria-hidden="true" /> What this website does
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            BylawGuide helps Toronto residents search and understand selected bylaw topics. It provides
            plain-language summaries, official source links, visual guides, and reference tools — so it&apos;s easier to
            find the right official City resource.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COVERS.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" /> {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Who created it */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
            <Users className="w-5 h-5 text-blue-500" aria-hidden="true" /> Who created it
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            BylawGuide is an independent public reference project created to make Toronto bylaw information easier to
            understand.
            {siteConfig.creatorName ? <> Created by {siteConfig.creatorName}.</> : null}
          </p>
        </section>

        {/* What this website is not */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-3">
            <ShieldAlert className="w-5 h-5 text-amber-600" aria-hidden="true" /> What this website is not
          </h2>
          <ul className="flex flex-col gap-2">
            {NOT.map((n) => (
              <li key={n} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" /> {n}
              </li>
            ))}
          </ul>
        </section>

        {/* Source-based approach */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
            <FileSearch className="w-5 h-5 text-blue-500" aria-hidden="true" /> Source-based approach
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            The website summarizes information from official City of Toronto webpages, Toronto Municipal Code PDFs, and
            other cited public sources. Each major content page includes official source links where possible, so you can
            verify the details directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={siteConfig.officialTorontoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Official City of Toronto
            </a>
            <Link href="/disclaimer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Read the full disclaimer <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Feedback CTA */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 text-white ring-1 ring-inset ring-white/10 shadow-[0_24px_60px_-24px_rgba(37,99,235,0.55)]">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 -top-1/2 h-full" style={{ background: "radial-gradient(70% 100% at 50% 0%, rgba(255,255,255,0.16), transparent 65%)" }} />
            <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
          </div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" aria-hidden="true" /> Help improve this guide
              </h2>
              <p className="text-sm text-blue-50/90 max-w-md">
                Spotted something unclear or missing? Your feedback helps make this public reference tool better.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/feedback" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                Send Feedback <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href={OFFICIAL_311_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl ring-1 ring-inset ring-white/20 hover:bg-white/15 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> Toronto 311
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
