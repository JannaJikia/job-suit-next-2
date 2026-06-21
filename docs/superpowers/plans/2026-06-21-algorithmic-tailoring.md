# Algorithmic Resume Tailoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mandatory Claude rewrite with a deterministic, client-side resume-tailoring algorithm (reorder, inject keywords, strengthen bullets, generate summary), keep AI as an optional toggle, and redesign the UI to clean modern SaaS.

**Architecture:** A pure-TypeScript pipeline in `lib/tailor/` parses the resume into a structured model, scores fragments against JD keywords, reorders bullets, strengthens verbs, conservatively injects missing keywords into Skills, generates a template summary, and serializes back to ATS plain text. It runs in the browser via the tailor hook. The Claude API route stays only for an opt-in AI mode.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind, Vitest (new), existing `@anthropic-ai/sdk` (AI mode only).

## Global Constraints

- Node `>=18.17.0`.
- Algorithm path makes **no network calls** and needs **no API key**.
- **Never** introduce facts not present in input: no new employers, titles, dates, credentials, or numbers. Injected keywords go only into Skills and are returned for user review.
- Commits carry **no Claude attribution** (no `Co-Authored-By: Claude`, no "Generated with Claude Code").
- Keep existing public route contract (`POST /api/tailor` → `{ tailored, score }`) working for AI mode.
- TypeScript strict; `npm run lint` and `npm run build` must pass.

---

### Task 1: Add Vitest test infrastructure

**Files:**
- Modify: `package.json` (add deps + `test` script)
- Create: `vitest.config.ts`
- Create: `lib/tailor/__tests__/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest; `lib/tailor/` is the test root.

- [ ] **Step 1: Install Vitest**

Run: `npm i -D vitest@^2.1.0`

- [ ] **Step 2: Add test script to package.json**

In `scripts`, add: `"test": "vitest run"`, `"test:watch": "vitest"`

- [ ] **Step 3: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
```

- [ ] **Step 4: Create smoke test**

```ts
import { describe, it, expect } from "vitest";
describe("vitest", () => {
  it("runs", () => { expect(1 + 1).toBe(2); });
});
```

- [ ] **Step 5: Run and verify**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/tailor/__tests__/smoke.test.ts
git commit -m "chore: add Vitest test infrastructure"
```

---

### Task 2: Resume model — parse + serialize (round-trip)

**Files:**
- Create: `lib/tailor/types.ts`
- Create: `lib/tailor/parseResume.ts`
- Create: `lib/tailor/serialize.ts`
- Create: `lib/tailor/parseResume.test.ts`

**Interfaces:**
- Consumes: `SECTION_HEADING_RE`, `parseResumeOutputLines` from `lib/parseResumeOutput.ts`.
- Produces:
  - `interface Entry { header?: string; bullets: string[]; body: string[] }`
  - `interface Section { name: string; entries: Entry[] }`
  - `interface ParsedResume { title: string; contact: string[]; preamble: string[]; sections: Section[] }`
  - `parseResume(text: string): ParsedResume`
  - `serialize(resume: ParsedResume): string`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import { parseResume } from "./parseResume";
import { serialize } from "./serialize";

const SAMPLE = `Jane Doe
jane@example.com | (555) 123-4567

SUMMARY
Engineer with 5 years building web apps.

EXPERIENCE
Acme Corp — Senior Engineer (2020–2024)
- Built a React dashboard used by 2,000 users
- Improved API latency

SKILLS
JavaScript, React, Node.js`;

describe("parseResume", () => {
  it("captures title and contact", () => {
    const r = parseResume(SAMPLE);
    expect(r.title).toBe("Jane Doe");
    expect(r.contact.join(" ")).toContain("jane@example.com");
  });
  it("captures sections and bullets", () => {
    const r = parseResume(SAMPLE);
    const exp = r.sections.find((s) => /EXPERIENCE/i.test(s.name));
    expect(exp?.entries[0].header).toContain("Acme Corp");
    expect(exp?.entries[0].bullets).toHaveLength(2);
  });
  it("round-trips without losing facts", () => {
    const out = serialize(parseResume(SAMPLE));
    expect(out).toContain("Acme Corp");
    expect(out).toContain("2,000 users");
    expect(out).toContain("JavaScript");
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- parseResume`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement types.ts**

