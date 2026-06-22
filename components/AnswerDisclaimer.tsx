import { ShieldAlert } from "lucide-react";
import type { CautionLevel } from "@/data/knowledge-index";

const BASE =
  "BylawGuide provides general reference information only. This answer is not legal advice, not an official City determination, and may not apply to every property or situation. Always verify using official City of Toronto sources.";

const EXTRA: Partial<Record<CautionLevel, string>> = {
  "property-specific":
    "Zoning rules are property-specific and may depend on overlays, exceptions, measurements, and the exact zone category.",
  "pool-enclosure":
    "Pool enclosure compliance depends on exact measurements, site conditions, and Chapter 447 requirements.",
};

/**
 * Reusable safety/disclaimer callout for Ask answers and property-specific
 * topics. The caution level adds a topic-specific line where appropriate.
 */
export default function AnswerDisclaimer({
  cautionLevel,
  className = "",
}: {
  cautionLevel?: CautionLevel;
  className?: string;
}) {
  const extra = cautionLevel ? EXTRA[cautionLevel] : undefined;
  return (
    <div className={`flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 ${className}`}>
      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs text-amber-800 leading-relaxed space-y-1.5">
        <p>{BASE}</p>
        {extra && <p>{extra}</p>}
      </div>
    </div>
  );
}
