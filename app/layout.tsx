import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BetaNotice from "@/components/BetaNotice";
import { SITE_URL, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  keywords: [
    "Toronto bylaws",
    "Toronto Municipal Code",
    "property standards",
    "fence height",
    "pool fence",
    "zoning",
    "prohibited plants",
    "311 Toronto",
  ],
  applicationName: siteConfig.siteName,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.defaultTitle,
    description:
      "Search Toronto Municipal Code chapters, review photos for possible bylaw matches, and understand pool fence, fence height, and zoning rules.",
    url: SITE_URL,
    type: "website",
    siteName: siteConfig.siteName,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description:
      "A resident-friendly guide to Toronto bylaws — TMC chapters, pool fence, fence height, zoning, and prohibited plants, with official City sources.",
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
        <BetaNotice />
        <Footer />
      </body>
    </html>
  );
}
