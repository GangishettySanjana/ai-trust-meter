import { NextResponse } from "next/server";
import { docsAsContext } from "@/lib/meridian-docs";
import type { AskResponse, TrustAnswer, Confidence } from "@/lib/types";

// Always run on the server; never cache answers.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `You are "Meridian Assist", the AI assistant inside Meridian, a fictional B2B customer-support platform. A human support agent is mid-conversation with a customer and is asking you for help. Answer using ONLY the provided Help Center documentation — your answer may be inserted directly into a reply to the customer, so being honest about uncertainty matters more than sounding confident.

You must respond with a SINGLE valid JSON object and NOTHING else — no markdown, no code fences, no preamble. The JSON must match exactly this shape:

{
  "answer": string,            // the response text, written plainly and professionally
  "confidence": "high" | "medium" | "low",
  "source": string | null,     // the doc title + a short exact quote that grounds the answer, or null
  "reasoning": string,         // one or two sentences on WHY you chose this confidence level
  "missing_info": string | null // what you'd need to answer confidently, or null
}

Rules for choosing confidence:
- "high": The answer is clearly and directly stated in the docs. Set "source" to the doc title plus the exact sentence/phrase that supports it. Set "missing_info" to null. Write the answer directly, no hedging.
- "medium": The answer is only partially in the docs, or requires reasonable inference combining/extrapolating from what's written. Use hedged language ("likely", "based on the available docs", "it appears"). Still cite the closest "source". Put what's uncertain in "missing_info".
- "low": The answer is NOT in the docs (e.g. enterprise contract terms, custom-discount authority, anything requiring a human's judgment). DO NOT invent or guess an answer. The "answer" field should honestly say you don't have grounded information on this and that it should go to a human (a manager or the billing team). Set "source" to null. Put what would be needed in "missing_info".

Never fabricate policies, numbers, or sources. If the docs don't say it, you don't know it. Output ONLY the JSON object.`;

/** Strip markdown fences and isolate the first JSON object in a string. */
function extractJson(raw: string): string | null {
  let s = raw.trim();
  // Remove ```json ... ``` or ``` ... ``` fences.
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  return s.slice(start, end + 1);
}

const VALID: Confidence[] = ["high", "medium", "low"];

/** Validate + coerce arbitrary parsed JSON into a TrustAnswer, or null. */
function coerce(parsed: unknown): TrustAnswer | null {
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Record<string, unknown>;
  if (typeof p.answer !== "string" || !p.answer.trim()) return null;
  const confidence = VALID.includes(p.confidence as Confidence)
    ? (p.confidence as Confidence)
    : "low";
  return {
    answer: p.answer.trim(),
    confidence,
    source:
      typeof p.source === "string" && p.source.trim() ? p.source.trim() : null,
    reasoning:
      typeof p.reasoning === "string" && p.reasoning.trim()
        ? p.reasoning.trim()
        : "No reasoning provided by the model.",
    missing_info:
      typeof p.missing_info === "string" && p.missing_info.trim()
        ? p.missing_info.trim()
        : null,
  };
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  let question = "";
  try {
    const body = await req.json();
    question = typeof body?.question === "string" ? body.question.trim() : "";
  } catch {
    return NextResponse.json<AskResponse>(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!question) {
    return NextResponse.json<AskResponse>(
      { ok: false, error: "Please enter a question." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    // Designed fallback path: the project treats a missing key as an honest,
    // on-brand "uncertain" state rather than a hard crash.
    return NextResponse.json<AskResponse>(
      {
        ok: false,
        error:
          "The live model isn't connected (no OPENROUTER_API_KEY set). This is the demo's honest fallback state — set the key locally or in Vercel to enable live answers.",
      },
      { status: 503 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gangishettysanjana.com",
        "X-Title": "The AI Trust Meter",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Here is the Meridian knowledge base:\n\n${docsAsContext()}\n\n---\n\nUser question: "${question}"\n\nRespond with ONLY the JSON object.`,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json<AskResponse>(
        {
          ok: false,
          error: `The model service returned an error (${res.status}). ${
            detail.slice(0, 160) || "Please try again."
          }`,
        },
        { status: 502 }
      );
    }

    const json = await res.json();
    const raw: string | undefined = json?.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json<AskResponse>(
        { ok: false, error: "The model returned an empty response." },
        { status: 502 }
      );
    }

    // Defensive parsing: fences, stray prose, malformed JSON all fall back gracefully.
    const candidate = extractJson(raw) ?? raw;
    let data: TrustAnswer | null = null;
    try {
      data = coerce(JSON.parse(candidate));
    } catch {
      data = null;
    }

    if (!data) {
      // The model didn't give us parseable JSON — degrade to an honest low state
      // rather than showing nothing.
      return NextResponse.json<AskResponse>({
        ok: true,
        data: {
          answer:
            "I couldn't produce a structured, grounded answer for that question.",
          confidence: "low",
          source: null,
          reasoning:
            "The model's response could not be parsed into the expected format, so this is being shown as an uncertain state by default.",
          missing_info:
            "Try rephrasing the question, or check the Meridian docs directly.",
        },
      });
    }

    return NextResponse.json<AskResponse>({ ok: true, data });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return NextResponse.json<AskResponse>(
      {
        ok: false,
        error: aborted
          ? "The model took too long to respond. Please try again."
          : "Something went wrong reaching the model service.",
      },
      { status: aborted ? 504 : 500 }
    );
  }
}
