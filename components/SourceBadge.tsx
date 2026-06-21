import { FileCheck } from "lucide-react";

/**
 * Small, non-intrusive trust callout for content pages: signals that the page is
 * a plain-language summary of official sources and should be verified.
 */
export default function SourceBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500 ring-1 ring-inset ring-slate-200 ${className}`}
    >
      <FileCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden="true" />
      Source-based summary · Always verify with official City sources
    </div>
  );
}
