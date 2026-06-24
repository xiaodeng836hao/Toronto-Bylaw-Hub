import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrench, Mail, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "BylawGuide is temporarily unavailable" },
  description: "BylawGuide is temporarily closed while updates are being completed.",
  // While the public site is closed, do not let this page be indexed.
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/maintenance" },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-[calc(100dvh-1px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex items-center justify-center gap-2.5">
          <Image src="/logo.svg" alt="BylawGuide logo" width={44} height={44} className="object-contain" priority />
          <span className="text-lg font-semibold tracking-tight text-gray-900">Toronto Bylaw Guide</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white subtle-shadow p-8 sm:p-10">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Wrench className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            BylawGuide is temporarily unavailable
          </h1>
          <p className="text-gray-600 mb-5">We are improving the platform and will be back soon.</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            BylawGuide is an independent Toronto bylaw reference tool. The site is temporarily closed while updates are
            being completed.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:info@bylawguide.ca"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact us
            </a>
            <Link
              href="/admin-login"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            >
              <Lock className="h-4 w-4 text-gray-500" aria-hidden="true" /> Admin login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Independent reference project — not an official City of Toronto website.
        </p>
      </div>
    </div>
  );
}
