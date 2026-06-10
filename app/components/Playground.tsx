"use client";

import { useState } from "react";
import type { AskResponse, TrustAnswer } from "@/lib/types";
import { MERIDIAN_DOCS, SUGGESTED_QUESTIONS } from "@/lib/meridian-docs";
import AnswerCard from "./AnswerCard";
import ConversationPanel, { CompactTicket } from "./ConversationPanel";
import { Spinner, ArrowRight, QuestionCircle, DocIcon } from "./icons";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "answer"; data: TrustAnswer }
  | { kind: "error"; message: string };

export default function Playground() {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // The agent's reply draft — populated when an answer is inserted from the AI panel.
  const [draft, setDraft] = useState<string | null>(null);

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
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
            Live demo · support workspace
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Meridian Assist, inside a live ticket
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            A support agent is mid-conversation with a customer. Ask the assistant
            a question — the answer returns with a visible confidence state, and{" "}
            <em>what the agent can do with it</em> changes based on how grounded it
            is.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start">
          {/* Mobile-only compact ticket; full conversation view on desktop */}
          <CompactTicket draft={draft} onClear={() => setDraft(null)} className="lg:hidden" />
          <ConversationPanel
            draft={draft}
            onClear={() => setDraft(null)}
            className="hidden lg:flex lg:sticky lg:top-8"
          />

          {/* The AI assistant panel — the interactive surface */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            {/* Assistant header */}
            <div className="flex items-center gap-2.5 border-b border-neutral-200/70 px-4 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <div>
                <div className="text-sm font-semibold text-neutral-900">Meridian Assist</div>
                <div className="text-[11px] text-neutral-500">
                  AI · grounded in your Help Center
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
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
                  placeholder="Ask Meridian Assist about this ticket…"
                  aria-label="Ask the Meridian Assist assistant a question"
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] text-neutral-800 outline-none placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || status.kind === "loading"}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 disabled:opacity-40"
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
                <div className="mb-2 text-xs font-medium text-neutral-500">
                  Try one of these
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((s) => (
                    <button
                      key={s.q}
                      type="button"
                      onClick={() => ask(s.q)}
                      disabled={status.kind === "loading"}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[13px] text-neutral-600 transition-colors hover:border-accent/40 hover:bg-accent-soft hover:text-accent-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 disabled:opacity-50"
                    >
                      {s.q}
                    </button>
                  ))}
                </div>
              </div>

              {/* The answer surface */}
              <div className="mt-5">
                {status.kind === "idle" && (
                  <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/40 p-8 text-center">
                    <QuestionCircle className="h-7 w-7 text-neutral-300" />
                    <p className="mt-3 max-w-[40ch] text-sm text-neutral-500">
                      Ask the assistant a question to see how the answer — and what
                      you can do with it — changes with confidence.
                    </p>
                  </div>
                )}

                {status.kind === "loading" && (
                  <div className="min-h-[240px] animate-pulse rounded-2xl border border-neutral-200 bg-white p-6">
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
                  <AnswerCard
                    key={status.data.answer}
                    answer={status.data}
                    animate
                    onInsert={(text) => setDraft(text)}
                  />
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

              {/* Knowledge base the assistant can see */}
              <details className="group mt-5 rounded-xl border border-neutral-200 bg-neutral-50/60">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600">
                  <DocIcon className="h-4 w-4 text-neutral-500" />
                  The {MERIDIAN_DOCS.length} docs the assistant can see
                  <span className="ml-auto text-xs text-neutral-500 transition-transform group-open:rotate-180">
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
          </div>
        </div>
      </div>
    </section>
  );
}
