const REQUIREMENTS = [
  {
    number: "01",
    state: "Grounded",
    colorAccent: "border-grounded/30 bg-grounded-soft/40",
    chipBg: "bg-grounded-soft ring-grounded/30",
    chipText: "text-grounded-fg",
    dot: "bg-grounded",
    story:
      "When the answer comes from policy, show me the source instantly so I can reply without fear.",
  },
  {
    number: "02",
    state: "Inferred",
    colorAccent: "border-inferred/30 bg-[#fffdf8]",
    chipBg: "bg-inferred-soft ring-inferred/30",
    chipText: "text-inferred-fg",
    dot: "bg-inferred",
    story:
      "When the AI is guessing, tell me BEFORE I send it. A guess should never wear the costume of a fact.",
  },
  {
    number: "03",
    state: "Uncertain",
    colorAccent: "border-uncertain/30 bg-uncertain-soft/30",
    chipBg: "bg-uncertain-soft ring-uncertain/30",
    chipText: "text-uncertain-fg",
    dot: "bg-uncertain",
    story:
      "When it doesn't know, say so and point me to a human. I shouldn't apologize for its inventions.",
  },
] as const;

export default function DesignRequirements() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
          03 · Design requirements
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Three states. Three different jobs to do.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
          Each confidence state carries a different user need — and a different
          design obligation. These three stories are what the system is built to
          address.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {REQUIREMENTS.map((r) => (
          <div
            key={r.state}
            className={`rounded-2xl border p-5 ${r.colorAccent}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${r.chipBg} ${r.chipText}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                {r.state}
              </span>
              <span className="text-[11px] font-medium text-neutral-500">
                {r.number}
              </span>
            </div>
            <p className="text-[15px] leading-relaxed text-neutral-700">
              &ldquo;{r.story}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Bridge line into the design system section */}
      <div className="mt-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="text-[13px] font-medium text-neutral-500">
          Requirements in → system out
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>
    </section>
  );
}
