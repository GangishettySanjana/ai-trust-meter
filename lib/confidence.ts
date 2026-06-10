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

/**
 * The consequence layer: what an agent is allowed to DO with an answer of each
 * confidence level. This is part of the variant system on purpose — the action
 * a card offers is a property of its trust state, not a one-off page condition.
 *
 *   grounded  → insert directly into the customer reply
 *   inferred  → insert, but only after a review-before-sending confirmation
 *   uncertain → no insert at all; redirect the agent to a human instead
 */
export type AnswerActionKind = "insert" | "insert-confirm" | "redirect";

export interface RedirectAction {
  label: string;
  /** Icon key resolved in the AnswerCard. */
  icon: "escalate" | "billing";
}

export interface AnswerActionConfig {
  kind: AnswerActionKind;
  /** Label for the primary insert button (insert / insert-confirm). */
  primaryLabel?: string;
  /** Copy for the inferred confirmation step. */
  confirm?: {
    message: string;
    reviewLabel: string;
    insertLabel: string;
  };
  /** Human-redirect affordances shown instead of an insert (uncertain). */
  redirect?: RedirectAction[];
}

export const ANSWER_ACTIONS: Record<Confidence, AnswerActionConfig> = {
  high: {
    kind: "insert",
    primaryLabel: "Insert into reply",
  },
  medium: {
    kind: "insert-confirm",
    primaryLabel: "Insert into reply",
    confirm: {
      message:
        "This answer is inferred, not taken directly from a policy doc. Review before sending?",
      reviewLabel: "Review source",
      insertLabel: "Insert anyway",
    },
  },
  low: {
    kind: "redirect",
    redirect: [
      { label: "Escalate to manager", icon: "escalate" },
      { label: "Check with billing team", icon: "billing" },
    ],
  },
};
