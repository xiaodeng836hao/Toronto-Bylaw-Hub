"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera, Upload, X, ExternalLink, Loader2, FileImage,
  Info, CheckCircle2, ChevronDown, Clock, SearchCheck, Maximize2,
  Sparkles, Compass, ListChecks, Eye, ShieldAlert, ScrollText, AlertTriangle,
  Quote, Tag, Bug, MapPin, Lightbulb, EyeOff, HelpCircle, Image as ImageIcon,
  Copy, Check,
} from "lucide-react";
import { photoReviewIssues, OFFICIAL_311_URL } from "@/lib/mock-data";
import AIReferenceDisclaimer from "@/components/AIReferenceDisclaimer";
import { downscaleImage } from "@/lib/image-resize";
import { curatedMatch } from "@/lib/photo-review/match-shared";
import type {
  PhotoReviewAI, PhotoReviewResult, PhotoReviewMatch, PhotoReviewDebug, SourceCoverage,
} from "@/lib/ai/types";

type AiStatus = "idle" | "loading" | "done" | "unavailable" | "noise" | "error";

const CONF_STYLE: Record<string, string> = {
  high: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  medium: "bg-blue-50 text-blue-700 ring-blue-600/15",
  low: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

const COVERAGE: Record<SourceCoverage, { label: string; style: string }> = {
  strong: { label: "Strong source match", style: "bg-emerald-50 text-emerald-700 ring-emerald-600/15" },
  partial: { label: "Partial source match", style: "bg-blue-50 text-blue-700 ring-blue-600/15" },
  "chapter-only": { label: "Chapter-level match only", style: "bg-amber-50 text-amber-700 ring-amber-600/15" },
  "needs-verification": { label: "Section needs verification", style: "bg-gray-100 text-gray-600 ring-gray-500/15" },
};

const LOCATION_OPTIONS = [
  "Front yard", "Side yard", "Rear yard", "Driveway",
  "Exterior wall", "Pool area", "Inside unit", "Unknown",
];

const UPLOAD_TIPS = [
  "Take a clear photo in good lighting — avoid blur, screenshots, or heavy crops.",
  "Include a wide shot for context and a close-up for detail.",
  "Show the full object or condition, not just a corner.",
  "Fences: capture the whole fence and the surrounding area.",
  "Pool fences: include the gate and the pool area.",
  "Plants: include leaves, stems, flowers, berries, or seed heads.",
  "Landscaping: show the whole front/side/rear yard surface.",
];

export default function PhotoReviewPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [analysis, setAnalysis] = useState<PhotoReviewAI | null>(null);
  const [matches, setMatches] = useState<PhotoReviewMatch[]>([]);
  const [noStrongMatch, setNoStrongMatch] = useState(false);
  const [noiseResult, setNoiseResult] = useState(false);
  const [aiError, setAiError] = useState<string>("");
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [debug, setDebug] = useState<PhotoReviewDebug | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close the preview lightbox with Escape and lock body scroll while open.
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoomOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomOpen]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    resetResult();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    resetResult();
  }

  function resetResult() {
    setAiStatus("idle");
    setAnalysis(null);
    setMatches([]);
    setNoStrongMatch(false);
    setNoiseResult(false);
    setAiError("");
    setShowAllMatches(false);
    setDebug(null);
  }

  function handleClear() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIssueType("");
    setLocation("");
    setDescription("");
    resetResult();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /** Curated, source-based fallback from description + optional selected issue/location. */
  function runLocalMatch() {
    const hint = [description, location && location !== "Unknown" ? location : ""].filter(Boolean).join(" ");
    const local = curatedMatch({ userDescription: hint, selectedIssueId: issueType || undefined });
    if (local.noise) {
      setNoiseResult(true);
      setMatches([]);
    } else {
      setMatches(local.matches);
      setNoStrongMatch(local.noStrongMatch);
    }
  }

  async function handleReview() {
    resetResult();
    setIsReviewing(true);

    if (issueType === "noise") {
      setNoiseResult(true);
      setIsReviewing(false);
      return;
    }

    // Baseline curated match always works (no AI required).
    runLocalMatch();

    // When an image is provided, run AI vision + the PDF-derived section
    // retriever server-side and prefer its richer, source-backed matches.
    if (selectedFile) {
      setAiStatus("loading");
      try {
        const status = await fetch("/api/ai/status").then((r) => r.json()).catch(() => null);
        if (!status?.photoReview) {
          setAiStatus("unavailable");
        } else {
          const img = await downscaleImage(selectedFile);
          const fd = new FormData();
          fd.append("image", img);
          if (issueType) fd.append("issueType", issueType);
          if (location && location !== "Unknown") fd.append("location", location);
          if (description) fd.append("description", description);
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 60_000);
          let data: { aiEnabled?: boolean; noise?: boolean; error?: string; result?: PhotoReviewResult };
          try {
            const res = await fetch("/api/ai/photo-review", { method: "POST", body: fd, signal: controller.signal });
            data = await res.json();
          } finally {
            clearTimeout(timer);
          }
          if (data.aiEnabled === false) setAiStatus("unavailable");
          else if (data.noise) { setNoiseResult(true); setMatches([]); setAiStatus("noise"); }
          else if (data.error) { setAiError(data.error); setAiStatus("error"); }
          else if (data.result) {
            setAnalysis(data.result.analysis);
            setMatches(data.result.matches);
            setNoStrongMatch(data.result.noStrongMatch);
            setDebug(data.result.debug ?? null);
            setAiStatus("done");
          } else setAiStatus("unavailable");
        }
      } catch {
        setAiError("AI analysis is currently unavailable. You can still use the source-based matches and official links below.");
        setAiStatus("error");
      }
    }

    setIsReviewing(false);
  }

  const hasResult = noiseResult || matches.length > 0 || ["done", "unavailable", "error", "noise"].includes(aiStatus);
  const canReview = (!!selectedFile || !!description.trim() || !!issueType) && !isReviewing;

  const steps = [
    { n: 1, label: "Upload photo", done: !!selectedFile },
    { n: 2, label: "Analyze", done: hasResult },
    { n: 3, label: "Review matches", done: hasResult },
  ];

  const visibleMatches = showAllMatches ? matches : matches.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-br from-violet-50 to-violet-100 text-violet-700 ring-1 ring-inset ring-violet-600/10 mb-4">
          <Camera className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="kicker">Preliminary Reference Helper</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Photo Review Helper</h1>
        <p className="text-gray-500 max-w-2xl">
          Upload a photo and the helper carefully describes what it sees, classifies a <strong>possible</strong> issue, then searches the matching Toronto Municipal Code chapter to find the most relevant section — no need to pick an issue type. This is a preliminary reference tool, not an official determination.
        </p>
      </div>

      {/* Progress steps */}
      <ol className="flex items-center gap-2 mb-8" aria-label="Steps">
        {steps.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              s.done ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {s.done ? <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> : <span className="w-3 h-3 text-center leading-3">{s.n}</span>}
              {s.label}
            </span>
            {i < steps.length - 1 && <span className="w-6 h-px bg-gray-200" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Upload + Options */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
              previewUrl
                ? "border-violet-200 bg-violet-50/20"
                : "border-violet-200/70 bg-gradient-to-br from-violet-50/50 to-white hover:border-violet-300 hover:from-violet-50/80 hover:shadow-[0_20px_44px_-22px_rgba(124,58,237,0.4)] cursor-pointer"
            }`}
            style={{ minHeight: 220 }}
          >
            {previewUrl ? (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }}
                  aria-label="Enlarge uploaded photo"
                  className="group relative block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Your uploaded photo preview" className="w-full h-full object-cover max-h-56" />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/55 text-white text-[11px] font-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" aria-hidden="true" /> Enlarge
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClear(); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors z-10"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-3 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 ring-1 ring-inset ring-violet-600/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <Upload className="w-6 h-6 text-violet-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">Drop an image here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse · PNG, JPG, WEBP</p>
                </div>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload a photo" />

          {!previewUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FileImage className="w-4 h-4" aria-hidden="true" />
              Browse Files
            </button>
          )}

          {selectedFile && (
            <p className="text-xs text-gray-400 text-center truncate px-2">{selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          )}

          {/* Upload tips */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60">
            <button
              onClick={() => setTipsOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left"
              aria-expanded={tipsOpen}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> Upload tips for better results
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${tipsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {tipsOpen && (
              <ul className="px-4 pb-3.5 flex flex-col gap-1.5">
                {UPLOAD_TIPS.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-gray-500"><span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" aria-hidden="true" /> {t}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Optional issue-type hint (analysis works without it) */}
          <div>
            <label htmlFor="issue-type" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Help guide the analysis <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <select
                id="issue-type"
                value={issueType}
                onChange={(e) => { setIssueType(e.target.value); resetResult(); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-400 transition-colors pr-8"
              >
                <option value="">Auto-detect from the photo…</option>
                {photoReviewIssues.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            </div>
            <p className="text-xs text-gray-400 mt-1">A hint only — the helper detects issues from the photo automatically.</p>
          </div>

          {/* Optional location context */}
          <div>
            <label htmlFor="location" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Where is this? <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <select
                id="location"
                value={location}
                onChange={(e) => { setLocation(e.target.value); resetResult(); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-400 transition-colors pr-8"
              >
                <option value="">Not specified…</option>
                {LOCATION_OPTIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              What are you concerned about? <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you see — e.g. 'The cladding is peeling off the east wall, exposing bare wood.'"
              rows={3}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <ShieldAlert className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-gray-500">
              Do not upload images containing faces, licence plates, private personal information, or anything you are not comfortable sharing. Uploaded images are used only to generate a reference result and are not stored.
            </p>
          </div>

          {/* Analyze button */}
          {!hasResult && (
            <button
              onClick={handleReview}
              disabled={!canReview}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Analyzing photo…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Analyze Photo
                </>
              )}
            </button>
          )}

          {hasResult && (
            <button
              onClick={handleClear}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Empty state */}
          {!hasResult && !isReviewing && (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center h-full min-h-[320px]">
              <Camera className="w-12 h-12 text-gray-200 mb-4" aria-hidden="true" />
              <p className="font-medium text-gray-500 mb-1">Your reference result will appear here</p>
              <p className="text-sm text-gray-400 max-w-xs">
                {selectedFile ? "Click “Analyze Photo” to detect the issue and find the matching bylaw chapter and section." : "Upload a photo (or add a description), then click “Analyze Photo”."}
              </p>
            </div>
          )}

          {/* Loading */}
          {isReviewing && (
            <div className="bg-violet-50 rounded-2xl border border-violet-100 p-8 flex flex-col items-center justify-center h-full min-h-[320px]">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" aria-hidden="true" />
              <p className="text-sm text-violet-700 font-semibold mb-1">Analyzing your photo…</p>
              <p className="text-xs text-violet-400">{selectedFile ? "Reading the image, then searching the matching bylaw sections" : "Matching your description to Toronto bylaw chapters"}</p>
            </div>
          )}

          {/* Stage 1 — Image understanding */}
          {aiStatus === "done" && analysis && <ImageUnderstanding analysis={analysis} />}

          {/* AI unavailable / error notice (matcher result still shown below) */}
          {(aiStatus === "unavailable" || aiStatus === "error") && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-blue-100 bg-blue-50/60">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-blue-900">{aiError || "AI image analysis is currently unavailable. The source-based matches below are based on your description and selection."}</p>
            </div>
          )}

          {/* Noise — Coming Soon only */}
          {noiseResult && (
            <div className="bg-white rounded-2xl border border-amber-100 subtle-shadow overflow-hidden">
              <div className="bg-amber-50 px-5 py-4 flex items-center gap-3 border-b border-amber-100">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm text-amber-900">Noise Complaints — Coming Soon</p>
                  <p className="text-xs text-amber-700">Content Under Development</p>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Noise-related content is currently under development and is not yet available here. For now, please use the official City of Toronto resources for noise concerns.
                </p>
                <a
                  href={OFFICIAL_311_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white font-medium text-sm rounded-xl hover:bg-amber-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  Visit Official City Resources
                </a>
                <Link href="/noise-complaints" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Learn more about Noise Complaints status →
                </Link>
              </div>
            </div>
          )}

          {/* Possible Issue Matches */}
          {!noiseResult && matches.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-1">
                <SearchCheck className="w-4 h-4 text-violet-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-violet-900">
                  Possible Issue Match{matches.length > 1 ? "es" : ""}
                  <span className="text-gray-400 font-normal"> · {matches.length} found</span>
                </p>
              </div>

              {visibleMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}

              {matches.length > 3 && (
                <button
                  onClick={() => setShowAllMatches((v) => !v)}
                  className="self-start text-sm font-medium text-violet-700 hover:text-violet-800"
                >
                  {showAllMatches ? "Show fewer matches" : `Show ${matches.length - 3} more possible match${matches.length - 3 > 1 ? "es" : ""}`}
                </button>
              )}

              <a
                href={OFFICIAL_311_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white font-medium text-sm rounded-xl hover:bg-violet-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Report through City of Toronto 311
              </a>

              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-gray-500">
                  This is a <strong>preliminary reference result</strong> only — not an official enforcement finding or a City of Toronto decision. Section references and excerpts come from the Toronto Municipal Code source documents; anything shown as &ldquo;needs verification&rdquo; should be confirmed against the official bylaw. Always verify concerns through Toronto 311.
                </p>
              </div>
            </>
          )}

          {/* No strong match */}
          {!noiseResult && matches.length === 0 && hasResult && (
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow p-5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm text-gray-900 mb-0.5">No clear bylaw match yet</p>
                <p className="text-sm text-gray-600">
                  The helper could not confidently match a bylaw topic. Try a clearer, well-lit photo, add a short description or location, or browse the{" "}
                  <Link href="/tmc-chapters" className="text-blue-600 hover:text-blue-700 font-medium">bylaw chapters</Link> directly.
                </p>
              </div>
            </div>
          )}

          {/* Development-only retrieval debug panel */}
          {debug && <DebugPanel analysis={analysis} debug={debug} />}
        </div>
      </div>

      {/* Uploaded-photo lightbox (click to enlarge) */}
      {zoomOpen && previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged uploaded photo"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            autoFocus
            onClick={() => setZoomOpen(false)}
            aria-label="Close enlarged image"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Your uploaded photo, enlarged"
            className="max-h-[88vh] max-w-full w-auto h-auto rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ─── Stage 1: image understanding panel ─────────────────────────────────────
function ImageUnderstanding({ analysis: a }: { analysis: PhotoReviewAI }) {
  const limitations = a.imageQuality?.limitations ?? [];
  return (
    <div className="bg-white rounded-2xl border border-violet-100 subtle-shadow overflow-hidden">
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 px-5 py-4 flex items-center gap-3 border-b border-violet-100">
        <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-violet-900">Image understanding — what appears visible</p>
          <p className="text-xs text-violet-700">Reference only · not an official determination</p>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${CONF_STYLE[a.confidence]}`}>
          {a.confidence} confidence
        </span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {a.possibleIssueCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {a.possibleIssueCategories.map((c) => (
              <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/15">{c}</span>
            ))}
          </div>
        )}
        {a.visibleObservations.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> What appears visible</p>
            <ul className="flex flex-col gap-1.5">
              {a.visibleObservations.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {o}</li>
              ))}
            </ul>
          </div>
        )}
        {a.detectedObjects.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Objects</span>
            {a.detectedObjects.map((o) => (
              <span key={o} className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{o}</span>
            ))}
          </div>
        )}
        {a.plainLanguageExplanation && (
          <div className="flex items-start gap-2">
            <p className="text-sm text-gray-600 leading-relaxed flex-1">{a.plainLanguageExplanation}</p>
            <CopyButton text={a.plainLanguageExplanation} label="Copy" copiedLabel="Copied" />
          </div>
        )}

        {/* Location + image quality */}
        <div className="flex flex-wrap gap-2 text-xs">
          {a.locationContext?.likelyArea && a.locationContext.likelyArea !== "unknown" && (
            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 ring-1 ring-inset ring-gray-200 px-2 py-1 rounded-lg">
              <MapPin className="w-3 h-3 text-gray-400" aria-hidden="true" /> {a.locationContext.likelyArea}
            </span>
          )}
          {a.imageQuality && (
            <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 ring-1 ring-inset ring-gray-200 px-2 py-1 rounded-lg">
              <ImageIcon className="w-3 h-3 text-gray-400" aria-hidden="true" /> clarity {a.imageQuality.clarity} · {a.imageQuality.lighting} light
            </span>
          )}
        </div>

        {/* Negative findings — what is NOT visible */}
        {a.negativeFindings.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><EyeOff className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" /> Not visible in this photo</p>
            <ul className="flex flex-col gap-1">
              {a.negativeFindings.map((n) => (
                <li key={n} className="flex items-start gap-2 text-xs text-gray-500"><span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" aria-hidden="true" /> {n}</li>
              ))}
            </ul>
          </div>
        )}

        {(limitations.length > 0 || a.imageQualityNotes) && (
          <p className="text-xs text-gray-400 italic">{[a.imageQualityNotes, ...limitations].filter(Boolean).join(" ")}</p>
        )}
        <AIReferenceDisclaimer variant="image" />
      </div>
    </div>
  );
}

