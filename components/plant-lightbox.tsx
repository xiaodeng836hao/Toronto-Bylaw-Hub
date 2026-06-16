"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { PlantPhoto } from "@/lib/plant-images";
import type { ImageCredit } from "@/lib/plant-images";

function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
  credit,
}: {
  photos: PlantPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  credit?: ImageCredit;
}) {
  const photo = photos[index];
  const multiple = photos.length > 1;
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = useCallback(
    () => onIndex((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndex]
  );
  const next = useCallback(
    () => onIndex((index + 1) % photos.length),
    [index, photos.length, onIndex]
  );

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (multiple && e.key === "ArrowLeft") prev();
      else if (multiple && e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next, multiple]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.stage} — enlarged image`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white/90" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-medium">
          {photo.stage}
          {photo.season ? ` · ${photo.season}` : ""}
          {multiple ? ` · ${index + 1}/${photos.length}` : ""}
        </span>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close enlarged image"
          className="p-2 rounded-lg text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 min-h-0" onClick={(e) => e.stopPropagation()}>
        {multiple && (
          <button
            onClick={prev}
            aria-label="Previous image"
            className="flex-shrink-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.alt} className="max-h-[70vh] max-w-full object-contain rounded-lg" />
        {multiple && (
          <button
            onClick={next}
            aria-label="Next image"
            className="flex-shrink-0 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-white/90 max-w-2xl mx-auto leading-relaxed">{photo.description}</p>
        {credit && (
          <p className="mt-2 text-xs text-white/60">
            Image source:{" "}
            {credit.url ? (
              <a href={credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/80">
                {credit.source}
              </a>
            ) : (
              credit.source
            )}
          </p>
        )}
      </div>
    </div>
  );
}

const stageBadge =
  "absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide text-white bg-black/55 px-1.5 py-0.5 rounded";
const seasonBadge =
  "absolute bottom-2 left-2 text-[10px] font-medium text-white/90 bg-black/45 px-1.5 py-0.5 rounded";
const zoomHint =
  "absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity bg-black/55 rounded-md p-1 flex items-center";

/** Growth-stage gallery: clickable thumbnails (with descriptions) + shared lightbox. */
export function PlantGallery({ photos, credit }: { photos: PlantPhoto[]; credit?: ImageCredit }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function close() {
    setOpen(null);
    triggerRef.current?.focus();
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <figure key={`${photo.stage}-${photo.src}`} className="rounded-xl overflow-hidden border border-gray-100 bg-white">
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Enlarge image: ${photo.stage} — ${photo.alt}`}
              className="group relative block aspect-[4/3] w-full bg-gray-100 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px" className="object-cover" />
              <span className={stageBadge}>{photo.stage}</span>
              {photo.season && <span className={seasonBadge}>{photo.season}</span>}
              <span className={zoomHint}>
                <ZoomIn className="w-3.5 h-3.5 text-white" aria-hidden="true" />
              </span>
            </button>
            <figcaption className="p-3">
              <p className="text-xs text-gray-600 leading-snug">{photo.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      {open !== null && (
        <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={close} credit={credit} />
      )}
    </>
  );
}

/** A single enlargeable image (e.g. a detail-page hero) with caption + source. */
export function EnlargeableImage({
  photo,
  credit,
  caption,
  className = "",
  sizes,
  priority = false,
}: {
  photo: PlantPhoto;
  credit?: ImageCredit;
  caption?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <figure className="rounded-2xl overflow-hidden border border-gray-100 subtle-shadow bg-white">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${photo.alt}`}
        className={`group relative block w-full bg-gray-100 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset ${className}`}
      >
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes ?? "(max-width: 768px) 100vw, 560px"} className="object-cover" priority={priority} />
        <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity bg-black/55 rounded-md px-1.5 py-1 flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          <span className="text-[10px] text-white">Enlarge</span>
        </span>
      </button>
      <figcaption className="p-3">
        {caption && <p className="text-xs text-gray-500">{caption}</p>}
        {credit && <p className="mt-1 text-[10px] text-gray-400">Image source: {credit.source}</p>}
      </figcaption>
      {open && <Lightbox photos={[photo]} index={0} onIndex={() => {}} onClose={close} credit={credit} />}
    </figure>
  );
}