```ts
export interface Entry { header?: string; bullets: string[]; body: string[] }
export interface Section { name: string; entries: Entry[] }
export interface ParsedResume {
  title: string;
  contact: string[];
  preamble: string[];
  sections: Section[];
}
```

- [ ] **Step 4: Implement parseResume.ts**

```ts
import { parseResumeOutputLines } from "@/lib/parseResumeOutput";
import type { Entry, ParsedResume, Section } from "./types";

export function parseResume(text: string): ParsedResume {
  const lines = parseResumeOutputLines(text);
  const resume: ParsedResume = { title: "", contact: [], preamble: [], sections: [] };
  let section: Section | null = null;
  let entry: Entry | null = null;
  let sawSection = false;

  const pushEntry = () => {
    if (section && entry && (entry.header || entry.bullets.length || entry.body.length)) {
      section.entries.push(entry);
    }
    entry = null;
  };

  for (const ln of lines) {
    if (ln.kind === "title") { resume.title = ln.text; continue; }
    if (ln.kind === "section") {
      pushEntry();
      section = { name: ln.text.replace(/:\s*$/, ""), entries: [] };
      resume.sections.push(section);
      sawSection = true;
      continue;
    }
    if (ln.kind === "blank") { if (section) pushEntry(); continue; }
    if (!sawSection) {
      // lines before the first section header = contact / preamble
      if (resume.contact.length === 0 && /[@|•]|\d{3}/.test(ln.text)) resume.contact.push(ln.text);
      else resume.preamble.push(ln.text);
      continue;
    }
    if (!section) continue;
    if (ln.kind === "bullet") {
      if (!entry) entry = { bullets: [], body: [] };
      entry.bullets.push(ln.text);
    } else { // body line: a new entry header if no bullets yet, else body
      if (entry && entry.bullets.length) pushEntry();
      if (!entry) entry = { header: ln.text, bullets: [], body: [] };
      else if (!entry.header) entry.header = ln.text;
      else entry.body.push(ln.text);
    }
  }
  pushEntry();
  return resume;
}
```

- [ ] **Step 5: Implement serialize.ts**

```ts
import type { ParsedResume } from "./types";

export function serialize(resume: ParsedResume): string {
  const out: string[] = [];
  if (resume.title) out.push(resume.title);
  resume.contact.forEach((c) => out.push(c));
  resume.preamble.forEach((p) => out.push(p));
  for (const section of resume.sections) {
    out.push("");
    out.push(section.name.toUpperCase());
    for (const entry of section.entries) {
      if (entry.header) out.push(entry.header);
      entry.body.forEach((b) => out.push(b));
      entry.bullets.forEach((b) => out.push(`- ${b}`));
    }
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
```

- [ ] **Step 6: Run to verify pass**

Run: `npm test -- parseResume`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/tailor/types.ts lib/tailor/parseResume.ts lib/tailor/serialize.ts lib/tailor/parseResume.test.ts
git commit -m "feat: resume parse/serialize model"
```

---

### Task 3: Relevance scoring

**Files:**
- Create: `lib/tailor/score.ts`
- Create: `lib/tailor/score.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `scoreText(text: string, keywords: string[]): number` — count of distinct keywords present, each weighted by token length (multi-word keywords weigh more).

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { scoreText } from "./score";

