"use client";

import { useState } from "react";
import type { TrustAnswer } from "@/lib/types";
import AnswerCard from "./AnswerCard";

// The shared (wrong) question both AIs answer. The honest answer is "this isn't
// in the docs" — but today's AI fabricates a confident, specific reply.
const QUESTION =
  "What's the penalty if Meridian's uptime drops below the 99.9% SLA?";

// "Today's AI" — fluent, specific, authoritative, and entirely made up.
const NAIVE_ANSWER =
  "If uptime falls below the 99.9% SLA, Meridian automatically credits 10% of your monthly fee for every 0.1% below target, up to a maximum of 50%. Credits are applied to your next invoice within one billing cycle.";

// The exact same situation, wrapped in the confidence-state system. The docs
// mention a 99.9% uptime SLA but say nothing about penalties — so: low.
const TRUST_ANSWER: TrustAnswer = {
  answer:
    "I don't have a grounded answer for this. The Meridian docs mention a 99.9% uptime SLA on the Enterprise plan, but nothing about service credits or penalties for missing it.",
  confidence: "low",
  source: null,
  reasoning:
    "The SLA target appears in the Pricing doc, but no document defines remedies, credits, or penalties — so any specific figure would be fabricated.",
  missing_info:
    "An SLA remedies / service-credit clause (often in the MSA or order form), which isn't part of this knowledge base.",
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
      <span className={!on ? "text-neutral-900" : "text-neutral-400"}>Raw AI</span>
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
      <span className={on ? "text-accent-fg" : "text-neutral-400"}>Trust UI</span>
    </button>
  );
}

export default function SideBySide() {
  const [trustOn, setTrustOn] = useState(true);

  return (
    <section id="demo" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
          The same wrong answer, two ways
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Confidence is a design decision
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
          Both cards answer the same question — one the docs can&apos;t actually
          support. Watch how differently the honest answer <em>feels</em> when the
          interface stops pretending.
        </p>
      </div>

      {/* The shared question */}
      <div className="mx-auto mt-10 max-w-xl">
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-sm text-neutral-700 shadow-sm">
          <span className="font-medium text-neutral-400">Q&nbsp;·&nbsp;</span>
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

      <p className="mx-auto mt-8 max-w-xl text-center text-[13px] leading-relaxed text-neutral-400">
        The underlying model gave the same ungrounded answer in both cases. Only
        the <span className="text-neutral-500">interface</span> changed — and
        with it, whether a user can tell the difference between knowledge and a
        guess.
      </p>
    </section>
  );
}
