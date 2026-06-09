"use client";

import { useState } from "react";
import type { TrustAnswer } from "@/lib/types";
import { CONFIDENCE } from "@/lib/confidence";
import ConfidenceChip from "./ConfidenceChip";
import TrustMeter from "./TrustMeter";
import { Chevron, DocIcon, SearchOff, ArrowRight } from "./icons";

// Per-tone card surface treatment. Each state should FEEL different at a glance,
// without relying on color alone — borders, texture, and structure differ too.
const CARD_TONE = {
  high: "border-grounded/25 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(26,127,82,0.18)]",
  medium: "border-inferred/30 bg-[#fffdf8] shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
  low: "border-uncertain/40 border-dashed bg-uncertain-soft/40 bg-hatch",
} as const;

// Hedge phrases the medium state visually surfaces, so "soft" language reads as
// an intentional signal rather than vague writing.
const HEDGES = [
  "likely",
  "appears",
  "it appears",
  "based on the available docs",
  "based on the docs",
  "probably",
  "may ",
  "might ",
  "seems",
  "suggests",
  "could be",
  "i'd estimate",
];

function HighlightHedges({ text }: { text: string }) {
  // Split the answer on any hedge phrase (case-insensitive) and wrap matches.
  const pattern = new RegExp(`(${HEDGES.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "ig");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        HEDGES.some((h) => h.toLowerCase() === part.toLowerCase().trim()) ? (
          <mark
            key={i}
            className="rounded bg-inferred-soft px-1 py-0.5 font-medium text-inferred-fg decoration-inferred/40 underline-offset-2"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function Expander({
  open,
  onToggle,
  label,
  children,
  tone,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  children: React.ReactNode;
  tone: "grounded" | "inferred" | "uncertain";
}) {
  const toneText = {
    grounded: "text-grounded-fg hover:bg-grounded-soft",
    inferred: "text-inferred-fg hover:bg-inferred-soft",
    uncertain: "text-uncertain-fg hover:bg-uncertain-soft",
  }[tone];

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`group inline-flex items-center gap-1.5 rounded-md px-2 py-1 -ml-2 text-xs font-semibold transition-colors ${toneText}`}
      >
        <Chevron
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-0" : "-rotate-90"}`}
        />
        {label}
      </button>
      {open && <div className="animate-expand overflow-hidden">{children}</div>}
    </div>
  );
}

export default function AnswerCard({
  answer,
  animate = false,
}: {
  answer: TrustAnswer;
  animate?: boolean;
}) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const state = CONFIDENCE[answer.confidence];
  const tone = state.tone;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${CARD_TONE[answer.confidence]} ${
        animate ? "animate-fade-in-up" : ""
      }`}
    >
      {/* Header: stance + animated chip */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Meridian Assistant
        </div>
        <ConfidenceChip confidence={answer.confidence} animate={animate} />
      </div>

      {/* The answer body */}
      <p
        className={`text-[15px] leading-relaxed ${
          answer.confidence === "low" ? "text-uncertain-fg" : "text-neutral-800"
        }`}
      >
        {answer.confidence === "medium" ? (
          <HighlightHedges text={answer.answer} />
        ) : (
          answer.answer
        )}
      </p>

      {/* HIGH — inline, clickable source citation that expands to the excerpt */}
      {answer.confidence === "high" && answer.source && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setSourceOpen((v) => !v)}
            aria-expanded={sourceOpen}
            className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-grounded/30 bg-grounded-soft px-2.5 py-1.5 text-xs font-semibold text-grounded-fg transition-colors hover:bg-grounded-soft/70"
          >
            <DocIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Source cited</span>
            <Chevron
              className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${sourceOpen ? "rotate-0" : "-rotate-90"}`}
            />
          </button>
          {sourceOpen && (
            <blockquote className="animate-expand mt-2 overflow-hidden rounded-lg border-l-2 border-grounded/50 bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-neutral-600">
              {answer.source}
            </blockquote>
          )}
        </div>
      )}

      {/* MEDIUM — "show me why" reasoning + what's missing */}
      {answer.confidence === "medium" && (
        <div className="mt-4 space-y-3">
          {answer.source && (
            <div className="flex items-start gap-1.5 text-[13px] text-neutral-500">
              <DocIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-inferred" />
              <span>{answer.source}</span>
            </div>
          )}
          <Expander
            open={whyOpen}
            onToggle={() => setWhyOpen((v) => !v)}
            label="Show me why"
            tone="inferred"
          >
            <div className="mt-2 space-y-2 rounded-lg bg-inferred-soft/60 p-3 text-[13px] leading-relaxed text-inferred-fg">
              <p>{answer.reasoning}</p>
              {answer.missing_info && (
                <p className="border-t border-inferred/20 pt-2 text-neutral-600">
                  <span className="font-semibold text-inferred-fg">To be sure:</span>{" "}
                  {answer.missing_info}
                </p>
              )}
            </div>
          </Expander>
        </div>
      )}

      {/* LOW — honest "I'm not sure", not an error. What I'd need + next step. */}
      {answer.confidence === "low" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-uncertain-fg">
            <SearchOff className="h-3.5 w-3.5" />
            No grounding source found in the Meridian docs
          </div>
          {answer.missing_info && (
            <div className="rounded-lg border border-uncertain/30 bg-white/70 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-uncertain-fg">
                What I'd need to answer this
              </div>
              <p className="text-[13px] leading-relaxed text-neutral-600">
                {answer.missing_info}
              </p>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[13px] text-neutral-500">
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-uncertain" />
            Try rephrasing, or route this to a human teammate.
          </div>
        </div>
      )}

      {/* The trust meter — same component on every state, segment shifts */}
      <div className="mt-5 border-t border-neutral-200/70 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
            Trust meter
          </span>
          <span className="text-[11px] text-neutral-400">{state.stance}</span>
        </div>
        <TrustMeter confidence={answer.confidence} />
      </div>
    </div>
  );
}
