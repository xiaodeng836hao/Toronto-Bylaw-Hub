import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const pageLinks = [
  { href: "/about", label: "About" },
  { href: "/tmc-chapters", label: "TMC Chapters" },
  { href: "/photo-review", label: "Photo Review" },
  { href: "/pool-fence-guide", label: "Pool Fence Guide" },
  { href: "/zoning", label: "Zoning Guide" },
  { href: "/prohibited-plants", label: "Prohibited Plants" },
  { href: "/search", label: "Search" },
  { href: "/feedback", label: "Feedback" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/noise-complaints", label: "Noise Complaints (Coming Soon)" },
];

const officialLinks = [
  { href: siteConfig.officialTorontoUrl, label: "Official City of Toronto" },
  { href: siteConfig.official311Url, label: "Toronto 311" },
  { href: "https://www.toronto.ca/city-government/city-administration/city-managers-office/agencies-corporations/toronto-municipal-code/", label: "Toronto Municipal Code" },
  { href: "https://www.toronto.ca/services-payments/building-construction/", label: "Toronto Building" },
  { href: "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/", label: "Zoning By-law" },
];

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-slate-800 bg-slate-900 text-slate-300">
      {/* Subtle top glow for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={30} height={30} className="rounded-md" />
              <span className="font-display text-base font-semibold tracking-tight text-white">Toronto Bylaw Guide</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              This website is not an official City of Toronto legal service. Information is provided for general reference
              purposes only. Always confirm requirements through the official City of Toronto Municipal Code, Toronto 311,
              Toronto Building, or applicable City procedures.
            </p>
          </div>

          <div>
            <p className="kicker text-slate-500 mb-4">Pages</p>
            <div className="flex flex-col gap-2.5">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="kicker text-slate-500 mb-4">Official Resources</p>
            <div className="flex flex-col gap-2.5">
              {officialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-2">Not an official City of Toronto website. Information is for general reference only.</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} {siteConfig.shortName}. Independent public reference tool.</p>
            <p className="text-xs text-slate-500">Not affiliated with, or endorsed by, the City of Toronto.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
