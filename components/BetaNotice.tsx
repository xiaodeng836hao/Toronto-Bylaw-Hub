import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Subtle, professional public-beta notice shown site-wide just above the footer.
 * Gated by `siteConfig.isPublicBeta` so it can be turned off after launch.
 */
export default function BetaNotice() {
  if (!siteConfig.isPublicBeta) return null;
  return (
    <div className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold flex-shrink-0">
          <Sparkles className="w-3 h-3" aria-hidden="true" /> Public Beta
        </span>
        <p className="text-xs text-slate-600 leading-relaxed">
          This website is being actively improved. Information is provided for general reference only and should be
          verified with official City of Toronto sources.
        </p>
      </div>
    </div>
  );
}
