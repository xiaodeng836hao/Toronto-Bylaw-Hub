import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pool Fence Enclosure Guide",
  description:
    "A resident-friendly guide to Toronto swimming pool enclosure permits, fence height, gate self-closing and self-latching rules, and a printable inspection checklist (Chapter 447).",
};

export default function PoolFenceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
