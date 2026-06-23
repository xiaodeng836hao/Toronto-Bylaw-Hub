import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import ParkingClient from "./ParkingClient";

export const metadata: Metadata = {
  title: { absolute: "Toronto Parking Zoning Guide | BylawGuide" },
  description:
    "Learn about parking-related zoning topics in Toronto, including front yard, side yard, rear yard, commercial, and recreational vehicle parking.",
  alternates: { canonical: "/zoning/parking" },
  openGraph: {
    title: "Toronto Parking Zoning Guide",
    description:
      "Understand common parking-related zoning topics, including front yard, side yard, rear yard, commercial, and recreational vehicle parking.",
    url: `${siteConfig.siteUrl}/zoning/parking`,
    type: "website",
  },
};

export default function ParkingPage() {
  return <ParkingClient />;
}
