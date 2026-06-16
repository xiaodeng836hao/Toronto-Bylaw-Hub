import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share feedback on the Toronto Bylaw Hub — report bugs, suggest missing bylaws, or correct content. Your input helps improve this public reference tool.",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