describe("scoreText", () => {
  it("scores keyword overlap", () => {
    const kw = ["react", "node.js", "team leadership"];
    expect(scoreText("Built React apps", kw)).toBeGreaterThan(0);
  });
  it("weights multi-word matches higher than single", () => {
    const single = scoreText("react", ["react"]);
    const multi = scoreText("team leadership", ["team leadership"]);
    expect(multi).toBeGreaterThan(single);
  });
  it("is zero for no overlap", () => {
    expect(scoreText("gardening", ["react"])).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- score`
Expected: FAIL.

- [ ] **Step 3: Implement score.ts**

```ts
export function scoreText(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const haystack = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (haystack.includes(k)) score += 1 + k.split(/\s+/).length * 0.5;
  }
  return score;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- score`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/tailor/score.ts lib/tailor/score.test.ts
git commit -m "feat: relevance scoring for tailoring"
```

---

### Task 4: Reorder bullets by relevance

**Files:**
- Create: `lib/tailor/reorder.ts`
- Create: `lib/tailor/reorder.test.ts`

**Interfaces:**
- Consumes: `ParsedResume`, `Section` (`./types`); `scoreText` (`./score`).
- Produces: `reorder(resume: ParsedResume, keywords: string[]): { resume: ParsedResume; reordered: number }` — stable-sorts bullets within each entry of EXPERIENCE/PROJECTS/SKILLS by descending score; entry headers and section order untouched; `reordered` = count of bullets whose index changed.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { reorder } from "./reorder";
import type { ParsedResume } from "./types";

const make = (bullets: string[]): ParsedResume => ({
  title: "X", contact: [], preamble: [],
  sections: [{ name: "EXPERIENCE", entries: [{ header: "Co", bullets, body: [] }] }],
});

describe("reorder", () => {
  it("moves relevant bullets up", () => {
    const r = make(["Did gardening", "Built React apps"]);
    const { resume, reordered } = reorder(r, ["react"]);
    expect(resume.sections[0].entries[0].bullets[0]).toContain("React");
    expect(reordered).toBeGreaterThan(0);
  });
  it("is stable when no keywords match", () => {
    const r = make(["A", "B"]);
    const { resume, reordered } = reorder(r, ["zzz"]);
    expect(resume.sections[0].entries[0].bullets).toEqual(["A", "B"]);
    expect(reordered).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- reorder`
Expected: FAIL.

- [ ] **Step 3: Implement reorder.ts**

```ts
import type { ParsedResume } from "./types";
import { scoreText } from "./score";

const REORDERABLE = /EXPERIENCE|PROJECTS|SKILLS/i;

export function reorder(resume: ParsedResume, keywords: string[]) {
  let reordered = 0;
  const sections = resume.sections.map((section) => {
    if (!REORDERABLE.test(section.name)) return section;
    const entries = section.entries.map((entry) => {
      const indexed = entry.bullets.map((b, i) => ({ b, i, s: scoreText(b, keywords) }));
      const sorted = [...indexed].sort((a, z) => z.s - a.s || a.i - z.i);
      sorted.forEach((item, newIdx) => { if (item.i !== newIdx) reordered++; });
      return { ...entry, bullets: sorted.map((x) => x.b) };
    });
    return { ...section, entries };
  });
  return { resume: { ...resume, sections }, reordered };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- reorder`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/tailor/reorder.ts lib/tailor/reorder.test.ts
git commit -m "feat: reorder bullets by JD relevance"
```

---

### Task 5: Strengthen bullets (verbs + synonyms)

**Files:**
- Create: `lib/tailor/verbs.ts`
- Create: `lib/tailor/strengthen.ts`
- Create: `lib/tailor/strengthen.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces:
  - `WEAK_VERB_MAP: Record<string,string>`, `STRONG_VERBS: Set<string>` (`./verbs`)
  - `strengthenBullet(bullet: string): { text: string; changed: boolean }`
  - `strengthenResume(resume, keywords)` is added in Task 8; this task exports only `strengthenBullet`.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { strengthenBullet } from "./strengthen";

describe("strengthenBullet", () => {
  it("replaces weak lead verbs with strong ones", () => {
    const { text, changed } = strengthenBullet("Responsible for managing the team");
    expect(text.toLowerCase().startsWith("led")).toBe(true);
    expect(changed).toBe(true);
  });
  it("capitalizes and keeps strong verbs", () => {
    const { text, changed } = strengthenBullet("built a dashboard");
    expect(text).toBe("Built a dashboard");
    expect(changed).toBe(true);
  });
  it("never invents numbers", () => {
    const { text } = strengthenBullet("Improved performance");
    expect(/\d/.test(text)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- strengthen`
Expected: FAIL.

- [ ] **Step 3: Implement verbs.ts**

```ts
// Phrase replacements (checked first, longest phrases win) then single-word swaps.
export const WEAK_PHRASE_MAP: Record<string, string> = {
  "responsible for managing": "Led",
  "responsible for leading": "Led",
  "responsible for": "Owned",
  "worked on": "Built",
  "helped with": "Supported",
  "in charge of": "Directed",
  "tasked with": "Drove",
};
export const WEAK_VERB_MAP: Record<string, string> = {
  managed: "Led", made: "Built", did: "Executed", used: "Leveraged",
  handled: "Managed", created: "Built", helped: "Supported", worked: "Built",
};
export const STRONG_VERBS = new Set([
  "led","built","designed","launched","drove","owned","delivered","improved",
  "reduced","increased","architected","shipped","scaled","automated","directed",
]);
```

- [ ] **Step 4: Implement strengthen.ts**

```ts
import { WEAK_PHRASE_MAP, WEAK_VERB_MAP } from "./verbs";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function strengthenBullet(bullet: string): { text: string; changed: boolean } {
  let text = bullet.trim();
  const original = text;
  const lower = text.toLowerCase();

  // 1. phrase replacement at start (longest match first)
  const phrases = Object.keys(WEAK_PHRASE_MAP).sort((a, b) => b.length - a.length);
  for (const p of phrases) {
    if (lower.startsWith(p)) {
      text = WEAK_PHRASE_MAP[p] + text.slice(p.length);
      return { text: cap(text.trim()), changed: true };
    }
  }
  // 2. single weak lead verb
  const firstWord = text.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  if (WEAK_VERB_MAP[firstWord]) {
    text = WEAK_VERB_MAP[firstWord] + text.slice(firstWord.length);
  }
  text = cap(text);
  return { text, changed: text !== original };
}
```

- [ ] **Step 5: Run to verify pass**

Run: `npm test -- strengthen`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/tailor/verbs.ts lib/tailor/strengthen.ts lib/tailor/strengthen.test.ts
git commit -m "feat: rule-based bullet strengthening"
```

---

### Task 6: Inject missing keywords (conservative)

**Files:**
- Create: `lib/tailor/injectKeywords.ts`
- Create: `lib/tailor/injectKeywords.test.ts`

**Interfaces:**
- Consumes: `ParsedResume`, `Section` (`./types`).
- Produces: `injectKeywords(resume, missing): { resume: ParsedResume; injected: string[] }` — adds only single-token, skill-like missing keywords (no spaces, length 2–30, not pure numbers) into a SKILLS section (creating one if absent). Returns the injected terms for user review. Caps at 12 injected terms.

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { injectKeywords } from "./injectKeywords";
import type { ParsedResume } from "./types";

const base: ParsedResume = {
  title: "X", contact: [], preamble: [],
  sections: [{ name: "SKILLS", entries: [{ bullets: [], body: ["JavaScript, React"] }] }],
};

describe("injectKeywords", () => {
  it("adds missing single-word skills to SKILLS", () => {
    const { resume, injected } = injectKeywords(base, ["typescript", "react"]);
    expect(injected).toContain("typescript");
    expect(injected).not.toContain("react"); // already present
    expect(JSON.stringify(resume)).toContain("typescript");
  });
  it("skips multi-word phrases", () => {
    const { injected } = injectKeywords(base, ["team leadership"]);
    expect(injected).not.toContain("team leadership");
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- injectKeywords`
Expected: FAIL.

- [ ] **Step 3: Implement injectKeywords.ts**

```ts
import type { ParsedResume, Section } from "./types";

const isSkillLike = (k: string) =>
  !/\s/.test(k) && k.length >= 2 && k.length <= 30 && !/^\d+$/.test(k);

export function injectKeywords(resume: ParsedResume, missing: string[]) {
  const haystack = JSON.stringify(resume).toLowerCase();
  const injected: string[] = [];
  for (const k of missing) {
    if (injected.length >= 12) break;
    const kw = k.toLowerCase();
    if (isSkillLike(kw) && !haystack.includes(kw)) injected.push(kw);
  }
  if (injected.length === 0) return { resume, injected };

  const sections = resume.sections.map((s) => ({ ...s, entries: s.entries.map((e) => ({ ...e })) }));
  let skills: Section | undefined = sections.find((s) => /SKILLS/i.test(s.name));
  if (!skills) { skills = { name: "SKILLS", entries: [{ bullets: [], body: [] }] }; sections.push(skills); }
  if (skills.entries.length === 0) skills.entries.push({ bullets: [], body: [] });
  const entry = skills.entries[0];
  const existing = entry.body.join(", ");
  entry.body = [[existing, injected.join(", ")].filter(Boolean).join(", ")];
  return { resume: { ...resume, sections }, injected };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- injectKeywords`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/tailor/injectKeywords.ts lib/tailor/injectKeywords.test.ts
git commit -m "feat: conservative keyword injection into Skills"
```

---

### Task 7: Generate template summary

**Files:**
- Create: `lib/tailor/summary.ts`
- Create: `lib/tailor/summary.test.ts`

**Interfaces:**
- Consumes: `ParsedResume` (`./types`).
- Produces:
  - `extractRoleTitle(jd: string): string` — first plausible role line from the JD, else "the role".
  - `buildSummary(resume, jd, keywords): string` — a 1–2 sentence summary using the role title + top matched skills already present in the resume (no invented facts).

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { buildSummary, extractRoleTitle } from "./summary";
import type { ParsedResume } from "./types";

const resume: ParsedResume = {
  title: "Jane", contact: [], preamble: [],
  sections: [{ name: "SKILLS", entries: [{ bullets: [], body: ["React, Node.js, AWS"] }] }],
};

describe("summary", () => {
  it("extracts a role title", () => {
    expect(extractRoleTitle("Senior Frontend Engineer\nWe are hiring...")).toMatch(/Engineer/i);
  });
  it("builds a summary from present skills only", () => {
    const s = buildSummary(resume, "Senior Frontend Engineer", ["react", "aws", "kotlin"]);
    expect(s.toLowerCase()).toContain("react");
    expect(s.toLowerCase()).not.toContain("kotlin"); // not in resume
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- summary`
Expected: FAIL.

- [ ] **Step 3: Implement summary.ts**

```ts
import type { ParsedResume } from "./types";

export function extractRoleTitle(jd: string): string {
  const first = jd.split(/\r?\n/).map((l) => l.trim()).find(Boolean) || "";
  if (first && first.length <= 60 && /[A-Za-z]/.test(first)) return first;
  return "the role";
}

export function buildSummary(resume: ParsedResume, jd: string, keywords: string[]): string {
  const role = extractRoleTitle(jd);
  const hay = JSON.stringify(resume).toLowerCase();
  const present = keywords.filter((k) => hay.includes(k.toLowerCase())).slice(0, 4);
  const skillList = present.length ? present.join(", ") : "relevant skills";
  return `Results-driven professional targeting ${role}, with proven strengths in ${skillList}.`;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- summary`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/tailor/summary.ts lib/tailor/summary.test.ts
git commit -m "feat: template summary generation"
```

---

### Task 8: Orchestrator — tailorResume + report

**Files:**
- Create: `lib/tailor/index.ts`
- Create: `lib/tailor/index.test.ts`

**Interfaces:**
- Consumes: `parseResume`, `serialize`, `reorder`, `strengthenBullet`, `injectKeywords`, `buildSummary` (all from `./*`); `extractKeywords`, `scoreMatch` (`@/lib/keywords`).
- Produces:
  - `interface TailorReport { reorderedBullets: number; strengthenedBullets: number; injectedKeywords: string[]; generatedSummary: boolean; matchBefore: number; matchAfter: number }`
  - `interface TailorOptions { reorder?: boolean; strengthen?: boolean; inject?: boolean; summary?: boolean }`
  - `tailorResume(input: { resume: string; jd: string; options?: TailorOptions }): { tailored: string; score: { pct: number; matched: string[]; missing: string[] }; report: TailorReport }`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { tailorResume } from "./index";

const RESUME = `Jane Doe
jane@example.com

EXPERIENCE
Acme Corp — Engineer (2020–2024)
- Responsible for managing a team of 4
- Did gardening tasks

SKILLS
JavaScript`;

const JD = `Senior React Engineer
We need React, TypeScript, and team leadership.`;

describe("tailorResume", () => {
  it("preserves facts (company, dates)", () => {
    const { tailored } = tailorResume({ resume: RESUME, jd: JD });
    expect(tailored).toContain("Acme Corp");
    expect(tailored).toContain("2020–2024");
  });
  it("does not lower the match score", () => {
    const { report } = tailorResume({ resume: RESUME, jd: JD });
    expect(report.matchAfter).toBeGreaterThanOrEqual(report.matchBefore);
  });
  it("reports strengthened bullets and injected keywords", () => {
    const { report } = tailorResume({ resume: RESUME, jd: JD });
    expect(report.strengthenedBullets).toBeGreaterThan(0);
    expect(report.injectedKeywords).toContain("typescript");
  });
  it("never invents numbers", () => {
    const { tailored } = tailorResume({ resume: RESUME, jd: JD });
    // only number present in input is "4"; no fabricated digits beyond input digits/years
    const digits = (tailored.match/\d+/g) || [];
    expect(digits.every((d) => RESUME.includes(d) || JD.includes(d))).toBe(true);
  });
});
```

> Note: fix the typo when implementing — `tailored.match(/\d+/g)`.

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- index`
Expected: FAIL.

- [ ] **Step 3: Implement index.ts**

```ts
import { extractKeywords, scoreMatch } from "@/lib/keywords";
import { parseResume } from "./parseResume";
import { serialize } from "./serialize";
import { reorder } from "./reorder";
import { strengthenBullet } from "./strengthen";
import { injectKeywords } from "./injectKeywords";
import { buildSummary } from "./summary";
import type { Section } from "./types";

export interface TailorReport {
  reorderedBullets: number;
  strengthenedBullets: number;
  injectedKeywords: string[];
  generatedSummary: boolean;
  matchBefore: number;
  matchAfter: number;
}
export interface TailorOptions {
  reorder?: boolean; strengthen?: boolean; inject?: boolean; summary?: boolean;
}

const DEFAULTS: Required<TailorOptions> = { reorder: true, strengthen: true, inject: true, summary: true };

export function tailorResume(input: { resume: string; jd: string; options?: TailorOptions }) {
  const opts = { ...DEFAULTS, ...(input.options || {}) };
  const keywords = extractKeywords(input.jd);
  const matchBefore = scoreMatch(input.resume, keywords).pct;

  let resume = parseResume(input.resume);
  let reorderedBullets = 0;
  let strengthenedBullets = 0;
  let injectedKeywords: string[] = [];
  let generatedSummary = false;

  if (opts.strengthen) {
    resume = {
      ...resume,
      sections: resume.sections.map((s) => /EXPERIENCE|PROJECTS/i.test(s.name)
        ? { ...s, entries: s.entries.map((e) => ({
            ...e,
            bullets: e.bullets.map((b) => {
              const { text, changed } = strengthenBullet(b);
              if (changed) strengthenedBullets++;
              return text;
            }),
          })) }
        : s),
    };
  }

  if (opts.reorder) {
    const res = reorder(resume, keywords);
    resume = res.resume; reorderedBullets = res.reordered;
  }

  if (opts.inject) {
    const missing = scoreMatch(serialize(resume), keywords).missing;
    const res = injectKeywords(resume, missing);
    resume = res.resume; injectedKeywords = res.injected;
  }

  if (opts.summary) {
    const summaryText = buildSummary(resume, input.jd, keywords);
    const summarySection: Section = { name: "SUMMARY", entries: [{ bullets: [], body: [summaryText] }] };
    const existing = resume.sections.findIndex((s) => /SUMMARY/i.test(s.name));
    if (existing >= 0) resume.sections[existing] = summarySection;
    else resume.sections.unshift(summarySection);
    generatedSummary = true;
  }

  const tailored = serialize(resume);
  const after = scoreMatch(tailored, keywords);

  return {
    tailored,
    score: after,
    report: {
      reorderedBullets, strengthenedBullets, injectedKeywords, generatedSummary,
      matchBefore, matchAfter: after.pct,
    } as TailorReport,
  };
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- index`
Expected: PASS.

- [ ] **Step 5: Run full suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/tailor/index.ts lib/tailor/index.test.ts
git commit -m "feat: tailorResume orchestrator with transparency report"
```

---

### Task 9: Wire algorithm into the client + UI controls

**Files:**
- Modify: `components/tailor/types.ts` (add `TailorMode`, report state types)
- Modify: `components/tailor/useTailorActions.ts` (algorithm default, AI optional)
- Modify: `components/tailor/ResumeTailorApp.tsx` (state for mode + report)
- Modify: `components/tailor/GenerateCard.tsx` (mode toggle)
- Create: `components/tailor/ChangeReportCard.tsx` (report + injected-keyword review)
- Modify: `app/api/tailor/route.ts` (return 503 with clear message when no key)

**Interfaces:**
- Consumes: `tailorResume`, `TailorReport` (`@/lib/tailor`).
- Produces: client runs `tailorResume` directly for `mode === "algorithm"`; AI mode keeps the fetch.

- [ ] **Step 1: Add mode type**

In `components/tailor/types.ts` add:
```ts
export type TailorMode = "algorithm" | "ai";
```

- [ ] **Step 2: Update useTailorActions.ts generate()**

Replace the body of `generate` so it branches on a `mode` argument and sets the report. Add `mode: TailorMode` and `setReport: (r: TailorReport | null) => void` to the hook signature, then:
```ts
import { tailorResume, type TailorReport } from "@/lib/tailor";
// ...
if (mode === "algorithm") {
  const { tailored, score, report } = tailorResume({ resume, jd });
  setOutput(tailored);
  setReport(report);
  setStatus({ kind: "ok", text: `Tailored offline. Match ${report.matchBefore}% → ${report.matchAfter}%.` });
  setLoading(false);
  return;
}
// existing fetch("/api/tailor") path for mode === "ai", then setReport(null)
```

- [ ] **Step 3: Add report + mode state in ResumeTailorApp.tsx**

```ts
const [mode, setMode] = useState<TailorMode>("algorithm");
const [report, setReport] = useState<TailorReport | null>(null);
```
Pass `mode` + `setReport` into `useTailorActions(...)`, pass `mode/setMode` to `GenerateCard`, and render `<ChangeReportCard report={report} output={output} setOutput={setOutput} />` near `OutputCard`.

- [ ] **Step 4: Add mode toggle in GenerateCard.tsx**

Add a segmented control (two buttons) bound to `mode`/`setMode`. Label: "Algorithm (offline)" and "AI (Claude)". Default Algorithm.

- [ ] **Step 5: Create ChangeReportCard.tsx**

```tsx
"use client";
import type { TailorReport } from "@/lib/tailor";

export function ChangeReportCard({ report }: { report: TailorReport | null }) {
  if (!report) return null;
  return (
    <section className="rounded-xl border p-4">
      <h3 className="font-semibold">What changed</h3>
      <ul className="mt-2 text-sm space-y-1">
        <li>Bullets reordered: {report.reorderedBullets}</li>
        <li>Bullets strengthened: {report.strengthenedBullets}</li>
        <li>Summary generated: {report.generatedSummary ? "yes" : "no"}</li>
        <li>Match: {report.matchBefore}% → {report.matchAfter}%</li>
      </ul>
      {report.injectedKeywords.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Keywords added to Skills — review for accuracy:</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {report.injectedKeywords.map((k) => (
              <span key={k} className="rounded bg-amber-100 px-2 py-0.5 text-xs">{k}</span>
            ))}
          </div>
          <p className="mt-1 text-xs text-neutral-500">Remove any in the output that aren't true for you.</p>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 6: Harden route.ts AI fallback**

In `app/api/tailor/route.ts`, the missing-key branch already returns 500; change status to 503 and message to: `"AI mode unavailable: ANTHROPIC_API_KEY not set. Use Algorithm mode instead."`

- [ ] **Step 7: Verify build + tests**

Run: `npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add components/tailor app/api/tailor/route.ts
git commit -m "feat: client-side algorithm mode with change report and AI toggle"
```

---

### Task 10: Redesign UI — clean modern SaaS

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts` (palette, fonts, tokens)
- Modify: `components/landing/*` (hero, features, how-it-works, CTA, nav, footer)
- Modify: `components/tailor/*` cards (visual polish only — no logic changes)

**Interfaces:**
- No interface changes; visual only. Must not break the algorithm wiring from Task 9.

- [ ] **Step 1: Invoke the redesign skill**

Use the `design-taste-frontend` skill for direction (clean modern SaaS), then apply tokens (color palette, type scale, spacing, shadows, radii) in `tailwind.config.ts` + `app/globals.css`.

- [ ] **Step 2: Restyle landing components**

Apply the system to `LandingHero`, `LandingFeatures`/`FeatureCard`, `HowItWorks`, `LandingCta`, `LandingNav`, `LandingFooter`. Keep copy; improve hierarchy, spacing, and CTA prominence.

- [ ] **Step 3: Restyle tailor workspace**

Polish `ResumeCard`, `JobDescriptionCard`, `GenerateCard`, `OutputCard`, `MatchAnalysisCard`, `ChangeReportCard`, `TailorHeader` to match the system.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, load `/` and `/tailor`, confirm layout/responsive on narrow + wide widths.

- [ ] **Step 5: Verify build**

Run: `npm run lint && npm run build`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add app components tailwind.config.ts
git commit -m "feat: redesign landing and tailor workspace (clean modern SaaS)"
```

---

### Task 11: Code-review readiness

**Files:**
- Modify: `README.md` (document algorithm mode + AI toggle)
- Modify: `.env.example` (note AI is optional)

- [ ] **Step 1: Update README**

Document: algorithm runs offline by default, no key required; AI mode optional with `ANTHROPIC_API_KEY`. Describe the four behaviors and the transparency report.

- [ ] **Step 2: Update .env.example**

Add a comment that `ANTHROPIC_API_KEY` is only needed for optional AI mode.

- [ ] **Step 3: Full verification**

Run: `npm run lint && npm test && npm run build`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add README.md .env.example
git commit -m "docs: document offline algorithm mode and optional AI"
```

- [ ] **Step 5: Run code review**

Run the `superpowers:requesting-code-review` skill (or `/code-review`) against the branch diff. Address findings before handoff.

---

## Self-Review Notes

- **Spec coverage:** parse/serialize (T2), score (T3), reorder (T4), strengthen (T5), inject (T6), summary (T7), orchestrator+report (T8), client wiring + AI toggle + 503 fallback (T9), redesign (T10), tests (T1 + per-task), code-review readiness (T11). All spec sections mapped.
- **Truthfulness guard:** covered by T8 "never invents numbers" test and conservative inject (T6 single-token, must-be-absent).
- **Type consistency:** `TailorReport`/`TailorOptions`/`tailorResume` signatures defined in T8 and consumed verbatim in T9.
