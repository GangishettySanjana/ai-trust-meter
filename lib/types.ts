export type Confidence = "high" | "medium" | "low";

/** The structured response every answer card renders from. */
export interface TrustAnswer {
  answer: string;
  confidence: Confidence;
  /** Doc name + relevant quote, or null if nothing grounded the answer. */
  source: string | null;
  /** Brief explanation of why this confidence level was chosen. */
  reasoning: string;
  /** What would be needed to answer confidently, or null. */
  missing_info: string | null;
}

/** Shape returned by the /api/ask route. */
export interface AskResponse {
  ok: boolean;
  data?: TrustAnswer;
  /** Set when the API/model failed — the UI renders a designed fallback. */
  error?: string;
}
