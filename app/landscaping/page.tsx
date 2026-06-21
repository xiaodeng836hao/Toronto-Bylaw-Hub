import type { Metadata } from "next";
import LandscapingClient from "./LandscapingClient";

export const metadata: Metadata = {
  title: "Toronto Residential Landscaping Guide",
  description:
    "Learn about soft landscaping requirements for Toronto residential properties, including front yard, side yard, and rear yard landscaping, zoning references, and minor variance options.",
  alternates: { canonical: "/landscaping" },
};

export default function LandscapingPage() {
  return <LandscapingClient />;
}
