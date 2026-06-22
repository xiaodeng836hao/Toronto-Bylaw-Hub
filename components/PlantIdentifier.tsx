"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, X, Loader2, Sparkles, Leaf, AlertTriangle, Info, ArrowRight, ShieldAlert, ExternalLink, ShieldCheck,
} from "lucide-react";
import AIReferenceDisclaimer from "@/components/AIReferenceDisclaimer";
import { downscaleImage } from "@/lib/image-resize";
import type { PlantIdentificationResult, MatchConfidence } from "@/lib/plant-id/types";

type Status = "idle" | "loading" | "done" | "unavailable" | "error";

const SEASONS = ["Not sure", "Spring", "Summer", "Fall", "Winter"];
const LOCATIONS = [
  "Not sure", "Backyard", "Front yard", "Fence line", "Garden bed", "Ravine edge",
  "Wetland / pond edge", "Vacant lot", "Roadside / boulevard",
];

const CONF: Record<MatchConfidence, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-600/15",
  medium: "bg-amber-50 text-amber-700 ring-amber-600/15",
  low: "bg-gray-50 text-gray-600 ring-gray-300",
};

export default function PlantIdentifier() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [season, setSeason] = useState("Not sure");
  const [location, setLocation] = useState("Not sure");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
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
      // Check availability first to avoid uploading a large photo when the key is off.
      const status = await fetch("/api/ai/status").then((r) => r.json()).catch(() => null);
      if (!status?.plantId) {
        setStatus("unavailable");
        return;
      }
      const img = await downscaleImage(file);
      const fd = new FormData();
      fd.append("image", img);
      if (season !== "Not sure") fd.append("season", season);
      if (location !== "Not sure") fd.append("location", location);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 60_000);
      let data: { configured?: boolean; error?: string; result?: PlantIdentificationResult };
      try {
        const res = await fetch("/api/plant-id/identify", { method: "POST", body: fd, signal: controller.signal });
        data = await res.json();
      } finally {
        clearTimeout(timer);
      }
      if (data.configured === false) setStatus("unavailable");
      else if (data.error) { setError(data.error); setStatus("error"); }
      else if (data.result) { setResult(data.result); setStatus("done"); }
      else setStatus("unavailable");
    } catch {
      setError("Plant identification is temporarily unavailable. You can still browse the plant profiles and official links below.");
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="plant-id-h" className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-6">
      <h2 id="plant-id-h" className="font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-green-600" aria-hidden="true" /> Identify a Possible Prohibited Plant
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Upload a clear plant photo to compare it against Toronto&apos;s prohibited plants list. Species identification is provided by Plant.id; BylawGuide compares the result against Toronto&apos;s 10 prohibited plants. This is a reference result only.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload */}
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

        {/* Context */}
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="plant-season" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Month / season observed <span className="font-normal normal-case text-gray-400">(optional)</span></label>
            <select id="plant-season" value={season} onChange={(e) => setSeason(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/20">
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="plant-location" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location type <span className="font-normal normal-case text-gray-400">(optional)</span></label>
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
            {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Checking plant image…</> : <><Sparkles className="w-4 h-4" aria-hidden="true" /> Identify Plant</>}
          </button>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 p-3 mt-4 bg-gray-50 rounded-xl border border-gray-100">
        <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-gray-500">Do not upload images containing people, faces, licence plates, addresses, or private personal information. Uploaded photos are processed to generate a plant identification reference result and are not intended to be stored permanently.</p>
      </div>

      {/* States */}
      {status === "unavailable" && (
        <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl border border-blue-100 bg-blue-50/60">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-blue-900">Plant identification is temporarily unavailable. You can still browse the prohibited plant profiles below and use the manual identifier and official links.</p>
        </div>
      )}
      {status === "error" && (
        <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl border border-rose-100 bg-rose-50/60">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-rose-900">{error}</p>
        </div>
      )}

      {status === "done" && result && (
        <div className="mt-5 flex flex-col gap-4">
          {/* Prohibited matches */}
          {result.prohibitedMatches.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Possible Toronto prohibited plant match</p>
              {result.prohibitedMatches.map((m) => (
                <div key={m.prohibitedPlantSlug} className="rounded-xl border border-rose-100 bg-white subtle-shadow p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Leaf className="w-4 h-4 text-rose-600" aria-hidden="true" />
                    <span className="font-semibold text-gray-900">{m.commonName}</span>
                    <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${CONF[m.confidence]}`}>{m.confidence} confidence</span>
                  </div>
                  <p className="text-xs italic text-gray-400 mb-1.5">{m.scientificNames.join(" · ")}</p>
                  <p className="text-sm text-gray-600 mb-2">{m.explanation}</p>
                  {m.safetyWarnings.length > 0 && (
                    <div className="flex items-start gap-2 p-2.5 mb-2 rounded-lg bg-rose-50 border border-rose-100">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <ul className="text-xs text-rose-800 space-y-1">{m.safetyWarnings.map((w) => <li key={w}>{w}</li>)}</ul>
                    </div>
                  )}
                  <Link href={m.internalPlantUrl} className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800">
                    View detailed plant profile & safe removal <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-gray-600">{result.message}</p>
            </div>
          )}

          {/* Plant.id species suggestions */}
          {result.topSuggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top species suggestions (Plant.id)</p>
              <ul className="flex flex-col gap-1.5">
                {result.topSuggestions.map((s) => (
                  <li key={s.scientificName} className="flex items-baseline justify-between gap-3 text-sm rounded-lg border border-gray-100 px-3 py-2">
                    <span className="min-w-0">
                      <span className="font-medium text-gray-800 italic">{s.scientificName}</span>
                      {s.commonNames[0] && <span className="text-gray-500"> · {s.commonNames[0]}</span>}
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">{Math.round(s.probability * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official sources */}
          <div className="flex flex-wrap gap-2">
            {result.officialSources.map((src) => (
              <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> {src.title}
              </a>
            ))}
          </div>

          <AIReferenceDisclaimer variant="plant" />
        </div>
      )}
    </section>
  );
}
