import Link from "next/link";
import { Home, Search, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8 text-blue-500" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-blue-600 mb-2">404 — Page not found</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">We couldn&apos;t find that page</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        The page you&apos;re looking for may have moved or no longer exists. Try searching, or head back to the home page.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
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
    </div>
  );
}
