import type { Metadata } from "next";
import Link from "next/link";
import { OFFICIAL_311_URL } from "@/lib/mock-data";
import { Volume2, Clock, ExternalLink, ArrowLeft, Hammer } from "lucide-react";

export const metadata: Metadata = {
  title: "Noise Complaints — Coming Soon",
  description:
    "Noise-related content for the Toronto Bylaw Hub is under development. For now, use official City of Toronto resources for noise concerns.",
};

export default function NoiseComplaintsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Home
        </Link>
      </nav>

      <div className="bg-white rounded-3xl border border-gray-100 subtle-shadow overflow-hidden">
        <div className="bg-gradient-to-br from-gray-50 to-white px-8 py-12 text-center border-b border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Volume2 className="w-8 h-8 text-gray-400" aria-hidden="true" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">Noise Complaints</h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Coming Soon
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <Hammer className="w-3.5 h-3.5" aria-hidden="true" />
            Content Under Development
          </div>
        </div>

        <div className="px-8 py-10">
          <p className="text-gray-600 leading-relaxed text-center max-w-xl mx-auto mb-8">
            Noise-related content is currently under development. Future updates may include information about common noise concerns, complaint procedures, applicable municipal regulations, and resident guidance.
          </p>

          <div className="flex justify-center">
            <a
              href={OFFICIAL_311_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors subtle-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Visit Official City Resources
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            In the meantime, explore the{" "}
            <Link href="/tmc-chapters" className="text-blue-600 hover:text-blue-700 font-medium">Municipal Code chapters</Link>{" "}
            or the{" "}
            <Link href="/zoning" className="text-blue-600 hover:text-blue-700 font-medium">Zoning guide</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
