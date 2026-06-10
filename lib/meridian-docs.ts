/**
 * The fictional knowledge base for "Meridian", a B2B customer-support platform
 * (think Intercom / Zendesk). These docs are the ONLY ground truth the AI
 * assistant is allowed to use when a support agent asks it a question.
 *
 * The set is deliberately incomplete in specific ways so the live demo can
 * reproduce all three confidence states:
 *   - The refund policy covers a clean 30-day window (grounded) but leaves the
 *     45-day annual case to a discretionary exception (inferred — a gray zone).
 *   - Enterprise contract terms and custom-discount authority appear in NO doc
 *     (uncertain — the assistant must redirect to a human, not guess).
 */

export interface MeridianDoc {
  id: string;
  title: string;
  /** Plain-text markdown body. */
  body: string;
}

export const MERIDIAN_DOCS: MeridianDoc[] = [
  {
    id: "refund-policy",
    title: "Refund Policy",
    body: `# Refund Policy

Customers on **monthly** plans may request a full refund within **30 days** of
their initial purchase by contacting support. Refunds are issued to the original
payment method within 5–7 business days.

**Annual** plans are not covered by the standard 30-day window. Annual customers
who are dissatisfied may be eligible for a discretionary, prorated refund on a
case-by-case basis. The support team can request this exception through a
manager, but approval is not guaranteed and depends on usage and account
standing.

Refunds do not apply to usage-based overage charges (e.g. API calls beyond the
plan limit). The terms above describe Meridian's standard published policy.`,
  },
  {
    id: "sla-tiers",
    title: "Support SLA Tiers",
    body: `# Support SLA Tiers

Priority support first-response targets by plan:

- **Starter** — community forum only; no guaranteed response time.
- **Growth** — email support; first response within **4 business hours** for
  priority issues. Support hours are Mon–Fri, 9am–6pm US Eastern.
- **Enterprise** — priority support; first response within **1 business hour**
  for P1 issues, with 24/7 weekend coverage.

A "priority issue" is anything blocking the customer's core workflow. Lower
severity questions follow the next-business-day target on Growth.`,
  },
  {
    id: "escalation-sop",
    title: "Escalation SOP",
    body: `# Escalation SOP

When a request falls outside published policy or needs an exception, agents
should escalate rather than improvise:

- Billing disputes, refund exceptions, and payment issues → route to the
  **Billing team** via the #billing-escalations queue.
- Account or contract changes → escalate to a **Customer Success Manager**.
- Anything requiring manager sign-off (e.g. goodwill credits) → tag your shift
  lead.

Never commit to a refund, credit, discount, or contract change that isn't
covered by published policy without approval. When in doubt, confirm with a
human before replying to the customer.`,
  },
  {
    id: "pricing-tiers",
    title: "Pricing Tiers",
    body: `# Pricing Tiers

Meridian is billed per seat per month:

- **Starter** — $12/seat/mo, up to 10 seats. Core features, community support.
- **Growth** — $29/seat/mo, up to 50 seats. Adds automations, advanced
  analytics, and priority email support.
- **Enterprise** — custom pricing, unlimited seats. Adds SSO/SAML, audit logs, a
  dedicated Customer Success Manager, and a 99.9% uptime SLA.

Annual billing saves 20% versus monthly. Overage API calls are billed at $1 per
1,000 calls above the plan limit.`,
  },
  {
    id: "security-faq",
    title: "Security FAQ",
    body: `# Security FAQ

**Where is data hosted?** Meridian runs on AWS in us-east-1 (N. Virginia) and
eu-west-1 (Ireland). Enterprise customers can choose their data residency region
during onboarding.

**Is data encrypted?** Yes — in transit (TLS 1.2+) and at rest (AES-256).

**Compliance?** Meridian is SOC 2 Type II certified and GDPR compliant. The SOC 2
report is available under NDA to Enterprise customers.

**SSO?** SAML-based SSO is available on the Enterprise plan.`,
  },
];

/** Compact, model-friendly rendering of the whole knowledge base. */
export function docsAsContext(): string {
  return MERIDIAN_DOCS.map((d) => `### DOC: ${d.title}\n${d.body}`).join("\n\n");
}

/**
 * Suggested questions a support agent might ask the assistant mid-conversation.
 * The `expected` hint is for the designer's own reference — it is NOT shown to
 * users and NOT sent to the model.
 */
export interface SuggestedQuestion {
  q: string;
  expected: "grounded" | "inferred" | "uncertain";
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { q: "What's our refund policy?", expected: "grounded" },
  { q: "Can Acme get a refund at 45 days?", expected: "inferred" },
  { q: "Do enterprise contracts have different refund terms?", expected: "uncertain" },
  { q: "What's our SLA for priority support?", expected: "grounded" },
  { q: "Can we offer Dana a custom discount instead?", expected: "uncertain" },
];
