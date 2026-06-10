"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Confidence, TrustAnswer } from "@/lib/types";
import { CONFIDENCE, ANSWER_ACTIONS } from "@/lib/confidence";
import ConfidenceChip from "./ConfidenceChip";
import TrustMeter from "./TrustMeter";
import {
  Chevron,
  DocIcon,
  SearchOff,
  ArrowRight,
  CheckCircle,
  Escalate,
  CreditCard,
} from "./icons";

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
  "discretionary",
  "case-by-case",
  "not guaranteed",
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

const REDIRECT_ICON = {
  escalate: Escalate,
  billing: CreditCard,
} as const;

// One consistent keyboard focus ring across every action control.
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2";

/**
 * The consequence row. What an agent may DO with the answer is a property of the
 * confidence state (see ANSWER_ACTIONS), not a page-level condition — so this
 * row reads its entire behavior from the variant config.
 *
 *   grounded  → primary "Insert into reply"
 *   inferred  → "Insert into reply" gated behind a review-before-sending step
 *   uncertain → no insert; two human-redirect affordances instead
 */
function AnswerActions({
  confidence,
  answerText,
  onInsert,
  onReviewSource,
}: {
  confidence: Confidence;
  answerText: string;
  onInsert: (text: string) => void;
  onReviewSource: () => void;
}) {
  const action = ANSWER_ACTIONS[confidence];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inserted, setInserted] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);
  const insertBtnRef = useRef<HTMLButtonElement>(null);
  // Associates the confirm buttons with the warning text so a screen reader
  // announces *why* it's asking, not just the button label.
  const msgId = useId();

  // Move focus into the confirmation step when it opens (keyboard accessibility).
  useEffect(() => {
    if (confirmOpen) {
      confirmRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
  }, [confirmOpen]);

  function doInsert() {
    onInsert(answerText);
    setInserted(true);
    setConfirmOpen(false);
  }

  function cancelConfirm() {
    setConfirmOpen(false);
    insertBtnRef.current?.focus();
  }

  const wrap = "mt-4 border-t border-neutral-200/60 pt-4";

  // After a successful insert, every state collapses to the same confirmation.
  if (inserted) {
    return (
      <div className={wrap}>
        <div className="animate-chip-in flex items-center gap-2 text-[13px] font-semibold text-grounded-fg">
          <CheckCircle className="h-4 w-4" />
          Added to Dana&apos;s reply draft
        </div>
      </div>
    );
  }

  // UNCERTAIN — the insert action is removed entirely; redirect to a human.
  if (action.kind === "redirect") {
    return (
      <div className={wrap}>
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-uncertain-fg">
          This one needs a human
        </div>
        <div className="flex flex-wrap gap-2">
          {action.redirect!.map((r) => {
            const Icon = REDIRECT_ICON[r.icon];
            return (
              <button
                key={r.label}
                type="button"
                title="Demo only"
                aria-label={`${r.label} (demo only)`}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-uncertain/40 bg-white/70 px-3 py-2 text-[13px] font-semibold text-uncertain-fg transition-colors hover:bg-white ${FOCUS_RING}`}
              >
                <Icon className="h-4 w-4" />
                {r.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-neutral-500">
          When the assistant can&apos;t ground an answer, the UI routes the agent
          to a person — instead of letting a guess reach the customer.
        </p>
      </div>
    );
  }

  // GROUNDED / INFERRED — an insert button (inferred gates it behind a confirm).
  return (
    <div className={wrap}>
      {!confirmOpen ? (
        <div className="flex items-center gap-2">
          <button
            ref={insertBtnRef}
            type="button"
            onClick={() =>
              action.kind === "insert-confirm" ? setConfirmOpen(true) : doInsert()
            }
            className={`inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-100 ${FOCUS_RING}`}
          >
            <ArrowRight className="h-4 w-4" />
            {action.primaryLabel}
          </button>
          {action.kind === "insert-confirm" && (
            <span className="text-[12px] text-inferred-fg">Review step before sending</span>
          )}
        </div>
      ) : (
        action.confirm && (
          <div
            ref={confirmRef}
            role="group"
            aria-label="Review this inferred answer before inserting it into the reply"
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelConfirm();
            }}
            className="animate-expand overflow-hidden rounded-lg border border-inferred/30 bg-inferred-soft/70 p-3"
          >
            <p id={msgId} className="text-[13px] leading-relaxed text-inferred-fg">
              {action.confirm.message}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                data-autofocus
                type="button"
                onClick={onReviewSource}
                aria-describedby={msgId}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-inferred/40 bg-white px-3 py-1.5 text-[13px] font-semibold text-inferred-fg transition-colors hover:bg-inferred-soft ${FOCUS_RING}`}
              >
                {action.confirm.reviewLabel}
              </button>
              <button
                type="button"
                onClick={doInsert}
                aria-describedby={msgId}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-inferred px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS_RING}`}
              >
                {action.confirm.insertLabel}
              </button>
              <button
                type="button"
                onClick={cancelConfirm}
                aria-describedby={msgId}
                className={`rounded-lg px-2 py-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-700 ${FOCUS_RING}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function AnswerCard({
  answer,
  animate = false,
  onInsert,
}: {
  answer: TrustAnswer;
  animate?: boolean;
  /**
   * When provided, the card enters "workspace" mode and renders the consequence
   * action row. Omit it (e.g. in the hardcoded Section 2 demo) to show the card
   * with no insert affordance.
   */
  onInsert?: (text: string) => void;
}) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const state = CONFIDENCE[answer.confidence];

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
          Meridian Assist
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
            <blockquote className="animate-expand mt-2 overflow-hidden rounded-lg border border-grounded/25 bg-grounded-soft/50 px-3 py-2 text-[13px] leading-relaxed text-neutral-700">
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
                What I&apos;d need to answer this
              </div>
              <p className="text-[13px] leading-relaxed text-neutral-600">
                {answer.missing_info}
              </p>
            </div>
          )}
        </div>
      )}

      {/* The trust meter — same component on every state, segment shifts */}
      <div className="mt-5 border-t border-neutral-200/70 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            Trust meter
          </span>
          <span className="text-[11px] text-neutral-500">{state.stance}</span>
        </div>
        <TrustMeter confidence={answer.confidence} />
      </div>

      {/* The consequence row — only in workspace mode (when an insert handler exists) */}
      {onInsert && (
        <AnswerActions
          confidence={answer.confidence}
          answerText={answer.answer}
          onInsert={onInsert}
          onReviewSource={() => setWhyOpen(true)}
        />
      )}
    </div>
  );
}
