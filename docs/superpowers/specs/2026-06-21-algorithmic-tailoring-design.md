# Algorithmic Resume Tailoring + Redesign — Design

**Date:** 2026-06-21
**Branch:** `feature/algorithmic-tailoring`

## Problem

JobSuit currently tailors resumes by sending them to the Claude API for a full
prose rewrite (`app/api/tailor/route.ts` → `lib/prompt.ts`). The goal is to add a
deterministic, **no-AI tailoring algorithm** that does the job well, runs offline,
and keeps the AI path only as an optional fallback. The UI is also redesigned to a
clean, modern SaaS aesthetic.

## Goals

- Tailor a plain-text resume to a job description with **no AI**, deterministically.
- Never fabricate facts, employers, titles, dates, credentials, or numbers.
- Run **client-side** (pure TypeScript): instant, private, no API key required.
- Keep Claude as an **optional** "AI mode" toggle, used only when a key is present.
- Show the user **exactly what changed** (transparency report) and let them review
  any injected keywords.
- Redesign landing + tailor workspace: **clean, modern SaaS**.

## Non-Goals

- AI-quality prose generation in the algorithm path (impossible without an LLM).
- Parsing PDF/DOCX *input* (input stays plain text, as today).
- Multi-language tailoring.

## Architecture

### Tailoring pipeline — `lib/tailor/`

Pure, side-effect-free TypeScript. Orchestrated by `tailorResume()`.

| Module | Responsibility | Input → Output |
|---|---|---|
| `parseResume.ts` | Parse plain-text resume into a structured model: title, contact lines, and sections → entries → bullets. Reuses `lib/parseResumeOutput.ts` line classification. | `string` → `ParsedResume` |
| `score.ts` | Score any text fragment against the JD keyword set (keyword overlap + TF weighting). Builds on `extractKeywords`/`scoreMatch` in `lib/keywords.ts`. | `(text, keywords)` → `number` |
| `reorder.ts` | Within EXPERIENCE / SKILLS / PROJECTS, stable-sort bullets/items by relevance score. Entry headers (company, title, dates) stay locked; only bullets under each entry reorder. | `ParsedResume` → `ParsedResume` |
| `strengthen.ts` | Rule-based bullet improvement: weak-verb→strong-verb map, ensure each bullet starts with a strong past-tense action verb, synonym mapping toward JD terms. No fabricated content. | `bullet, keywords` → `bullet` |
| `injectKeywords.ts` | Find JD keywords missing from the resume; **conservatively** add them to a Skills section. All injected terms are returned as a reviewable list so the user can remove anything untrue. | `(ParsedResume, missing)` → `{ resume, injected[] }` |
| `summary.ts` | Build a template summary from the JD role title + the candidate's top-matching skills. | `(ParsedResume, jd, keywords)` → `string` |
| `serialize.ts` | Render `ParsedResume` back to clean ATS plain text. | `ParsedResume` → `string` |
| `index.ts` | `tailorResume({ resume, jd, options })` runs the pipeline and returns `{ tailored, score, report }`. | — |

**`TailorReport`** captures transparency data:
```ts
interface TailorReport {
  reorderedBullets: number;
  strengthenedBullets: number;
  injectedKeywords: string[]; // user-reviewable
  generatedSummary: boolean;
  matchBefore: number;        // % keyword match before
  matchAfter: number;         // % after
}
```

**Options (defaults):** conservative keyword injection (Skills only, all flagged);
all four behaviors on (reorder, inject, strengthen, summary).

### Data flow (algorithm mode — default)

```
resume + jd  ──>  useTailorActions (client)
                     │
                     ├─ extractKeywords(jd)          (lib/keywords.ts)
                     └─ tailorResume({resume, jd})   (lib/tailor/index.ts)
                            └─> { tailored, score, report }
                     │
                     └─> setOutput(tailored) + setReport(report)
```
No network call. No API key.

### Data flow (AI mode — optional)

When the user flips the toggle to **AI**, `useTailorActions` POSTs to
`/api/tailor` exactly as today. The route returns 503 with a clear message if
`ANTHROPIC_API_KEY` is absent, so AI mode degrades gracefully.

### UI changes

- **Mode toggle** (Algorithm / AI) in `GenerateCard`. Algorithm is the default.
- **"What changed" panel** — renders `TailorReport` (bullets reordered/strengthened,
  summary generated, match before→after).
- **Keyword-review panel** — lists `injectedKeywords` with remove controls; removing
  one re-serializes the output without it.
- **Redesign** via `design-taste-frontend`: clean modern SaaS for landing
  (`components/landing/*`) and tailor workspace (`components/tailor/*`).

## Error handling

- Empty resume / JD → existing inline validation (unchanged).
- Resume with no recognizable sections → algorithm still runs on flat bullets;
  reorder/inject become no-ops and the report shows zero changes.
- AI mode with no key → 503 + message; UI keeps the algorithm output available.

## Testing

- Unit tests for each pure module (`parseResume`, `score`, `reorder`,
  `strengthen`, `injectKeywords`, `summary`, `serialize`) with fixture resumes/JDs.
- Integration test for `tailorResume()` asserting: facts preserved (companies,
  titles, dates unchanged), match score non-decreasing, report accuracy.
- Truthfulness guard test: no number or employer appears in output that wasn't in
  input.

## Process

- Branch `feature/algorithmic-tailoring`; commits carry **no Claude attribution**.
- Project left **code-review ready** (lint + build clean, `/code-review` run).
