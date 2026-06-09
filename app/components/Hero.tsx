import { ArrowRight } from "./icons";

export default function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="bg-dotgrid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000,transparent)]" />
      <div className="relative mx-auto max-w-3xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          A confidence-state design system for AI
        </div>

        <h1 className="animate-fade-in-up text-4xl font-semibold tracking-tight text-neutral-900 sm:text-6xl">
          The AI Trust Meter
        </h1>

        <p
          className="animate-fade-in-up mx-auto mt-5 max-w-xl text-lg text-neutral-600 sm:text-xl"
          style={{ animationDelay: "0.06s" }}
        >
          What if AI interfaces were honest about uncertainty?
        </p>

        <p
          className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-neutral-500"
          style={{ animationDelay: "0.12s" }}
        >
          AI features in B2B tools present wrong answers with the same confidence
          as right ones — same tone, same polish, no signal. This is a design
          system where the interface visibly changes based on how grounded the
          answer actually is, with source attribution and reasoning you can
          inspect.
        </p>

        <div
          className="animate-fade-in-up mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.18s" }}
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-100"
          >
            See the difference
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#playground"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Try the live playground
          </a>
        </div>
      </div>
    </header>
  );
}
