"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, X, Loader2, Sparkles, Leaf, AlertTriangle, Info, ArrowRight, ShieldAlert,
} from "lucide-react";
import AIReferenceDisclaimer from "@/components/AIReferenceDisclaimer";
import type { PlantIdentifyAI } from "@/lib/ai/types";

type Status = "idle" | "loading" | "done" | "unavailable" | "error";

const SEASONS = ["Not sure", "Spring", "Summer", "Fall", "Winter"];
const LOCATIONS = [
  "Not sure", "Backyard", "Fence line", "Garden bed", "Ravine edge",
  "Wetland / pond edge", "Vacant lot", "Roadside / boulevard",
];

const CONF: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  medium: "bg-blue-50 text-blue-700 ring-blue-600/15",
  low: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

export default function PlantIdentifier() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [season, setSeason] = useState("Not sure");
  const [location, setLocation] = useState("Not sure");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PlantIdentifyAI | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setStatus("idle");
    setResult(null);
    setError("");
  }

  function clear() {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function identify() {
    if (!file) return;
    setStatus("loading");
    setResult(null);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      if (season !== "Not sure") fd.append("season", season);
      if (location !== "Not sure") fd.append("location", location);
      const res = await fetch("/api/ai/plant-identify", { method: "POST", body: fd });
      const data = await res.json();
      if (data.aiEnabled === false) setStatus("unavailable");
      else if (data.error) { setError(data.error); setStatus("error"); }
      else if (data.result) { setResult(data.result as PlantIdentifyAI); setStatus("done"); }
      else setStatus("unavailable");
    } catch {
      setError("AI identification is currently unavailable. You can still browse the plant cards and official links.");
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="plant-id-h" className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
      <h2 id="plant-id-h" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-green-600" aria-hidden="true" /> Upload a Plant Photo
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload a photo to check whether a plant may be one of Toronto&apos;s 10 prohibited plants. This is an AI-assisted reference only — confirm with multiple features before any removal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload */}
        <div>
          <div
            onClick={() => !previewUrl && inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
            className={`relative rounded-xl border-2 border-dashed ${previewUrl ? "border-green-200" : "border-gray-200 cursor-pointer hover:border-green-300"} bg-gray-50 transition-colors overflow-hidden`}
          >
            {previewUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Plant photo preview" className="w-full max-h-56 object-cover" />
                <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }} aria-label="Remove photo" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/70">
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center text-center">
                <Upload className="w-9 h-9 text-gray-300 mb-2" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-600">Drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, or WEBP · up to 8 MB</p>
              </div>
            )}
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
          </div>
        </div>

        {/* Context */}
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="plant-season" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Season / month <span className="font-normal normal-case text-gray-400">(optional)</span></label>
            <select id="plant-season" value={season} onChange={(e) => setSeason(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20">
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="plant-location" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location context <span className="font-normal normal-case text-gray-400">(optional)</span></label>
            <select id="plant-location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20">
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={identify}
            disabled={!file || status === "loading"}
            className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Identifying…</> : <><Sparkles className="w-4 h-4" aria-hidden="true" /> Identify Possible Plant</>}
          </button>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 p-3 mt-4 bg-gray-50 rounded-xl border border-gray-100">
        <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-gray-500">Uploaded images may be processed by an AI service to generate a reference result and are not stored. Do not submit confidential or highly personal information.</p>
      </div>

      {/* Results */}
      {status === "unavailable" && (
        <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl border border-blue-100 bg-blue-50/60">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-blue-900">AI identification is currently unavailable. You can still browse the prohibited plant cards below and the official links.</p>
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl border border-rose-100 bg-rose-50/60">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-rose-900">{error}</p>
        </div>
      )}
      {status === "done" && result && (
        <div className="mt-4 flex flex-col gap-3">
          {result.noClearMatch && result.likelyMatches.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">I cannot confidently identify this plant from the photo.</p>
              <p className="text-sm text-gray-500">{result.generalNotes || "Try a clearer photo showing leaves, stem, and any flowers, or compare with the plant cards below."}</p>
            </div>
          ) : (
            result.likelyMatches.map((m) => (
              <div key={m.plantName} className="rounded-xl border border-green-100 bg-white subtle-shadow p-4">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <Leaf className="w-4 h-4 text-green-600" aria-hidden="true" />
                  <span className="font-semibold text-gray-900">{m.plantName}</span>
                  {m.scientificName && <span className="text-xs italic text-gray-400">{m.scientificName}</span>}
                  <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${CONF[m.confidence] ?? CONF.low}`}>{m.confidence} confidence</span>
                </div>
                {m.visibleFeatures.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1.5"><span className="font-medium text-gray-700">Supporting features:</span> {m.visibleFeatures.join(", ")}.</p>
                )}
                {m.missingOrUnclearFeatures.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1.5"><span className="font-medium text-gray-600">Unclear / missing:</span> {m.missingOrUnclearFeatures.join(", ")}.</p>
                )}
                {m.possibleLookAlikes.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1.5"><span className="font-medium text-gray-600">Possible look-alikes:</span> {m.possibleLookAlikes.join(", ")}.</p>
                )}
                {m.safetyCautions.length > 0 && (
                  <div className="flex items-start gap-2 p-2.5 my-2 rounded-lg bg-rose-50 border border-rose-100">
                    <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <ul className="text-xs text-rose-800 space-y-1">{m.safetyCautions.map((c) => <li key={c}>{c}</li>)}</ul>
                  </div>
                )}
                {m.removalGuidanceSummary && <p className="text-sm text-gray-600 mb-2">{m.removalGuidanceSummary}</p>}
                <Link href={m.internalPlantUrl} className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
                  View detailed plant card <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))
          )}
          {result.generalNotes && !result.noClearMatch && <p className="text-xs text-gray-500">{result.generalNotes}</p>}
          <AIReferenceDisclaimer variant="plant" />
        </div>
      )}
    </section>
  );
}
