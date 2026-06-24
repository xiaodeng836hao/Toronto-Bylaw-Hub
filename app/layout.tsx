import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Self-hosted at build time by next/font — no runtime request to Google, so the
// site still renders on restricted networks (falls back to the system stack if a
// font file ever fails to load). A serious, clean, institutional pairing:
// IBM Plex Sans for headings, Inter for body, IBM Plex Mono for labels/figures.
const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fontDisplay = IBM_Plex_Sans({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const fontMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });
import Footer from "@/components/Footer";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import BetaNotice from "@/components/BetaNotice";
import BackToTop from "@/components/BackToTop";
import FloatingAskWidget from "@/components/ask/FloatingAskWidget";
import HideOnRoutes from "@/components/layout/HideOnRoutes";
import AdminPreviewBanner from "@/components/admin/AdminPreviewBanner";
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
  authors: [{ name: siteConfig.authorName }],
  creator: siteConfig.creatorName,
  publisher: siteConfig.publisherName,
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
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.shortName,
    alternateName: siteConfig.siteName,
    url: SITE_URL,
    description: siteConfig.defaultDescription,
    inLanguage: "en-CA",
    publisher: { "@type": "Organization", name: siteConfig.publisherName, url: SITE_URL },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`h-full antialiased ${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#f6f8fb]">
        {/* WebSite structured data (independent reference site — not a government org) */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Site-wide atmospheric backdrop (subtle grid + soft glows) */}
        <div aria-hidden className="site-backdrop pointer-events-none fixed inset-0 -z-10" />
        {/* Site chrome is hidden on the maintenance / admin-login pages. The admin
            preview banner self-hides unless an admin is logged in while closed. */}
        <HideOnRoutes>
          <AdminPreviewBanner />
          <Navbar />
        </HideOnRoutes>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <HideOnRoutes>
          <DisclaimerBanner />
          <BetaNotice />
          <Footer />
          <BackToTop />
          <FloatingAskWidget />
        </HideOnRoutes>
      </body>
    </html>
  );
}
