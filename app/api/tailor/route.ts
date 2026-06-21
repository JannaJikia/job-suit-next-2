import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "@/lib/prompt";
import { extractKeywords, scoreMatch } from "@/lib/keywords";

export const runtime = "nodejs";
export const maxDuration = 10;

interface Body {
  resume?: string;
  jd?: string;
  tone?: string;
  pages?: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI mode unavailable: ANTHROPIC_API_KEY not set. Use Algorithm mode instead." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const resume = (body.resume || "").trim();
  const jd = (body.jd || "").trim();
  const tone = body.tone || "concise, metric-driven, impactful";
  const pages = body.pages || "1-2 pages";

  if (!resume) return NextResponse.json({ error: "Resume is required." }, { status: 400 });
  if (!jd) return NextResponse.json({ error: "Job description is required." }, { status: 400 });

  // light guardrail on input size (Claude has big context but we still cap it)
  if (resume.length > 40000 || jd.length > 40000) {
    return NextResponse.json(
      { error: "Resume or job description is too long (40k character limit each)." },
      { status: 413 }
    );
  }

  const keywords = extractKeywords(jd);
  const prompt = buildPrompt({ resume, jd, keywords, tone, pages });

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    // collect all text content blocks
    let tailored = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    // strip accidental code fences
    tailored = tailored.replace(/^```[a-z]*\n?/i, "").replace(/\n?```\s*$/, "").trim();

    const score = scoreMatch(tailored, keywords);

    return NextResponse.json({ tailored, score });
  } catch (err) {
    const e = err as Error & { status?: number; error?: { message?: string } };
    const msg = e?.error?.message || e?.message || "Unknown error calling Anthropic API.";
    const status = e?.status || 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
