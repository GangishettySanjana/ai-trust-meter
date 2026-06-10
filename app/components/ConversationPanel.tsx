"use client";

import { Send } from "./icons";

// --- Static set dressing: the customer ticket the agent is working ----------
// Lightweight and hardcoded on purpose. All interactivity lives in the AI panel.

const TICKET = {
  customer: "Dana Whitfield",
  initials: "DW",
  company: "Acme Logistics",
  plan: "Growth · Annual",
  id: "#4821",
  status: "Open",
  signedUp: "45 days ago",
};

const THREAD: { from: "customer"; text: string; time: string }[] = [
  {
    from: "customer",
    text:
      "Hi, we signed up 45 days ago and this isn't working for our team. Can we still get a refund?",
    time: "10:42 AM",
  },
  {
    from: "customer",
    text: "We're a team of 12 and it's just not the right fit for us.",
    time: "10:42 AM",
  },
];

function DraftComposer({
  draft,
  onClear,
}: {
  draft: string | null;
  onClear: () => void;
}) {
  return (
    <div className="border-t border-neutral-200/70 p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          Reply to Dana
        </span>
        {draft && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Drafted by Meridian Assist
          </span>
        )}
      </div>

      <div
        className={`rounded-lg border px-3 py-2.5 text-[13px] leading-relaxed transition-colors ${
          draft
            ? "animate-fade-in border-accent/30 bg-accent-soft/40 text-neutral-700"
            : "border-neutral-200 bg-neutral-50/60 text-neutral-500"
        }`}
      >
        {draft || "Type your reply…"}
      </div>

      <div className="mt-2 flex items-center justify-between">
        {draft ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-600"
          >
            Clear draft
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled
          title="Demo only"
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-neutral-200 px-3 py-1.5 text-[13px] font-semibold text-neutral-500"
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </button>
      </div>
    </div>
  );
}

function TicketHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-200/70 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-white">
        {TICKET.initials}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-neutral-900">
            {TICKET.customer}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-grounded-soft px-1.5 py-0.5 text-[10px] font-semibold text-grounded-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-grounded" />
            {TICKET.status}
          </span>
        </div>
        <div className="truncate text-[12px] text-neutral-500">
          {TICKET.company} · {TICKET.plan}
        </div>
      </div>
      <div className="ml-auto shrink-0 text-[12px] text-neutral-500">{TICKET.id}</div>
    </div>
  );
}

/** Desktop: the full help-desk conversation view. */
export default function ConversationPanel({
  draft,
  onClear,
  className = "",
}: {
  draft: string | null;
  onClear: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${className}`}
    >
      <TicketHeader />

      <div className="flex-1 space-y-3 p-4">
        <div className="text-center text-[11px] font-medium uppercase tracking-wide text-neutral-300">
          Today
        </div>
        {THREAD.map((m, i) => (
          <div key={i} className="flex max-w-[88%] flex-col gap-1">
            <div className="rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-neutral-700">
              {m.text}
            </div>
            <span className="pl-1 text-[11px] text-neutral-500">{m.time}</span>
          </div>
        ))}
      </div>

      <DraftComposer draft={draft} onClear={onClear} />
    </div>
  );
}

/** Mobile: a compact ticket summary that sits above the AI panel. */
export function CompactTicket({
  draft,
  onClear,
  className = "",
}: {
  draft: string | null;
  onClear: () => void;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2.5 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-semibold text-white">
          {TICKET.initials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-neutral-900">
            {TICKET.customer}{" "}
            <span className="font-normal text-neutral-500">{TICKET.id}</span>
          </div>
          <div className="truncate text-[11px] text-neutral-500">
            {TICKET.company} · {TICKET.plan}
          </div>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-grounded-soft px-1.5 py-0.5 text-[10px] font-semibold text-grounded-fg">
          {TICKET.status}
        </span>
      </div>
      <div className="border-t border-neutral-100 bg-neutral-50/50 px-3 py-2 text-[12px] leading-relaxed text-neutral-600">
        “{THREAD[0].text}”
      </div>
      {draft && (
        <div className="animate-fade-in border-t border-accent/20 bg-accent-soft/40 px-3 py-2">
          <div className="mb-0.5 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-fg">
              Draft reply ready
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-[11px] font-medium text-neutral-500 hover:text-neutral-600"
            >
              Clear
            </button>
          </div>
          <p className="text-[12px] leading-relaxed text-neutral-700">{draft}</p>
        </div>
      )}
    </div>
  );
}
