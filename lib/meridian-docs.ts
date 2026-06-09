/**
 * A small fictional knowledge base for "Meridian", a made-up B2B SaaS company.
 * These docs are the only ground truth the playground model is allowed to use.
 * They're deliberately incomplete — some example questions have no answer here,
 * which is the whole point of the demo.
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

Meridian offers a 14-day money-back guarantee on all annual plans. To request a
refund, customers must email billing@meridian.example within 14 days of the
initial charge. Refunds are processed to the original payment method within 5–7
business days.

Monthly plans are non-refundable, but customers can cancel at any time to stop
future charges. Cancellation takes effect at the end of the current billing
cycle. We do not offer prorated refunds for partial months.

Refunds are not available for usage-based overage charges (e.g. additional API
calls beyond the plan limit).`,
  },
  {
    id: "onboarding-sop",
    title: "Customer Onboarding SOP",
    body: `# Customer Onboarding SOP

New Enterprise customers are assigned a dedicated Onboarding Specialist within
one business day of signing. The standard onboarding timeline is 30 days and
covers four milestones:

1. Kickoff call (day 1–3): goals, success metrics, and access provisioning.
2. Workspace setup (day 4–10): SSO configuration, team imports, and roles.
3. Integration & data migration (day 11–20): connect existing tools and import
   historical data.
4. Training & go-live (day 21–30): admin training, end-user webinar, handoff to
   the Customer Success Manager.

Self-serve (Starter and Growth) customers receive an automated onboarding email
sequence and access to the Help Center, but no dedicated specialist.`,
  },
  {
    id: "pricing-tiers",
    title: "Pricing Tiers",
    body: `# Pricing Tiers

Meridian has three plans, billed per seat per month:

- Starter — $12/seat/mo. Up to 10 seats. Core features, community support,
  10,000 API calls/month included.
- Growth — $29/seat/mo. Up to 50 seats. Adds automations, advanced analytics,
  priority email support, and 100,000 API calls/month.
- Enterprise — custom pricing. Unlimited seats. Adds SSO/SAML, audit logs,
  dedicated onboarding, a Customer Success Manager, and a 99.9% uptime SLA.

Annual billing saves 20% versus monthly. Overage API calls are billed at $1 per
1,000 calls above the plan limit.`,
  },
  {
    id: "security-faq",
    title: "Security FAQ",
    body: `# Security FAQ

**Where is data hosted?** Meridian runs on AWS in the us-east-1 (N. Virginia)
and eu-west-1 (Ireland) regions. Enterprise customers can choose their data
residency region during onboarding.

**Is data encrypted?** Yes. All data is encrypted in transit (TLS 1.2+) and at
rest (AES-256).

**What compliance certifications do you hold?** Meridian is SOC 2 Type II
certified and GDPR compliant. A copy of our SOC 2 report is available under NDA
to Enterprise customers.

**Do you support SSO?** SAML-based SSO is available on the Enterprise plan.

**How are passwords stored?** Passwords are hashed with bcrypt. Meridian staff
never have access to plaintext customer passwords.`,
  },
  {
    id: "pto-policy",
    title: "PTO Policy (Internal)",
    body: `# PTO Policy (Internal — Employees)

Meridian employees accrue paid time off based on tenure:

- 0–2 years: 18 days/year
- 3–5 years: 23 days/year
- 6+ years: 28 days/year

PTO accrues monthly and up to 5 unused days may be carried into the next
calendar year. Carryover days must be used by March 31 or they are forfeited.

Sick leave is separate and uncapped, but absences of 3+ consecutive days require
a doctor's note. PTO requests should be submitted in Workday at least two weeks
in advance for stretches longer than three days.`,
  },
  {
    id: "support-sla",
    title: "Support SLA",
    body: `# Support & Response Times

Support response targets by plan:

- Starter — community forum only; no guaranteed response time.
- Growth — email support, first response within 1 business day.
- Enterprise — priority support, first response within 4 business hours for
  urgent (P1) issues, 1 business day for normal issues.

Support hours are Monday–Friday, 9am–6pm US Eastern, excluding US public
holidays. There is no weekend or 24/7 phone support on any plan.`,
  },
  {
    id: "data-export",
    title: "Data Export & Portability",
    body: `# Data Export & Portability

Customers can export their workspace data at any time from Settings → Data
Export. Exports are generated as a downloadable ZIP containing CSV files for
records and a JSON file for configuration.

Large exports (over 1 GB) are processed asynchronously and a download link is
emailed when ready, valid for 48 hours. On account cancellation, customer data
is retained for 30 days to allow export, then permanently deleted.`,
  },
  {
    id: "integrations",
    title: "Integrations Directory",
    body: `# Integrations

Meridian connects to common tools via native integrations:

- Slack — notifications and slash commands.
- Google Workspace & Microsoft 365 — calendar and SSO.
- Salesforce & HubSpot — two-way contact and deal sync (Growth and above).
- Zapier — connect to 5,000+ apps.
- Webhooks & REST API — available on all plans for custom integrations.

Integrations are configured under Settings → Integrations by a workspace admin.
The Salesforce and HubSpot syncs are not available on the Starter plan.`,
  },
];

/** Compact, model-friendly rendering of the whole knowledge base. */
export function docsAsContext(): string {
  return MERIDIAN_DOCS.map(
    (d) => `### DOC: ${d.title}\n${d.body}`
  ).join("\n\n");
}

/** Suggested questions for the playground. Mix of answerable + unanswerable. */
export interface SuggestedQuestion {
  q: string;
  /** Hint for the designer's own reference — not shown to users. */
  expected: "answerable" | "partial" | "unanswerable";
}

export const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { q: "Can I get a refund on a monthly plan?", expected: "answerable" },
  { q: "How long does Enterprise onboarding take?", expected: "answerable" },
  { q: "What's the difference between the Growth and Enterprise plans?", expected: "answerable" },
  { q: "Do you offer 24/7 phone support?", expected: "answerable" },
  { q: "What's Meridian's parental leave policy?", expected: "unanswerable" },
  { q: "Can I deploy Meridian on-premise in my own data center?", expected: "unanswerable" },
];
