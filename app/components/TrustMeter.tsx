import type { Confidence } from "@/lib/types";
import { CONFIDENCE, SEGMENTS } from "@/lib/confidence";

const SEG_ACTIVE: Record<string, string> = {
  grounded: "bg-grounded",
  inferred: "bg-inferred",
  uncertain: "bg-uncertain",
};

const SEG_LABEL_ACTIVE: Record<string, string> = {
  grounded: "text-grounded-fg",
  inferred: "text-inferred-fg",
  uncertain: "text-uncertain-fg",
};

/**
 * A 3-segment trust indicator — deliberately NOT a fake percentage.
 * It names what kind of answer this is: Grounded, Inferred, or Uncertain.
 */
export default function TrustMeter({
  confidence,
  className = "",
}: {
  confidence: Confidence;
  className?: string;
}) {
  const active = CONFIDENCE[confidence].segment;

  return (
    <div className={className} role="group" aria-label={`Trust level: ${CONFIDENCE[confidence].label}`}>
      <div className="flex items-center gap-1.5">
        {SEGMENTS.map((seg) => {
          const isActive = seg.key === active;
          return (
            <div
              key={seg.key}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                isActive ? SEG_ACTIVE[seg.key] : "bg-neutral-200"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between">
        {SEGMENTS.map((seg) => {
          const isActive = seg.key === active;
          return (
            <span
              key={seg.key}
              className={`text-[11px] font-medium tracking-wide transition-colors duration-500 ${
                isActive ? SEG_LABEL_ACTIVE[seg.key] : "text-neutral-400"
              }`}
            >
              {seg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
