import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toronto Bylaw Hub",
    template: "%s · Toronto Bylaw Hub",
  },
  description:
    "A resident-friendly guide to Toronto bylaws: search Toronto Municipal Code chapters, review photos for possible bylaw matches, understand pool fence and zoning rules, and find official City of Toronto resources.",
  keywords: [
    "Toronto bylaws",
    "Toronto Municipal Code",
    "property standards",
    "pool fence",
    "zoning",
    "311 Toronto",
  ],
  applicationName: "Toronto Bylaw Hub",
  openGraph: {
    title: "Toronto Bylaw Hub",
    description:
      "Search Toronto Municipal Code chapters, review photos for possible bylaw matches, and understand pool fence and zoning rules.",
    type: "website",
    siteName: "Toronto Bylaw Hub",
    locale: "en_CA",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f6f8fb]">
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <DisclaimerBanner />
        <Footer />
      </body>
    </html>
  );
}
