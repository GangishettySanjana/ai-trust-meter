"use client";

import { useState } from "react";
import type { AskResponse, TrustAnswer } from "@/lib/types";
import { MERIDIAN_DOCS, SUGGESTED_QUESTIONS } from "@/lib/meridian-docs";
import AnswerCard from "./AnswerCard";
import { Spinner, ArrowRight, QuestionCircle, DocIcon } from "./icons";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "answer"; data: TrustAnswer }
  | { kind: "error"; message: string };

export default function Playground() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function ask(q: string) {
    const query = q.trim();
    if (!query || status.kind === "loading") return;
    setQuestion(query);
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });
      const json: AskResponse = await res.json();
      if (json.ok && json.data) {
        setStatus({ kind: "answer", data: json.data });
      } else {
        setStatus({
          kind: "error",
          message: json.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        message:
          "Couldn't reach the answer service. Check your connection and try again.",
      });
    }
  }

  return (
    <section id="playground" className="border-t border-neutral-200/70 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
            Live playground
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Ask Meridian&apos;s internal docs
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            A real model answers over a small fixed knowledge base for a fictional
            company. Some questions are answerable — some aren&apos;t. The card
            tells you which is which.
          </p>
        </div>

        <div className="mx-auto mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(0,460px)]">
          {/* Left: input + suggestions + docs */}
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(question);
              }}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/15"
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about refunds, pricing, security…"
                aria-label="Ask a question about Meridian's docs"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                disabled={!question.trim() || status.kind === "loading"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              >
                {status.kind === "loading" ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Ask
              </button>
            </form>

            <div className="mt-4">
              <div className="mb-2 text-xs font-medium text-neutral-400">
                Try one of these
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((s) => (
                  <button
                    key={s.q}
                    type="button"
                    onClick={() => ask(s.q)}
                    disabled={status.kind === "loading"}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[13px] text-neutral-600 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg disabled:opacity-50"
                  >
                    {s.q}
                  </button>
                ))}
              </div>
            </div>

            <details className="group mt-6 rounded-xl border border-neutral-200 bg-neutral-50/60">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600">
                <DocIcon className="h-4 w-4 text-neutral-400" />
                The {MERIDIAN_DOCS.length} docs the model can see
                <span className="ml-auto text-xs text-neutral-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <div className="grid grid-cols-2 gap-1.5 px-4 pb-4 sm:grid-cols-3">
                {MERIDIAN_DOCS.map((d) => (
                  <span
                    key={d.id}
                    className="rounded-md bg-white px-2 py-1.5 text-center text-[12px] text-neutral-500 ring-1 ring-neutral-200"
                  >
                    {d.title}
                  </span>
                ))}
              </div>
            </details>
          </div>

          {/* Right: the answer surface */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {status.kind === "idle" && (
              <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/40 p-8 text-center">
                <QuestionCircle className="h-7 w-7 text-neutral-300" />
                <p className="mt-3 max-w-[34ch] text-sm text-neutral-400">
                  Ask a question to see it answered with a visible confidence
                  state, source, and reasoning.
                </p>
              </div>
            )}

            {status.kind === "loading" && (
              <div className="min-h-[260px] animate-pulse rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-28 rounded bg-neutral-100" />
                  <div className="h-6 w-20 rounded-full bg-neutral-100" />
                </div>
                <div className="space-y-2.5">
                  <div className="h-3.5 w-full rounded bg-neutral-100" />
                  <div className="h-3.5 w-11/12 rounded bg-neutral-100" />
                  <div className="h-3.5 w-4/5 rounded bg-neutral-100" />
                </div>
                <div className="mt-6 h-1.5 w-full rounded-full bg-neutral-100" />
              </div>
            )}

            {status.kind === "answer" && (
              <AnswerCard key={status.data.answer} answer={status.data} animate />
            )}

            {/* Designed, on-brand fallback — an honest uncertain state, not a red error */}
            {status.kind === "error" && (
              <div className="animate-fade-in-up rounded-2xl border border-dashed border-uncertain/40 bg-uncertain-soft/40 bg-hatch p-6">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-uncertain-soft px-2.5 py-1 text-xs font-semibold text-uncertain-fg ring-1 ring-inset ring-uncertain/25">
                  <QuestionCircle className="h-3.5 w-3.5" />
                  Couldn&apos;t answer
                </div>
                <p className="text-[15px] leading-relaxed text-uncertain-fg">
                  {status.message}
                </p>
                <button
                  type="button"
                  onClick={() => ask(question)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-fg hover:underline"
                >
                  Try again
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
