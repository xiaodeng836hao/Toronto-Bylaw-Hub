import type { Metadata } from "next";
import { Suspense } from "react";
import ZoningClient from "./ZoningClient";

export const metadata: Metadata = {
  title: "Zoning Bylaw Guide",
  description:
    "Search Toronto residential zoning provisions in Chapter 10.10 (Residential Zone R) and 10.20 (Residential Detached Zone RD) by keyword — setbacks, building height, lot coverage, floor space index, driveways, decks, and more — plus simple zoning topics (By-law 569-2013).",
};

export default function ZoningPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-sm text-gray-400">Loading zoning topics…</div>}>
      <ZoningClient />
    </Suspense>
  );
}
