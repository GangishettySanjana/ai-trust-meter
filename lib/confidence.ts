import type { Confidence } from "./types";

/**
 * The single source of truth for how each confidence state looks and reads.
 * Every visual treatment (chip, card border, trust meter, labels) derives from
 * here so the three states stay internally consistent.
 */
export interface ConfidenceState {
  key: Confidence;
  /** Human label shown on the chip. */
  label: string;
  /** Which trust-meter segment is "lit" for this state. */
  segment: "grounded" | "inferred" | "uncertain";
  /** Tailwind color family name (matches tailwind.config.ts). */
  tone: "grounded" | "inferred" | "uncertain";
  /** Short verb-phrase describing what the AI is doing. */
  stance: string;
}

export const CONFIDENCE: Record<Confidence, ConfidenceState> = {
  high: {
    key: "high",
    label: "Grounded",
    segment: "grounded",
    tone: "grounded",
    stance: "Answer is supported by a cited source",
  },
  medium: {
    key: "medium",
    label: "Inferred",
    segment: "inferred",
    tone: "inferred",
    stance: "Reasoned from partial information",
  },
  low: {
    key: "low",
    label: "Uncertain",
    segment: "uncertain",
    tone: "uncertain",
    stance: "Not found in the available sources",
  },
};

/** The three trust-meter segments, in order of decreasing certainty. */
export const SEGMENTS: { key: ConfidenceState["segment"]; label: string }[] = [
  { key: "grounded", label: "Grounded" },
  { key: "inferred", label: "Inferred" },
  { key: "uncertain", label: "Uncertain" },
];
