export default function ReflectionSection() {
  return (
    <section className="border-t border-neutral-200/70">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
            07 · Reflection
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            What I&rsquo;d do next
          </h2>

          <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-600">
            <p>
              The most important open question is behavioral, not visual: does
              the inferred-state friction actually reduce error rates, or does it
              just add a step agents learn to skip? I&rsquo;d test this with a
              simple A/B — friction vs. no friction on inferred answers — and
              measure whether the review step changes insert behavior or just
              slows the workflow without improving accuracy. Speed and accuracy
              are in tension here, and the right answer depends on which the
              agent population is actually willing to trade.
            </p>

            <p>
              The known limitation is scope. Confidence here is doc-grounding
              based: the system knows what&rsquo;s in the knowledge base and
              flags when it&rsquo;s reasoning beyond it. That works well for
              structured support — policies, FAQs, product docs. It breaks down
              for open-ended tasks where &ldquo;grounded&rdquo; doesn&rsquo;t
              have a clean definition. This isn&rsquo;t the right system for a
              general-purpose assistant; it&rsquo;s the right system for
              domain-bounded, human-relayed answers.
            </p>

            <p>
              Which points to where it generalizes. Any AI surface where a human
              relays the answer to someone else — support agents, legal
              assistants, healthcare coordinators, financial advisors using AI
              research tools — shares the same trust problem. The agent is
              accountable for the answer; the AI should make their accountability
              easier to exercise, not harder. The confidence-state pattern scales
              to any of those contexts.
            </p>
          </div>

          <div className="mt-12 border-t border-neutral-200 pt-8">
            <p className="text-[14px] text-neutral-500">
              Designed and built by{" "}
              <a
                href="https://gangishettysanjana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-accent-fg hover:decoration-accent"
              >
                Sanjana Gangishetty
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
