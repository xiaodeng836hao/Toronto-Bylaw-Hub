import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  Leaf, Camera, Sprout, ShieldCheck, Smartphone, Globe2, ArrowRight, Info, Lock, Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Invasive Plant Check — AI-assisted Plant Identification App" },
  description:
    "Invasive Plant Check is a mobile app concept connected with BylawGuide.ca that helps you scan or upload plant photos, review possible matches against the City of Toronto prohibited plants guide, and learn safer next steps. Future-ready for Ontario and Canada plant lists.",
  alternates: { canonical: "/invasive-plant-check" },
  openGraph: {
    title: "Invasive Plant Check",
    description:
      "AI-assisted plant identification for invasive, prohibited, and regulated plant guidance.",
    url: `${siteConfig.siteUrl}/invasive-plant-check`,
    type: "website",
  },
};

const FEATURES = [
  { icon: Camera, title: "Photo-based plant check", text: "Take or upload a photo to receive a possible plant match." },
  { icon: Leaf, title: "Current Toronto prohibited plant guide", text: "Compare results against the City of Toronto prohibited plants list." },
  { icon: Sprout, title: "Growth stage guidance", text: "See how each plant looks across the seasons." },
  { icon: ShieldCheck, title: "Safe removal education", text: "Learn what to avoid and when to seek professional help." },
  { icon: Globe2, title: "Future-ready jurisdiction support", text: "Built to expand to Ontario and Canada plant lists later." },
];

export default function InvasivePlantCheckPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="mb-8">
        <Image
          src="/images/invasive-plant-check-logo.png"
          alt="Invasive Plant Check logo"
          width={76}
          height={76}
          className="rounded-2xl shadow-sm mb-4"
        />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 mb-4">
          <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Mobile app</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Invasive Plant Check</h1>
        <p className="text-gray-500 text-lg">
          AI-assisted plant identification for invasive, prohibited, and regulated plant guidance.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Intro */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Invasive Plant Check is a mobile app concept connected with BylawGuide.ca.
            The current MVP helps users scan or upload plant photos, review possible
            matches, and learn safer next steps based on the City of Toronto prohibited
            plants guide. Future versions may support Ontario and Canada plant lists.
          </p>
        </section>

        {/* Features */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
            <Leaf className="w-5 h-5 text-emerald-500" aria-hidden="true" /> What the app does
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600">
                  <f.icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get the app (placeholder — no store links yet) */}
        <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-6 subtle-shadow">
          <div className="flex items-center gap-4">
            <Image
              src="/images/invasive-plant-check-logo.png"
              alt="Invasive Plant Check logo"
              width={56}
              height={56}
              className="rounded-xl shadow-sm flex-shrink-0"
            />
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-900 mb-1">
                <Smartphone className="w-5 h-5 text-emerald-600" aria-hidden="true" /> Get the app
              </h2>
              <p className="text-sm text-emerald-900/80 leading-relaxed">
                App Store and Google Play links will be added when the app is ready for release.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy note */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Lock className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Privacy & photo handling
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Plant photos submitted for identification may be processed through a secure
            BylawGuide.ca proxy endpoint and a third-party plant identification provider.
            The app does not require user accounts and does not use maps or location tracking.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Mail className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Contact
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For questions or feedback, contact{" "}
            <a href="mailto:info@bylawguide.ca" className="font-medium text-emerald-700 hover:underline">
              info@bylawguide.ca
            </a>
            .
          </p>
        </section>

        {/* Cross-links */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Explore the guide</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/prohibited-plants" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Leaf className="w-3.5 h-3.5" aria-hidden="true" /> Toronto prohibited plants guide
            </Link>
            <Link href="/disclaimer" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Read the full disclaimer <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-amber-900 mb-2">
            <Info className="w-5 h-5 text-amber-600" aria-hidden="true" /> Disclaimer
          </h2>
          <p className="text-sm text-amber-900 leading-relaxed">
            Invasive Plant Check provides AI-assisted educational information only. It does
            not provide an official bylaw determination, legal advice, environmental
            compliance advice, or professional removal service.
          </p>
        </section>
      </div>
    </div>
  );
}
