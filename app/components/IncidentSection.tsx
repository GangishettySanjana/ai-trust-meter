export default function IncidentSection() {
  return (
    <section className="border-t border-neutral-200/70 bg-neutral-50/60">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
            02 · The incident
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            The cost isn&rsquo;t the error
          </h2>

          {/* Editorial narrative — lead paragraph, no decorative rule */}
          <p className="mt-8 text-[17px] leading-[1.8] text-neutral-700 sm:text-lg">
            Maya is a support agent. She handles 40+ tickets a day, measured on
            speed and accuracy. The AI assistant was added to make her faster —
            until it confidently told a customer they qualified for a refund they
            didn&rsquo;t. Maya took the angry follow-up. Now she double-checks
            everything, and the AI saves her nothing.
          </p>

          {/* Pull quote */}
          <blockquote className="mt-10 max-w-xl text-balance text-xl font-semibold leading-snug tracking-tight text-neutral-900 sm:text-2xl">
            &ldquo;The cost of a wrong AI answer isn&rsquo;t the error. It&rsquo;s
            that every answer after it gets treated as a guess.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
