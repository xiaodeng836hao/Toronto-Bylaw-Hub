import Image from "next/image";
import {
  Sprout, Leaf, Flower2, Wind, CircleDot, Snowflake, Wheat, Trees, Sun,
  type LucideIcon,
} from "lucide-react";
import type { StageIcon, Tone, HazardLevel, HazardTag, PlantImage } from "@/lib/prohibited-plants";
import type { PlantPhoto } from "@/lib/plant-images";

/** Stage-icon keys → concrete lucide icons. */
export const STAGE_ICONS: Record<StageIcon, LucideIcon> = {
  sprout: Sprout,
  leaf: Leaf,
  flower: Flower2,
  seed: Wind,
  berry: CircleDot,
  reed: Wheat,
  shrub: Trees,
  dormant: Snowflake,
  sun: Sun,
};

/** Tone keys → Tailwind gradient + text classes for placeholder panels and badges. */
export const TONE_CLASSES: Record<Tone, { panel: string; icon: string; soft: string; softText: string }> = {
  green: { panel: "from-green-50 to-emerald-100", icon: "text-emerald-600", soft: "bg-emerald-50", softText: "text-emerald-700" },
  lime: { panel: "from-lime-50 to-green-100", icon: "text-lime-600", soft: "bg-lime-50", softText: "text-lime-700" },
  amber: { panel: "from-amber-50 to-orange-100", icon: "text-amber-600", soft: "bg-amber-50", softText: "text-amber-700" },
  rose: { panel: "from-rose-50 to-red-100", icon: "text-rose-600", soft: "bg-rose-50", softText: "text-rose-700" },
  violet: { panel: "from-violet-50 to-purple-100", icon: "text-violet-600", soft: "bg-violet-50", softText: "text-violet-700" },
  teal: { panel: "from-teal-50 to-cyan-100", icon: "text-teal-600", soft: "bg-teal-50", softText: "text-teal-700" },
  slate: { panel: "from-slate-100 to-gray-200", icon: "text-slate-600", soft: "bg-slate-100", softText: "text-slate-700" },
};

export const HAZARD_LEVEL_CLASSES: Record<HazardLevel, string> = {
  Low: "bg-green-50 text-green-700 border-green-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Extreme: "bg-red-100 text-red-800 border-red-300",
};

export const HAZARD_TAG_CLASSES: Record<HazardTag, string> = {
  "skin-irritation": "bg-rose-50 text-rose-700",
  "invasive-spread": "bg-amber-50 text-amber-700",
  allergy: "bg-violet-50 text-violet-700",
  "chokes-natives": "bg-emerald-50 text-emerald-700",
};

/**
 * Educational placeholder visual for a plant growth stage. Renders a labelled,
 * icon-based reference panel (not a stock photo). Image source metadata is kept
 * on the data object so real licensed photos can replace these later.
 */
export function PlantImagePanel({
  image,
  size = "md",
  showSource = false,
}: {
  image: PlantImage;
  size?: "sm" | "md";
  showSource?: boolean;
}) {
  const tone = TONE_CLASSES[image.tone];
  const Icon = STAGE_ICONS[image.icon];
  const iconBox = size === "sm" ? "h-24" : "h-32";
  const iconSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <figure className="rounded-xl overflow-hidden border border-gray-100 bg-white">
      <div
        role="img"
        aria-label={image.alt}
        className={`relative ${iconBox} bg-gradient-to-br ${tone.panel} flex items-center justify-center`}
      >
        <Icon className={`${iconSize} ${tone.icon}`} aria-hidden="true" />
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide text-gray-600/80 bg-white/70 px-1.5 py-0.5 rounded">
          {image.stage}
        </span>
        <span className="absolute bottom-1.5 right-2 text-[9px] font-medium text-gray-500/70">
          Reference illustration
        </span>
      </div>
      <figcaption className="p-3">
        <p className="text-xs text-gray-600 leading-snug">{image.caption}</p>
        {showSource && (
          <p className="mt-1.5 text-[10px] text-gray-400">
            Image source: {image.sourceName}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Real cover photo filling a sized/aspect container. The caller sets the
 * size/aspect via `className` (the container is positioned for next/image fill).
 */
export function PlantCoverImage({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 400px"}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

/** A single growth-stage photo with a stage label, season chip, and description. */
export function PlantGalleryItem({ photo, priority = false }: { photo: PlantPhoto; priority?: boolean }) {
  return (
    <figure className="rounded-xl overflow-hidden border border-gray-100 bg-white">
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
          className="object-cover"
          priority={priority}
        />
        <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide text-white bg-black/55 px-1.5 py-0.5 rounded">
          {photo.stage}
        </span>
        {photo.season && (
          <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white/90 bg-black/45 px-1.5 py-0.5 rounded">
            {photo.season}
          </span>
        )}
      </div>
      <figcaption className="p-3">
        <p className="text-xs text-gray-600 leading-snug">{photo.description}</p>
      </figcaption>
    </figure>
  );
}
