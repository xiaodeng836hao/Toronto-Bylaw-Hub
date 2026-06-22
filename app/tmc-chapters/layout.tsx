import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toronto Municipal Code Chapters",
  description:
    "Browse and search Toronto Municipal Code chapters with simple summaries, common examples, official sources, and PDF downloads.",
};

export default function TmcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
