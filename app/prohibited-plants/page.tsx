import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, ArrowRight } from "lucide-react";
import ProhibitedPlantsClient from "./ProhibitedPlantsClient";

export const metadata: Metadata = {
  title: "Prohibited Plants Identifier",
  description:
    "Identify Toronto's 10 prohibited plants (Chapter 489) — giant hogweed, poison ivy, Japanese knotweed, ragweed, garlic mustard, phragmites, buckthorn, dog-strangling vine, Canada thistle, and purple loosestrife. Compare seasonal appearance and learn safe, resident-friendly removal.",
};

export default function ProhibitedPlantsPage() {
  return (
    <>
      <ProhibitedPlantsClient />

      {/* Cross-link to the Invasive Plant Check mobile app concept */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link
          href="/invasive-plant-check"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 subtle-shadow transition-colors hover:from-emerald-100 hover:to-teal-100"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-emerald-900">
                Explore the Invasive Plant Check mobile app
              </span>
              <span className="block text-sm text-emerald-800/70">
                AI-assisted plant identification connected with BylawGuide.ca.
              </span>
            </span>
          </span>
          <ArrowRight className="w-5 h-5 text-emerald-700 flex-shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
