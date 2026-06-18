"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { searchContent, type SearchType, OFFICIAL_311_URL } from "@/lib/mock-data";
import {
  Search, ArrowRight, ExternalLink, BookOpen, MapPin,
  Waves, Camera, Clock, Info, Leaf, Sprout,
} from "lucide-react";

const TYPE_STYLES: Record<SearchType, { badge: string; icon: React.ElementType; iconColor: string }> = {
  Chapter: { badge: "bg-blue-50 text-blue-700", icon: BookOpen, iconColor: "text-blue-600" },
  Zoning: { badge: "bg-emerald-50 text-emerald-700", icon: MapPin, iconColor: "text-emerald-600" },
  Guide: { badge: "bg-cyan-50 text-cyan-700", icon: Waves, iconColor: "text-cyan-600" },
  "Photo Review": { badge: "bg-violet-50 text-violet-700", icon: Camera, iconColor: "text-violet-600" },
  Identifier: { badge: "bg-green-50 text-green-700", icon: Sprout, iconColor: "text-green-600" },
  Plant: { badge: "bg-green-50 text-green-700", icon: Leaf, iconColor: "text-green-600" },
  "Coming Soon": { badge: "bg-amber-50 text-amber-700", icon: Clock, iconColor: "text-amber-600" },
};

const SUGGESTIONS = ["garbage", "graffiti", "long grass", "pool fence", "heating", "front yard parking", "dust", "vacant property"];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  // Keep state in sync if the URL query changes (e.g. navigating from navbar).
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const results = useMemo(() => searchContent(query), [query]);
  const trimmed = query.trim();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", { scroll: false });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-4">
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          Site-wide Search
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Search Toronto Bylaw Guide</h1>
        <p className="text-gray-500 max-w-2xl">
          Search across Municipal Code chapters, zoning topics, prohibited plants, the pool fence guide, and the photo review helper.
        </p>
      </div>

      <form onSubmit={submit} role="search" className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        <label htmlFor="search-input" className="sr-only">Search bylaws</label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'garbage', 'pool fence', 'long grass', 'heating'…"
          autoFocus
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400 transition-colors"
        />
      </form>

      {/* Suggestions */}
      {!trimmed && (
        <div className="flex flex-wrap gap-2 mb-8" aria-label="Search suggestions">
          <span className="text-xs text-gray-400 self-center">Popular:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-3 py-1 bg-gray-50 border border-gray-200 text-gray-600 text-xs rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {trimmed && (
        <p className="text-sm text-gray-400 mb-4" aria-live="polite">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{trimmed}&rdquo;
        </p>
      )}

      {trimmed && results.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" aria-hidden="true" />
          <p className="font-medium text-gray-600 mb-1">No results found</p>
          <p className="text-sm text-gray-400 mb-4">Try a different keyword, or browse the Municipal Code chapters.</p>
          <Link href="/tmc-chapters" className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700">
            Browse all chapters <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((r) => {
            const style = TYPE_STYLES[r.type];
            const Icon = style.icon;
            const isExternal = r.href.startsWith("http");
            return (
              <li key={r.id}>
                <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 flex items-start gap-4 hover:border-blue-100 transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${style.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-semibold text-gray-900">{r.title}</h2>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>{r.type}</span>
                      {r.chapter && r.type !== "Chapter" && (
                        <span className="text-xs text-gray-400">{r.chapter}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3">{r.summary}</p>
                    {isExternal ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        {r.actionLabel} <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={r.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        {r.actionLabel} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Official 311 helper */}
      <div className="mt-10 p-5 rounded-2xl border border-blue-100 bg-blue-50/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
        <p className="text-sm text-blue-900 flex-1">
          Looking to report a concern directly? The City of Toronto&apos;s 311 service handles bylaw complaints and service requests.
        </p>
        <a
          href={OFFICIAL_311_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          Visit Toronto 311
        </a>
      </div>
    </div>
  );
}
