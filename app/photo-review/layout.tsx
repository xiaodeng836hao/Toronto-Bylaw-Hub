import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Review Helper",
  description:
    "Upload a photo to automatically match possible bylaw-related issues to the most relevant Toronto bylaw chapters and sections, with an evidence checklist.",
};

export default function PhotoReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
