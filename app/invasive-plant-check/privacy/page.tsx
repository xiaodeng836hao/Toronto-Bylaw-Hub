import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import {
  Lock, Camera, EyeOff, UserX, MapPinOff, Sparkles, Link2, Mail, ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Invasive Plant Check — Privacy & Photo Handling" },
  description:
    "How Invasive Plant Check uses plant photos: photos may be processed through a secure BylawGuide.ca proxy and a third-party plant identification provider. No accounts, no location tracking.",
  alternates: { canonical: "/invasive-plant-check/privacy" },
  openGraph: {
    title: "Invasive Plant Check — Privacy & Photo Handling",
    description:
      "How plant photos are used. No accounts, no location tracking. Educational use only.",
    url: `${siteConfig.siteUrl}/invasive-plant-check/privacy`,
    type: "website",
  },
};

const SECTIONS = [
  {
    icon: Camera,
    title: "How photos are used",
    text: "When you choose to identify a plant, the selected photo may be sent to the app's plant identification service through a BylawGuide.ca proxy endpoint. The result is used to show possible plant matches and compare them with the current plant guide.",
  },
  {
    icon: EyeOff,
    title: "Before uploading a photo",
    text: "Avoid including people, faces, addresses, license plates, documents, or other private information in plant photos.",
  },
  {
    icon: UserX,
    title: "No account required",
    text: "The current MVP does not require user accounts or user profiles.",
  },
  {
    icon: MapPinOff,
    title: "No location feature",
    text: "The current MVP does not use maps or automatic location tracking.",
  },
  {
    icon: Sparkles,
    title: "AI limitation",
    text: "Plant identification may be inaccurate. Results should be treated as educational starting points and verified with official resources or qualified professionals before action.",
  },
  {
    icon: Link2,
    title: "Plant identification service",
    text: "AI plant identification may rely on a third-party plant identification provider. Photos submitted for identification may be processed by that provider to return possible plant matches.",
  },
];

export default function InvasivePlantCheckPrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/invasive-plant-check"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Invasive Plant Check
      </Link>

      {/* Hero */}
      <div className="mb-8 flex items-center gap-4">
        <Image
          src="/images/invasive-plant-check-logo.png"
          alt="Invasive Plant Check logo"
          width={64}
          height={64}
          className="rounded-2xl shadow-sm flex-shrink-0"
        />
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 mb-2">
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="kicker">Privacy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Privacy & photo handling</h1>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed mb-8">
        Invasive Plant Check uses plant photos only to provide AI-assisted plant
        identification and educational guidance. This page explains what that means.
      </p>

      <div className="flex flex-col gap-4">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
              <s.icon className="w-5 h-5 text-emerald-500" aria-hidden="true" /> {s.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
          </section>
        ))}

        {/* Contact */}
        <section className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-2">
            <Mail className="w-5 h-5 text-emerald-500" aria-hidden="true" /> Questions or feedback
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For questions, feedback, or privacy concerns, contact{" "}
            <a href="mailto:info@bylawguide.ca" className="font-medium text-emerald-700 hover:underline">
              info@bylawguide.ca
            </a>
            .
          </p>
        </section>

        {/* Not official */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm text-amber-900 leading-relaxed">
            Invasive Plant Check is an AI-assisted educational tool and is <strong>not</strong> an
            official City of Toronto application. Plant identification may be inaccurate and does not
            provide an official bylaw determination, legal advice, environmental compliance advice, or
            professional removal service.
          </p>
        </section>
      </div>
    </div>
  );
}
