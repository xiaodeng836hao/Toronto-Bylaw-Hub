import { Info } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Informational Tool Only:</strong> This platform is not an official City of Toronto legal service. Always verify requirements through the official City of Toronto Municipal Code, Toronto 311, or applicable City procedures.
        </p>
      </div>
    </div>
  );
}
