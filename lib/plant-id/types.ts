// ─────────────────────────────────────────────────────────────────────────────
//  Toronto Bylaw Guide — Plant.id integration types (V6.1)
// ─────────────────────────────────────────────────────────────────────────────

export type MatchConfidence = "low" | "medium" | "high";

export interface PlantIdSuggestion {
  scientificName: string;
  commonNames: string[];
  probability: number;
  taxonomy?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
  plantIdUrl?: string;
  rawName?: string;
}

export interface ProhibitedPlantMatch {
  prohibitedPlantSlug: string;
  commonName: string;
  scientificNames: string[];
  matchedBy: "scientific-name" | "genus" | "common-name" | "synonym" | "manual-alias";
  confidence: MatchConfidence;
  probability: number;
  explanation: string;
  safetyWarnings: string[];
  internalPlantUrl: string;
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface PlantIdentificationResult {
  isPlant: boolean | null;
  topSuggestions: PlantIdSuggestion[];
  prohibitedMatches: ProhibitedPlantMatch[];
  noClearMatch: boolean;
  message: string;
  disclaimer: string;
  officialSources: SourceLink[];
}
