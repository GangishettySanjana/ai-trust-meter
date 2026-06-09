# The AI Trust Meter

A confidence-state design system for AI responses in B2B SaaS tools.

> What if AI interfaces were honest about uncertainty?

AI features present wrong answers with the same confidence as right ones. This
demo shows a design system where the UI treatment visibly changes based on how
grounded the answer actually is — with source attribution, a 3-state trust
meter, and inspectable reasoning.

Live concept demo · linked from [gangishettysanjana.com](https://gangishettysanjana.com)

## Sections

1. **Hero** — the premise.
2. **Side-by-side** — the same ungrounded answer shown raw vs. wrapped in the
   confidence-state system. Hardcoded, loads instantly.
3. **Live playground** — ask a real model questions about a fictional company
   ("Meridian"). Some questions are answerable from the docs, some aren't — the
   card honestly distinguishes them.

## The confidence states

| State | When | Treatment |
|-------|------|-----------|
| **Grounded** (high) | Directly stated in the docs | Solid card, green chip, inline clickable source excerpt |
| **Inferred** (medium) | Partial / reasonable inference | Muted card, amber chip, highlighted hedge phrases, "show me why" |
| **Uncertain** (low) | Not in the docs | Dashed/hatched card — honest, not an error — "what I'd need to know" |

The trust meter is a 3-segment indicator (Grounded / Inferred / Uncertain), not
a fake percentage. Every state pairs color with an icon + label.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS
- Serverless route (`app/api/ask/route.ts`) calling OpenRouter, with defensive
  JSON parsing and a designed fallback state on failure.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # then add your OpenRouter key
npm run dev
```

The hero and side-by-side work with no key. The playground needs
`OPENROUTER_API_KEY` — without it, the playground shows its on-brand "honest
fallback" state.

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `OPENROUTER_API_KEY` | for the playground | Server-only. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). |
| `OPENROUTER_MODEL` | optional | Defaults to `meta-llama/llama-3.3-70b-instruct:free`. |

## Deploy to Vercel

1. Push to a Git repo and import into Vercel.
2. Add `OPENROUTER_API_KEY` (and optionally `OPENROUTER_MODEL`) in
   **Project → Settings → Environment Variables**.
3. Deploy. No other configuration needed.
