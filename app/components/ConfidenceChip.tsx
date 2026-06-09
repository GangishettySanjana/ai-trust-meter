import type { Confidence } from "@/lib/types";
import { CONFIDENCE } from "@/lib/confidence";
import { CheckCircle, HalfCircle, QuestionCircle } from "./icons";

const TONE: Record<
  Confidence,
  { wrap: string; icon: React.ComponentType<{ className?: string }> }
> = {
  high: {
    wrap: "bg-grounded-soft text-grounded-fg ring-grounded/20",
    icon: CheckCircle,
  },
  medium: {
    wrap: "bg-inferred-soft text-inferred-fg ring-inferred/20",
    icon: HalfCircle,
  },
  low: {
    wrap: "bg-uncertain-soft text-uncertain-fg ring-uncertain/25",
    icon: QuestionCircle,
  },
};

/** The animated confidence pill. Icon + label, never color alone. */
export default function ConfidenceChip({
  confidence,
  animate = false,
}: {
  confidence: Confidence;
  animate?: boolean;
}) {
  const { wrap, icon: Icon } = TONE[confidence];
  const { label } = CONFIDENCE[confidence];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${wrap} ${
        animate ? "animate-chip-in" : ""
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
