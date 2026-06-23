import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

// Internal pages, split into two balanced groups for a cleaner footer layout.
const guideLinks = [
  { href: "/tmc-chapters", label: "Bylaw Chapters" },
  { href: "/zoning", label: "Zoning Guide" },
  { href: "/zoning/former-north-york", label: "Former North York Zoning" },
  { href: "/landscaping", label: "Landscaping Guide" },
  { href: "/pool-fence-guide", label: "Pool Fence Guide" },
  { href: "/prohibited-plants", label: "Prohibited Plants" },
];

const toolLinks = [
  { href: "/ask", label: "Ask BylawGuide" },
  { href: "/photo-review", label: "Photo Review" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/feedback", label: "Feedback" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/noise-complaints", label: "Noise Complaints (Coming Soon)" },
];

const officialLinks = [
  { href: siteConfig.officialTorontoUrl, label: "Official City of Toronto" },
  { href: siteConfig.official311Url, label: "Toronto 311" },
  { href: "https://www.toronto.ca/city-government/city-administration/city-managers-office/agencies-corporations/toronto-municipal-code/", label: "Toronto Municipal Code" },
  { href: "https://www.toronto.ca/city-government/accountability-operations-customer-service/city-administration/staff-directory-divisions-and-customer-service/municipal-licensing-standards/", label: "Municipal Licensing & Standards" },
  { href: "https://www.toronto.ca/services-payments/building-construction/", label: "Toronto Building" },
  { href: "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/", label: "Zoning By-law" },
];

const linkClass =
  "text-sm text-slate-400 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

function LinkColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="kicker text-slate-500 mb-4">{title}</p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={30} height={30} className="rounded-md" />
              <span className="font-display text-base font-semibold tracking-tight text-white">Toronto Bylaw Guide</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent, resident-friendly reference for Toronto&rsquo;s bylaws. Search the Municipal Code,
              understand common rules, and find the right official City resource — all in one place.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
              Informational reference · Not official legal advice
            </span>
          </div>

          {/* Guides */}
          <div className="lg:col-span-3">
            <LinkColumn title="Guides">
              {guideLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </LinkColumn>
          </div>

          {/* Tools & site */}
          <div className="lg:col-span-2">
            <LinkColumn title="Tools & More">
              {toolLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </LinkColumn>
          </div>

          {/* Official resources */}
          <div className="col-span-2 lg:col-span-3">
            <LinkColumn title="Official Resources">
              {officialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-1.5 ${linkClass}`}
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" aria-hidden="true" />
                </a>
              ))}
            </LinkColumn>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.shortName}. Independent public reference tool — not affiliated with, or endorsed by, the City of Toronto.
          </p>
          <p className="text-xs text-slate-500">
            Always confirm requirements through official City of Toronto sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
