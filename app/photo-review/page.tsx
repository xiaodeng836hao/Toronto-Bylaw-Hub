"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera, Upload, X, ExternalLink, Loader2, FileImage,
  Info, CheckCircle2, ChevronDown, Clock, SearchCheck, Maximize2,
  Sparkles, Compass, ListChecks, Eye, ShieldAlert,
} from "lucide-react";
import { photoReviewIssues, getPhotoIssue, OFFICIAL_311_URL } from "@/lib/mock-data";
import AIReferenceDisclaimer from "@/components/AIReferenceDisclaimer";
import type { PhotoReviewAI } from "@/lib/ai/types";

type AiStatus = "idle" | "loading" | "done" | "unavailable" | "noise" | "error";

// Maps a photo-review issue to a related BylawGuide page and an Ask question, so
// results lead to source-backed reference content (never a "confirmed violation").
const ISSUE_LINKS: Record<string, { askQuery: string; guideHref: string; guideLabel: string }> = {
  fence: { askQuery: "How high can my fence be?", guideHref: "/tmc-chapters/447", guideLabel: "Open Fence chapter" },
  "pool-fence": { askQuery: "Does my pool gate need to self-close and self-latch?", guideHref: "/pool-fence-guide", guideLabel: "Open Pool Fence Guide" },
  zoning: { askQuery: "What are the zoning setbacks for my house?", guideHref: "/zoning", guideLabel: "Open Zoning guide" },
  "hvac-ac": { askQuery: "Where can I put my air conditioner or heat pump?", guideHref: "/zoning?topic=hvac-ac-location", guideLabel: "Open Zoning guide" },
  "front-yard-parking": { askQuery: "Can I park in my front yard?", guideHref: "/landscaping", guideLabel: "Open Landscaping guide" },
  "accessory-structures": { askQuery: "Do I need a permit for a shed or detached garage?", guideHref: "/zoning?topic=accessory-structures", guideLabel: "Open Zoning guide" },
  "turfgrass-weeds": { askQuery: "What are Toronto's prohibited plants?", guideHref: "/prohibited-plants", guideLabel: "Open Prohibited Plants" },
  graffiti: { askQuery: "What should I do about graffiti on private property?", guideHref: "/tmc-chapters/485", guideLabel: "Open Chapter 485" },
  "property-standards": { askQuery: "What are property standards?", guideHref: "/tmc-chapters/629", guideLabel: "Open Chapter 629" },
  heating: { askQuery: "What applies to no heat in a rental unit?", guideHref: "/tmc-chapters/497", guideLabel: "Open Chapter 497" },
  "vital-services": { askQuery: "What applies to no heat in a rental unit?", guideHref: "/tmc-chapters/835", guideLabel: "Open Chapter 835" },
  dust: { askQuery: "What bylaw applies to dust from construction?", guideHref: "/tmc-chapters/417", guideLabel: "Open Chapter 417" },
  "waste-dumping": { askQuery: "What about littering or illegal dumping?", guideHref: "/tmc-chapters/548", guideLabel: "Open Chapter 548" },
};

