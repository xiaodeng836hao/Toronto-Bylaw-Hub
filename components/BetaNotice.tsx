import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Subtle, professional public-beta notice shown site-wide just above the footer.
 * Gated by `siteConfig.isPublicBeta` so it can be turned off after launch.
 */
export default function BetaNotice() {
  if (!siteConfig.isPublicBeta) return null;

  // Build timestamp (see next.config.ts) — reflects the latest deployment.
  const buildIso = process.env.NEXT_PUBLIC_BUILD_DATE;
  const lastUpdated = buildIso
    ? new Date(buildIso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold flex-shrink-0">
          <Sparkles className="w-3 h-3" aria-hidden="true" /> Public Beta
        </span>
        <div className="min-w-0">
          <p className="text-xs text-slate-600 leading-relaxed">
            This website is being actively improved. Information is provided for general reference only and should be
            verified with official City of Toronto sources.
          </p>
          {lastUpdated && (
            <p className="mt-0.5 text-[11px] text-slate-400">Last updated on: {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
}
