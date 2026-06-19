import Link from "next/link";
import { Home, Search, Compass, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { href: "/tmc-chapters", label: "TMC Chapters" },
  { href: "/pool-fence-guide", label: "Pool Fence Guide" },
  { href: "/tmc-chapters/447", label: "Fences (Chapter 447)" },
  { href: "/zoning", label: "Zoning Guide" },
  { href: "/prohibited-plants", label: "Prohibited Plants" },
  { href: "/photo-review", label: "Photo Review" },
];

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-blue-500" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-blue-600 mb-2">404 — Page not found</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">We couldn&apos;t find that page</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        The page you&apos;re looking for may have moved or no longer exists. Try searching, or use one of the links below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Go to Home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Search the site
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular pages</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 transition-colors text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {l.label}
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 flex-shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
