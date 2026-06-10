"use client";

import { useState } from "react";
import type { TrustAnswer } from "@/lib/types";
import AnswerCard from "./AnswerCard";

// The shared question — the same refund case the live demo runs on, so the two
// sections tell one continuous story. Acme is on an annual plan, 45 days in: a
// genuine gray area the docs only partly cover.
const QUESTION = "Can we still refund Acme 45 days after signup?";

// "Today's AI" — fluent, specific, authoritative, and confidently wrong (45 days
// is past the 30-day window, and annual plans aren't covered by it at all).
const NAIVE_ANSWER =
  "Yes — Acme is covered by Meridian's 30-day money-back guarantee, so Dana is eligible for a full refund. It'll be processed to the original payment method within 5–7 business days.";

// The exact same situation, wrapped in the confidence-state system. The docs
// define a clean 30-day window but leave the 45-day annual case to a
// discretionary exception — so this is honestly an inferred answer, not a fact.
const TRUST_ANSWER: TrustAnswer = {
  answer:
    "It's not clear-cut. Acme is past the standard 30-day window, and their annual plan isn't covered by it. There's a discretionary exception for annual customers, so a prorated refund may be possible — but it's case-by-case and not guaranteed.",
  confidence: "medium",
  source:
    'Refund Policy — "Annual plans are not covered by the standard 30-day window… may be eligible for a discretionary, prorated refund on a case-by-case basis."',
  reasoning:
    "The docs define a clean 30-day window for monthly plans, but Acme is on an annual plan at 45 days — that falls under a discretionary exception, not a guaranteed refund.",
  missing_info:
    "Whether a manager will approve the exception for this account — the policy leaves it to case-by-case judgment.",
};

function PlainCard({ animate }: { animate: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-6 ${
        animate ? "animate-fade-in-up" : ""
      }`}
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
        AI Assistant
      </div>
      <p className="text-[15px] leading-relaxed text-neutral-800">{NAIVE_ANSWER}</p>
      <div className="mt-5 border-t border-neutral-100 pt-4 text-[11px] text-neutral-300">
        No source · no confidence signal · reads as fact
      </div>
    </div>
  );
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2.5 text-sm font-medium text-neutral-600"
    >
      <span className={!on ? "text-neutral-900" : "text-neutral-500"}>Raw AI</span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
          on ? "bg-accent" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
            on ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className={on ? "text-accent-fg" : "text-neutral-500"}>Trust UI</span>
    </button>
  );
}

export default function SideBySide() {
  const [trustOn, setTrustOn] = useState(true);

  return (
    <section id="demo" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
          05 · Side by side
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          The same wrong answer, two interfaces
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
          Both cards answer the same question about Dana&apos;s refund — a genuine
          gray area. One pretends to be sure. Watch how differently the honest
          answer <em>feels</em> when the interface stops pretending.
        </p>
      </div>

      {/* The shared question */}
      <div className="mx-auto mt-10 max-w-xl">
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm text-neutral-700 shadow-sm">
          <span className="font-medium text-neutral-500">Q&nbsp;·&nbsp;</span>
          {QUESTION}
        </div>
      </div>

      {/* Toggle */}
      <div className="mt-8 flex justify-center">
        <Toggle on={trustOn} onChange={setTrustOn} />
      </div>

      {/* The two columns */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-500">
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs">Today&apos;s AI</span>
            Confident. Fluent. Unsourced.
          </div>
          <PlainCard animate={false} />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-500">
            <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent-fg">
              With Trust UI
            </span>
            Honest about what it doesn&apos;t know.
          </div>
          {/* key forces a re-mount so the state transition re-animates */}
          {trustOn ? (
            <AnswerCard key="trust" answer={TRUST_ANSWER} animate />
          ) : (
            <PlainCard key="raw" animate />
          )}
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-[13px] leading-relaxed text-neutral-500">
        The underlying answer is the same in both cases — a real gray area. Only
        the <span className="text-neutral-500">interface</span> changed. And with
        it, whether the agent can tell a confident guess from a grounded fact
        before it reaches Dana.
      </p>
    </section>
  );
}
