"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// TeardownImage — swappable screenshot slot. Falls back to a styled placeholder
// when src is missing or fails to load. Drop a file into /public/teardown/ and
// pass its path as src to promote the placeholder to a real screenshot.
//
// SSR-safe: a missing file 404s before React hydrates, so the <img> onError
// never reattaches. We also check the image's loaded state on mount to catch
// that pre-hydration error and fall back to the placeholder.
// ---------------------------------------------------------------------------
export function TeardownImage({
  src,
  alt,
  caption,
}: {
  src?: string;
  alt: string;
  caption: string;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setErrored(false);
    const img = imgRef.current;
    // If the load already failed before hydration, naturalWidth stays 0.
    if (img && img.complete && img.naturalWidth === 0) setErrored(true);
  }, [src]);

  if (src && !errored) {
    return (
      <figure className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
          className="w-full object-cover"
        />
        <figcaption className="border-t border-neutral-100 px-3 py-2 text-[11px] text-neutral-500">
          {caption}
        </figcaption>
      </figure>
    );
  }

  // Placeholder — lightweight, no network request
  return (
    <div
      className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center"
      aria-label={caption}
    >
      {/* Image icon — inline SVG, zero weight */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-neutral-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="text-[12px] font-medium text-neutral-400">{caption}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teardown card
// ---------------------------------------------------------------------------
interface TeardownCardProps {
  product: string;
  tagline: string;
  imageSrc?: string;
  imageAlt: string;
  imageCaption: string;
  annotations: Array<{ label: "What it does" | "What's missing"; text: string }>;
}

function TeardownCard({
  product,
  tagline,
  imageSrc,
  imageAlt,
  imageCaption,
  annotations,
}: TeardownCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
      <div>
        <div className="text-[13px] font-semibold text-neutral-900">{product}</div>
        <div className="mt-0.5 text-[13px] text-neutral-500">{tagline}</div>
      </div>

      <TeardownImage src={imageSrc} alt={imageAlt} caption={imageCaption} />

      <div className="space-y-2.5">
        {annotations.map((a, i) => (
          <div key={i} className="text-[13px] leading-relaxed">
            <span
              className={`font-semibold ${
                a.label === "What it does" ? "text-grounded-fg" : "text-inferred-fg"
              }`}
            >
              {a.label}:
            </span>{" "}
            <span className="text-neutral-600">{a.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export default function TeardownSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      {/* Section header */}
      <div className="mx-auto max-w-2xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-fg">
          01 · The teardown
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          How AI products handle uncertainty today
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-500">
          I audited how three leading AI-powered support and knowledge products
          present answers when they&rsquo;re not confident. The pattern is
          consistent: fluency regardless of grounding, with a small disclaimer
          at the edge. The interface treats every answer as equally trustworthy
          because it has no other mechanism.
        </p>
      </div>

      {/* 3-card grid */}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <TeardownCard
          product="Intercom Fin"
          tagline="AI agent that resolves customer questions from the help center"
          imageSrc="/teardown/intercom-fin.png"
          imageAlt="Intercom Fin answer state screenshot"
          imageCaption="Screenshot: Intercom Fin answer state"
          annotations={[
            {
              label: "What it does",
              text: "[Placeholder — describe how Fin presents answers: tone, formatting, citation behavior]",
            },
            {
              label: "What's missing",
              text: "[Placeholder — note what confidence signal, if any, is absent or buried]",
            },
          ]}
        />
        <TeardownCard
          product="Zendesk AI"
          tagline="Generative replies and agent assist inside Zendesk"
          imageSrc="/teardown/zendesk-ai.png"
          imageAlt="Zendesk AI answer state screenshot"
          imageCaption="Screenshot: Zendesk AI answer state"
          annotations={[
            {
              label: "What it does",
              text: "[Placeholder — describe how Zendesk surfaces suggested answers to agents]",
            },
            {
              label: "What's missing",
              text: "[Placeholder — note what differentiation exists between high- and low-confidence answers]",
            },
          ]}
        />
        <TeardownCard
          product="Notion AI Q&A"
          tagline="Answers questions from across your Notion workspace"
          imageSrc="/teardown/notion-ai.png"
          imageAlt="Notion AI Q&A answer state screenshot"
          imageCaption="Screenshot: Notion AI Q&A answer state"
          annotations={[
            {
              label: "What it does",
              text: "[Placeholder — describe how Notion presents answers and source references]",
            },
            {
              label: "What's missing",
              text: "[Placeholder — note what happens when Notion answers beyond what the docs contain]",
            },
          ]}
        />
      </div>

      {/* Closing line */}
      <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-neutral-600">
        The only honesty mechanism shipping today is a disclaimer. Disclaimers
        are legal cover, not design.
      </p>
    </section>
  );
}
