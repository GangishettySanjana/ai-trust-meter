"use client";

import type { TrustAnswer } from "@/lib/types";
import AnswerCard from "./AnswerCard";

// Static sample answers — one per confidence state — for the documentation display.
const GROUNDED_SAMPLE: TrustAnswer = {
  answer:
    "Yes — monthly plans can be refunded in full within 30 days of the initial purchase, sent to the original payment method within 5–7 business days.",
  confidence: "high",
  source:
    'Refund Policy — "Customers on monthly plans may request a full refund within 30 days of their initial purchase."',
  reasoning: "Stated directly and unambiguously in the refund policy.",
  missing_info: null,
};

const INFERRED_SAMPLE: TrustAnswer = {
  answer:
    "It appears the annual plan may be eligible for a discretionary refund in some cases, but this isn't guaranteed and is reviewed case-by-case.",
  confidence: "medium",
  source:
    'Refund Policy — "Annual plans are not covered by the standard 30-day window… may be eligible for a discretionary, prorated refund on a case-by-case basis."',
  reasoning:
    "The standard refund policy only covers monthly plans. The annual plan clause uses discretionary language, which means it depends on manager approval rather than a fixed rule.",
  missing_info:
    "Whether the account qualifies for the discretionary exception — the policy leaves this to case-by-case judgment.",
};

const UNCERTAIN_SAMPLE: TrustAnswer = {
  answer:
    "I can't find a grounded answer to this in the Meridian docs. This needs a human to review.",
  confidence: "low",
  source: null,
  reasoning: "No document in the knowledge base addresses this scenario.",
  missing_info:
    "A policy doc covering this specific scenario — the current knowledge base doesn't address it.",
};

// Annotation rows shown beneath each card variant.
const ANNOTATIONS: Record<string, Array<{ key: string; label: string; note: string }>> = {
  high: [
    { key: "chip", label: "Confidence chip", note: 'Green "Grounded" chip signals the answer is policy-backed.' },
    { key: "source", label: "Source citation", note: "Expandable inline citation links the answer to the exact doc excerpt." },
    { key: "action", label: "Action row", note: '"Insert into reply" — no friction. Grounded answers go straight to the draft.' },
  ],
  medium: [
    { key: "chip", label: "Confidence chip", note: 'Amber "Inferred" chip and hedge highlighting signal reasoning, not fact.' },
    { key: "source", label: "Source attribution", note: "Partial source shown inline — honest about which doc it's drawing from." },
    { key: "action", label: "Action row", note: 'Insert is gated: a review step appears before the answer reaches the customer.' },
  ],
  low: [
    { key: "chip", label: "Confidence chip", note: '"Uncertain" chip — muted, not alarming. Honest is not the same as broken.' },
    { key: "missing", label: "What I'd need", note: "Surfaces what information would be needed to answer — useful, not silent." },
    { key: "action", label: "Action row", note: "No insert. Two human-redirect affordances replace it entirely." },
  ],
};

function AnnotatedCard({
  answer,
  annotations,
}: {
  answer: TrustAnswer;
  annotations: Array<{ key: string; label: string; note: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* The actual component — no-op onInsert so the action row renders */}
      <AnswerCard answer={answer} onInsert={() => {}} />

      {/* Annotation legend */}
      <div className="space-y-2">
        {annotations.map((a) => (
          <div key={a.key} className="flex gap-2.5 text-[12px] leading-relaxed">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-500 ring-1 ring-neutral-200">
              ↑
            </span>
            <div>
              <span className="font-semibold text-neutral-700">{a.label} — </span>
              <span className="text-neutral-500">{a.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignSystemDocs() {
  return (
    <section className="border-t border-neutral-200/70 bg-neutral-50/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
            04 · The design system
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Three variants. One coherent system.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
            Each confidence state is a complete variant: distinct card surface,
            chip, source treatment, and action row — all derived from the same
            token set so they feel like a family, not three separate components.
          </p>
        </div>

        {/* Three annotated card variants */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-start">
          <AnnotatedCard answer={GROUNDED_SAMPLE} annotations={ANNOTATIONS.high} />
          <AnnotatedCard answer={INFERRED_SAMPLE} annotations={ANNOTATIONS.medium} />
          <AnnotatedCard answer={UNCERTAIN_SAMPLE} annotations={ANNOTATIONS.low} />
        </div>

        {/* Decision callout */}
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-accent/20 bg-accent-soft/40 p-6">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent-fg">
            Design decision
          </div>
          <p className="text-[15px] leading-relaxed text-neutral-700">
            <span className="font-semibold text-neutral-900">
              Why three segments instead of a percentage?
            </span>{" "}
            LLMs can&rsquo;t reliably self-report numeric confidence.
            &ldquo;87% sure&rdquo; would be fake precision — the exact
            dishonesty this system exists to remove. Three named states force
            the model to make a categorical judgment it can actually support,
            and give the agent language they can act on.
          </p>
        </div>
      </div>
    </section>
  );
}
