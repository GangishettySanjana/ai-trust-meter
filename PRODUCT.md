# PRODUCT.md — The AI Trust Meter

## Register
**Product** (design serves the product). The page is a portfolio case study, but the surface under active design is app UI: an AI assistant panel embedded in a B2B customer-support tool. Judge it as product UI, not a marketing page.

## Product purpose
A live, interactive case study demonstrating a **confidence-state design system** for AI answers in B2B SaaS. The thesis: AI features present wrong answers with the same confidence as right ones. This system makes the UI visibly change based on how grounded an answer is — and changes *what an agent can do with it* (insert vs. confirm vs. escalate-to-human).

It's shown inside **Meridian**, a fictional B2B customer-support platform (Intercom/Zendesk-like). The hero surface is a two-panel support workspace: a customer ticket conversation on the left, the "Meridian Assist" AI panel on the right.

## Target users
1. **Primary (the demo's audience):** design and product leaders, hiring managers, and peers evaluating Sanjana Gangishetty's portfolio. They skim fast, judge craft, and care about the *idea* landing.
2. **Simulated (the in-fiction user):** a support agent mid-conversation with a customer, deciding whether an AI answer is safe to send. High-stakes, time-pressured.

## Jobs to be done
- Make a skeptical designer immediately *feel* the difference between a confident guess and a grounded fact.
- Show that "honest about uncertainty" is a designable, three-state system — not a disclaimer.
- Prove the consequence: the UI routes uncertainty to a human instead of letting a guess reach a customer.

## Brand & personality
Three words: **honest, grown-up, precise.** Linear/Notion/Intercom-grade product polish. Generous whitespace, one indigo accent (#5b5bd6), neutral grays, restrained motion. Confidence-state semantics: grounded = green, inferred = amber, uncertain = slate (never alarm-red — uncertainty is honest, not an error).

## Anti-references (what it must NOT look like)
- No AI-glow gradients, sparkle emojis, or "magic" framing. The whole point is grown-up, non-hype AI UX.
- No gradient text, no decorative glassmorphism, no side-stripe accent borders.
- Uncertainty must never read as a red error state.
- Color is never the only signal — every confidence state pairs color with an icon + text label.

## Accessibility
WCAG 2.1 AA target. Confidence encoded redundantly (icon + label + texture, not color alone). Keyboard-operable throughout, including the inferred "review before sending" confirmation step (focus moves into it on open, Escape cancels and restores focus). `prefers-reduced-motion` respected globally.

## Strategic design principles
1. The confidence-state system (tokens, the three card states, the trust meter, the action variants) is the product. The context around it can change; the system stays stable.
2. Consequence over decoration: the most important element is what the agent is *allowed to do* with an answer, and that is a property of the trust state.
3. Section 2 is hardcoded and instant; only the playground hits the API. Failure degrades to an honest uncertain state, never a crash.
