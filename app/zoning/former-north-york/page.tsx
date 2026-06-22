import type { Metadata } from "next";
import FormerNorthYorkClient from "./FormerNorthYorkClient";

export const metadata: Metadata = {
  title: "Former North York Zoning Guide | BylawGuide",
  description:
    "Browse a plain-language index and overview of Former North York zoning references, topics, and section summaries for general reference.",
  alternates: { canonical: "/zoning/former-north-york" },
};

export default function FormerNorthYorkPage() {
  return <FormerNorthYorkClient />;
}
