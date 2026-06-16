import type { Metadata } from "next";
import ProhibitedPlantsClient from "./ProhibitedPlantsClient";

export const metadata: Metadata = {
  title: "Prohibited Plants Identifier",
  description:
    "Identify Toronto's 10 prohibited plants (Chapter 489) — giant hogweed, poison ivy, Japanese knotweed, ragweed, garlic mustard, phragmites, buckthorn, dog-strangling vine, Canada thistle, and purple loosestrife. Compare seasonal appearance and learn safe, resident-friendly removal.",
};

export default function ProhibitedPlantsPage() {
  return <ProhibitedPlantsClient />;
}
