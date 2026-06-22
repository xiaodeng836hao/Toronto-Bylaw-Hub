import type { Metadata } from "next";
import { Suspense } from "react";
import AskClient from "./AskClient";

export const metadata: Metadata = {
  title: "Ask BylawGuide | Toronto Bylaw Reference Questions",
  description:
    "Ask simple questions about selected Toronto bylaw topics and get source-based reference answers with official source links.",
  // The /ask page is the canonical, indexable entry point. Query-string answer
  // URLs (?q=...) should not create many duplicate indexed pages.
  alternates: { canonical: "/ask" },
};

export default function AskPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-sm text-gray-400">Loading Ask…</div>}>
      <AskClient />
    </Suspense>
  );
}
