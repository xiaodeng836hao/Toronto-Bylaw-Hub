import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" width={28} height={28} className="rounded-md" />
              <span className="font-semibold text-gray-900">Toronto Bylaw Guide</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              This website is not an official City of Toronto legal service. Information is provided for general reference purposes only. Always confirm requirements through the official City of Toronto Municipal Code, Toronto 311, Toronto Building, or applicable City procedures.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Pages</p>
            <div className="flex flex-col gap-2">
              {[
                { href: "/tmc-chapters", label: "TMC Chapters" },
                { href: "/photo-review", label: "Photo Review" },
                { href: "/pool-fence-guide", label: "Pool Fence Guide" },
                { href: "/zoning", label: "Zoning Guide" },
                { href: "/prohibited-plants", label: "Prohibited Plants" },
                { href: "/search", label: "Search" },
                { href: "/feedback", label: "Feedback" },
                { href: "/noise-complaints", label: "Noise Complaints (Coming Soon)" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Official Resources</p>
            <div className="flex flex-col gap-2">
              {[
                { href: "https://www.toronto.ca/home/311-toronto-at-your-service/", label: "311 Toronto" },
                { href: "https://www.toronto.ca/city-government/city-administration/city-managers-office/agencies-corporations/toronto-municipal-code/", label: "Toronto Municipal Code" },
                { href: "https://www.toronto.ca/services-payments/building-construction/", label: "Toronto Building" },
                { href: "https://www.toronto.ca/city-government/planning-development/zoning-by-law-preliminary-zoning-reviews/", label: "Zoning By-law" },
              ].map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Toronto Bylaw Guide. Informational reference tool only.</p>
          <p className="text-xs text-gray-400">Not affiliated with the City of Toronto.</p>
        </div>
      </div>
    </footer>
  );
}
