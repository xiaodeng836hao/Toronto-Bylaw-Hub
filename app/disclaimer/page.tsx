import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { OFFICIAL_311_URL, ZONING_OFFICIAL_URL } from "@/lib/mock-data";
import { ShieldAlert, ExternalLink, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Disclaimer | BylawGuide" },
  description:
    "Read the disclaimer for BylawGuide, an independent public reference website for Toronto bylaw information.",
  alternates: { canonical: "/disclaimer" },
  openGraph: {
    title: "Disclaimer | BylawGuide",
    description:
      "BylawGuide is an independent public reference tool — not an official City of Toronto website, and not legal advice.",
    url: `${siteConfig.siteUrl}/disclaimer`,
    type: "website",
  },
};

const POINTS = [
  "This website is an independent public reference tool.",
  "It is not an official City of Toronto website.",
  "It is not legal advice.",
  "Information may be incomplete, outdated, or simplified.",
  "Users should verify requirements through official City of Toronto sources.",
];

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/10 mb-4">
          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Disclaimer</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Disclaimer</h1>
        <p className="text-gray-500 text-lg">
          Please read this before relying on any information on {siteConfig.shortName}.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-6">
        <ul className="flex flex-col gap-3">
          {POINTS.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" aria-hidden="true" /> {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Where to go for official help</h2>
        <ul className="flex flex-col gap-3 text-sm text-gray-700">
          <li className="leading-relaxed">
            For official complaints or service requests, use{" "}
            <a href={OFFICIAL_311_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
              Toronto 311 <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>.
          </li>
          <li className="leading-relaxed">
            For property-specific zoning, use{" "}
            <a href={ZONING_OFFICIAL_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
              official zoning resources <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>{" "}
            or City staff.
          </li>
          <li className="leading-relaxed">
            For all other matters, start at the{" "}
            <a href={siteConfig.officialTorontoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
              official City of Toronto website <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>.
          </li>
        </ul>
      </section>

      <Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> About this website
      </Link>
    </div>
  );
}
