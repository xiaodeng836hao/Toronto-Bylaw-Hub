import { Sparkles } from "lucide-react";

type Variant = "general" | "image" | "plant" | "zoning";

const BASE =
  "AI results are for general reference only. They are not legal advice, not an official City of Toronto determination, and may be incomplete or incorrect. Always verify using official City sources or contact the appropriate City service.";

const EXTRA: Record<Variant, string | null> = {
  general: null,
  image:
    "Image analysis can miss details that are not visible in the photo. Final assessment depends on site conditions, measurements, and official requirements.",
  plant:
    "Plant identification from photos can be uncertain. Use multiple visual features and confirm with official or expert resources before removal.",
  zoning:
    "Zoning rules are property-specific and may depend on overlays, exceptions, measurements, and exact zone category.",
};

/**
 * Reusable disclaimer shown under any AI-generated result (photo review, plant
 * identification, Ask answers). The variant adds a context-specific caution.
 */
export default function AIReferenceDisclaimer({
  variant = "general",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const extra = EXTRA[variant];
  return (
    <div className={`flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 ${className}`}>
      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="text-xs text-amber-800 leading-relaxed space-y-1.5">
        <p>{BASE}</p>
        {extra && <p>{extra}</p>}
      </div>
    </div>
  );
}