export default function PhotoReviewPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus>("idle");
  const [aiResult, setAiResult] = useState<PhotoReviewAI | null>(null);
  const [aiError, setAiError] = useState<string>("");
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

  const selectedIssue = issueType ? getPhotoIssue(issueType) : undefined;
  const isNoise = selectedIssue?.comingSoon === true;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setReviewed(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setReviewed(false);
  }

  function resetAi() {
    setAiStatus("idle");
    setAiResult(null);
    setAiError("");
  }

  function handleClear() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setReviewed(false);
    setIssueType("");
    setDescription("");
    resetAi();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleReview() {
    if (!issueType && !selectedFile) return;
    resetAi();
    setReviewed(false);
    setIsReviewing(true);

    // Always produce the source-based / rules result when an issue type is set.
    const rulesPromise = new Promise((r) => setTimeout(r, 600));

    // Run real AI image analysis when an image is provided. Falls back quietly
    // to the rules-based result if AI is unavailable.
    if (selectedFile) {
      setAiStatus("loading");
      try {
        const fd = new FormData();
        fd.append("image", selectedFile);
        if (issueType) fd.append("issueType", issueType);
        if (description) fd.append("description", description);
        const res = await fetch("/api/ai/photo-review", { method: "POST", body: fd });
        const data = await res.json();
        if (data.aiEnabled === false) setAiStatus("unavailable");
        else if (data.noise) setAiStatus("noise");
        else if (data.error) { setAiError(data.error); setAiStatus("error"); }
        else if (data.result) { setAiResult(data.result as PhotoReviewAI); setAiStatus("done"); }
        else setAiStatus("unavailable");
      } catch {
        setAiError("AI analysis is currently unavailable. You can still use the source-based guide and official links.");
        setAiStatus("error");
      }
    }

    await rulesPromise;
    setIsReviewing(false);
    if (issueType) setReviewed(true);
  }

  const steps = [
    { n: 1, label: "Upload photo", done: !!selectedFile },
    { n: 2, label: "Choose issue type", done: !!issueType },
    { n: 3, label: "Review match", done: reviewed || isNoise },
  ];

  const canReview = (!!issueType || !!selectedFile) && !isReviewing;
  const analysisDone = reviewed || ["done", "unavailable", "error", "noise"].includes(aiStatus);

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
          Upload a photo and select an issue type to see a <strong>possible</strong> bylaw match with an evidence checklist and a link to Toronto 311. This is a preliminary reference tool — not an official determination.
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

          {/* Issue type selector */}
          <div>
            <label htmlFor="issue-type" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Possible Issue Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="issue-type"
                value={issueType}
                onChange={(e) => { setIssueType(e.target.value); setReviewed(false); }}
                className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-400 transition-colors pr-8"
              >
                <option value="">Select an issue type…</option>
                {photoReviewIssues.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Description <span className="text-gray-400 font-normal normal-case">(optional)</span>
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
          {!analysisDone && !isNoise && (
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

          {(analysisDone || isNoise) && (
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
          {!analysisDone && !isReviewing && !isNoise && (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center h-full min-h-[320px]">
              <Camera className="w-12 h-12 text-gray-200 mb-4" aria-hidden="true" />
              <p className="font-medium text-gray-500 mb-1">Your reference result will appear here</p>
              <p className="text-sm text-gray-400 max-w-xs">
                {selectedFile ? "Click “Analyze Photo” to get a possible-issue reference result." : "Upload a photo (and optionally choose an issue type), then click “Analyze Photo”."}
              </p>
            </div>
          )}

          {/* Loading */}
          {isReviewing && (
            <div className="bg-violet-50 rounded-2xl border border-violet-100 p-8 flex flex-col items-center justify-center h-full min-h-[320px]">
              <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" aria-hidden="true" />
              <p className="text-sm text-violet-700 font-semibold mb-1">Analyzing your photo…</p>
              <p className="text-xs text-violet-400">{selectedFile ? "Looking for possible bylaw-related topics in the image" : "Comparing your selected issue to Toronto bylaw chapters"}</p>
            </div>
          )}

          {/* AI image analysis result */}
          {aiStatus === "done" && aiResult && (
            <div className="bg-white rounded-2xl border border-violet-100 subtle-shadow overflow-hidden">
              <div className="bg-gradient-to-br from-violet-50 to-indigo-50 px-5 py-4 flex items-center gap-3 border-b border-violet-100">
                <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-violet-900">AI image analysis — possible bylaw topics</p>
                  <p className="text-xs text-violet-700">Reference only · not an official determination</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ring-1 ring-inset ${aiResult.confidence === "high" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : aiResult.confidence === "medium" ? "bg-blue-50 text-blue-700 ring-blue-600/15" : "bg-amber-50 text-amber-700 ring-amber-600/15"}`}>
                  {aiResult.confidence} confidence
                </span>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {aiResult.possibleIssueCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {aiResult.possibleIssueCategories.map((c) => (
                      <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/15">{c}</span>
                    ))}
                  </div>
                )}
                {aiResult.visibleObservations.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> What appears visible</p>
                    <ul className="flex flex-col gap-1.5">
                      {aiResult.visibleObservations.map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-gray-700"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {o}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiResult.plainLanguageExplanation && (
                  <p className="text-sm text-gray-600 leading-relaxed">{aiResult.plainLanguageExplanation}</p>
                )}
                {(aiResult.relatedChapters.length > 0 || aiResult.relatedSections.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Possible related</span>
                    {aiResult.relatedChapters.map((c) => (
                      <span key={c} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                    {aiResult.relatedSections.map((s) => (
                      <span key={s} className="font-mono text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                )}
                {aiResult.evidenceChecklist.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5 text-violet-500" aria-hidden="true" /> Evidence to gather</p>
                    <ul className="flex flex-col gap-1.5">
                      {aiResult.evidenceChecklist.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" aria-hidden="true" /> {e}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiResult.recommendedNextSteps.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-100">
                    <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide mb-1.5">Recommended next steps</p>
                    <ul className="flex flex-col gap-1.5">
                      {aiResult.recommendedNextSteps.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-violet-900"><span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" aria-hidden="true" /> {s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiResult.sourceSearchTerms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {aiResult.sourceSearchTerms.slice(0, 6).map((t) => (
                      <Link key={t} href={`/ask?q=${encodeURIComponent(t)}`} className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">Ask: {t}</Link>
                    ))}
                  </div>
                )}
                <AIReferenceDisclaimer variant="image" />
              </div>
            </div>
          )}

          {/* AI unavailable / error notices (source-based result still shown) */}
          {(aiStatus === "unavailable" || aiStatus === "error") && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl border border-blue-100 bg-blue-50/60">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-blue-900">{aiError || "AI analysis is currently unavailable. You can still use the source-based guide and official links below."}</p>
            </div>
          )}

          {/* AI detected a noise topic */}
          {aiStatus === "noise" && (
            <div className="bg-white rounded-2xl border border-amber-100 subtle-shadow p-5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-sm text-amber-900 mb-0.5">Noise Complaints — Coming Soon</p>
                <p className="text-sm text-gray-600">Noise Complaints content is currently under development.</p>
              </div>
            </div>
          )}

          {/* Noise — Coming Soon */}
          {isNoise && (
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

          {/* Result card */}
          {reviewed && selectedIssue?.result && (
            <div className="bg-white rounded-2xl border border-gray-100 subtle-shadow overflow-hidden flex flex-col">
              <div className="px-5 py-4 flex items-center gap-3 bg-violet-50 border-b border-violet-100">
                <SearchCheck className="w-5 h-5 text-violet-600 flex-shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-violet-900">Possible Issue Match</p>
                  <p className="text-xs text-violet-600">Preliminary reference result</p>
                </div>
              </div>

              <div className="p-5 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Possible Issue</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedIssue.result.possibleIssue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Related Chapter</p>
                    {selectedIssue.result.chapter && selectedIssue.result.chapterSlug ? (
                      <Link href={`/tmc-chapters/${selectedIssue.result.chapterSlug}`} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        {selectedIssue.result.chapter}
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-500">{selectedIssue.result.chapter ?? "—"}</p>
                    )}
                    {selectedIssue.result.section && <p className="text-xs text-gray-400 mt-0.5">{selectedIssue.result.section}</p>}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Simple Explanation</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedIssue.result.explanation}</p>
                </div>

                {selectedIssue.result.evidenceChecklist.length > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Evidence Checklist</p>
                    <ul className="flex flex-col gap-1.5">
                      {selectedIssue.result.evidenceChecklist.map((ev) => (
                        <li key={ev} className="flex items-start gap-2 text-sm text-amber-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3.5 bg-blue-50 rounded-xl">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Recommended Next Step</p>
                  <p className="text-sm text-blue-800">{selectedIssue.result.nextStep}</p>
                </div>

                {/* Source-backed related content (Ask + related guide) */}
                {ISSUE_LINKS[selectedIssue.value] && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Learn more — source-based reference</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/ask?q=${encodeURIComponent(ISSUE_LINKS[selectedIssue.value].askQuery)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Ask BylawGuide
                      </Link>
                      <Link
                        href={ISSUE_LINKS[selectedIssue.value].guideHref}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" aria-hidden="true" /> {ISSUE_LINKS[selectedIssue.value].guideLabel}
                      </Link>
                    </div>
                  </div>
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
                    This is a <strong>preliminary reference result</strong> based on the issue type you selected — not real image analysis, an official enforcement finding, or a City of Toronto decision. Always verify concerns through Toronto 311.
                  </p>
                </div>
              </div>
            </div>
          )}
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