// ─── Single possible-issue match card ───────────────────────────────────────
function MatchCard({ match: m }: { match: PhotoReviewMatch }) {
  const coverage = COVERAGE[m.sourceCoverage];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow overflow-hidden flex flex-col">
      <div className="px-5 py-4 flex items-center gap-3 bg-violet-50 border-b border-violet-100">
        <SearchCheck className="w-5 h-5 text-violet-600 flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-violet-900 truncate">Possible Issue: {m.issueCategory}</p>
          <p className="text-xs text-violet-600">Preliminary reference result</p>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${CONF_STYLE[m.confidence]}`}>
          {m.confidence} confidence
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Source coverage + matched keywords */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${coverage.style}`}>{coverage.label}</span>
          {m.matchedKeywords.slice(0, 6).map((k) => (
            <span key={k} className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              <Tag className="w-3 h-3 text-gray-400" aria-hidden="true" /> {k}
            </span>
          ))}
        </div>

        {/* Related bylaw chapter */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Related Bylaw Chapter</p>
          {m.chapterSlug ? (
            <Link href={m.internalUrl} className="text-sm text-blue-600 font-medium hover:text-blue-700">{m.chapter}</Link>
          ) : (
            <p className="text-sm text-gray-700 font-medium">{m.chapter}</p>
          )}
        </div>

        {/* Related sections (source-backed) */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Related Bylaw Section{m.relatedSections.length > 1 ? "s" : ""}</p>
          <div className="flex flex-col gap-2.5">
            {m.relatedSections.map((s, i) => (
              <div
                key={`${s.sectionNumber}-${i}`}
                className={`rounded-xl border p-3.5 ${s.verificationStatus === "verified" ? "border-emerald-100 bg-emerald-50/40" : "border-amber-100 bg-amber-50/40"}`}
              >
                <div className="flex items-start gap-2 flex-wrap">
                  {s.verificationStatus === "verified" ? (
                    <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">{s.sectionNumber}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700"><AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> {s.sectionNumber}</span>
                  )}
                  <span className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                    <ScrollText className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" /> {s.sectionTitle}
                  </span>
                  {s.chapterNumber && s.chapterNumber !== m.chapterNumber && (
                    <span className="text-[10px] text-gray-400">(Chapter {s.chapterNumber})</span>
                  )}
                </div>
                {s.sourceExcerpt && (
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed border-l-2 border-gray-200 pl-2.5 flex gap-1.5">
                    <Quote className="w-3 h-3 text-gray-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>“{s.sourceExcerpt}{s.sourceExcerpt.length >= 290 ? "…" : ""}”</span>
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-wide font-semibold ${s.verificationStatus === "verified" ? "text-emerald-700" : "text-amber-700"}`}>
                    {s.verificationStatus === "verified" ? "Verified from source" : "Needs verification"}
                  </span>
                  {s.sourceUrl && (
                    <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" aria-hidden="true" /> View official source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why this matched */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Why this may apply</p>
          <p className="text-sm text-gray-600 leading-relaxed">{m.explanation}</p>
          {m.whyMatched && <p className="text-xs text-gray-400 mt-1.5">{m.whyMatched}</p>}
          {m.whyNotHigher && <p className="text-xs text-amber-600 mt-1">{m.whyNotHigher}</p>}
        </div>

        {/* What would confirm this */}
        {m.requiredClues.length > 0 && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" aria-hidden="true" /> To confirm this, include</p>
            <ul className="flex flex-col gap-1">
              {m.requiredClues.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs text-blue-900"><span className="w-1 h-1 rounded-full bg-blue-300 flex-shrink-0 mt-1.5" aria-hidden="true" /> {c}</li>
              ))}
            </ul>
          </div>
        )}

        {m.evidenceChecklist.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" aria-hidden="true" /> Evidence to collect</p>
            <ul className="flex flex-col gap-1.5">
              {m.evidenceChecklist.map((ev) => (
                <li key={ev} className="flex items-start gap-2 text-sm text-amber-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {ev}
                </li>
              ))}
            </ul>
          </div>
        )}

        {m.nextSteps.length > 0 && (
          <div className="p-3.5 bg-blue-50 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1.5">Recommended next steps</p>
            <ul className="flex flex-col gap-1.5">
              {m.nextSteps.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-blue-800"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Source-backed related content (guide page + Ask) */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Related BylawGuide pages</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/ask?q=${encodeURIComponent(m.askQuery)}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Ask BylawGuide
            </Link>
            <Link
              href={m.internalUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" /> {m.guideLabel}
            </Link>
          </div>
        </div>

        {/* Official sources */}
        {m.officialSources.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Official sources</p>
            <ul className="flex flex-col gap-1.5">
              {m.officialSources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" /> {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Copy-to-clipboard button ────────────────────────────────────────────────
function CopyButton({ text, label = "Copy", copiedLabel = "Copied" }: { text: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  /** execCommand fallback for when the async Clipboard API is blocked. */
  function legacyCopy(t: string): boolean {
    try {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
  async function onCopy() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      /* async clipboard blocked — try the legacy path below */
    }
    if (!ok) ok = legacyCopy(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? copiedLabel : `${label} result text`}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium ring-1 ring-inset transition-colors flex-shrink-0 ${
        copied
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
          : "bg-white/70 text-violet-700 ring-violet-600/15 hover:bg-white"
      }`}
    >
      {copied ? <Check className="w-3 h-3" aria-hidden="true" /> : <Copy className="w-3 h-3" aria-hidden="true" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

// ─── Development-only retrieval debug panel ──────────────────────────────────
function DebugPanel({ analysis, debug }: { analysis: PhotoReviewAI | null; debug: PhotoReviewDebug }) {
  return (
    <details className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-xs">
      <summary className="cursor-pointer font-semibold text-gray-600 flex items-center gap-1.5">
        <Bug className="w-3.5 h-3.5" aria-hidden="true" /> Retrieval debug (development only)
      </summary>
      <div className="mt-3 flex flex-col gap-2 text-gray-600">
        {analysis && (
          <div>
            <span className="font-semibold">AI labels:</span> {analysis.possibleIssueLabels.join(", ") || "—"}
            <br />
            <span className="font-semibold">Negative findings:</span> {analysis.negativeFindings.join(" · ") || "—"}
            <br />
            <span className="font-semibold">Search keywords:</span> {analysis.searchKeywords.join(" · ") || "—"}
          </div>
        )}
        <div><span className="font-semibold">Selected source chapters:</span> {debug.selectedSourceChapters.join(", ") || "—"}</div>
        <div><span className="font-semibold">Search tokens:</span> {debug.searchTokens.join(", ") || "—"}</div>
        <div>
          <span className="font-semibold">Retrieved sections (score):</span>
          <ul className="mt-1 font-mono">
            {debug.retrievedSections.length === 0 && <li>— none above threshold —</li>}
            {debug.retrievedSections.map((r, i) => (
              <li key={`${r.sectionNumber}-${i}`}>ch{r.chapter} {r.sectionNumber} → {r.score}</li>
            ))}
          </ul>
        </div>
        <div><span className="font-semibold">Dropped categories:</span> {debug.droppedCategories.map((d) => `${d.id} (${d.reason})`).join(", ") || "—"}</div>
        <div><span className="font-semibold">Used curated fallback:</span> {debug.usedCuratedFallback ? "yes" : "no"}</div>
      </div>
    </details>
  );
}
