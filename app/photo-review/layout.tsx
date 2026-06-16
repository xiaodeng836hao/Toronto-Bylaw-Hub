import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Review Helper",
  description:
    "Upload a photo and choose an issue type to see a preliminary reference match to a likely Toronto bylaw chapter, with an evidence checklist.",
};

export default function PhotoReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
