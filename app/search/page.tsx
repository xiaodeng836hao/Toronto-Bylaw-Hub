import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search across Toronto Municipal Code chapters, zoning topics, the pool fence guide, and the photo review helper.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-sm text-gray-400">Loading search…</div>}>
      <SearchClient />
    </Suspense>
  );
}
