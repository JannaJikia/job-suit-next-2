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
  reorder?: boolean;
  strengthen?: boolean;
  inject?: boolean;
  summary?: boolean;
}

const DEFAULTS: Required<TailorOptions> = {
  reorder: true,
  strengthen: true,
  inject: true,
  summary: true,
};

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
      sections: resume.sections.map((s) =>
        /EXPERIENCE|PROJECTS/i.test(s.name)
          ? {
              ...s,
              entries: s.entries.map((e) => ({
                ...e,
                bullets: e.bullets.map((b) => {
                  const { text, changed } = strengthenBullet(b);
                  if (changed) strengthenedBullets++;
                  return text;
                }),
              })),
            }
          : s
      ),
    };
  }

  if (opts.reorder) {
    const res = reorder(resume, keywords);
    resume = res.resume;
    reorderedBullets = res.reordered;
  }

  if (opts.inject) {
    const missing = scoreMatch(serialize(resume), keywords).missing;
    const res = injectKeywords(resume, missing);
    resume = res.resume;
    injectedKeywords = res.injected;
  }

  if (opts.summary) {
    const summaryText = buildSummary(resume, input.jd, keywords);
    const summarySection: Section = {
      name: "SUMMARY",
      entries: [{ bullets: [], body: [summaryText] }],
    };
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
      reorderedBullets,
      strengthenedBullets,
      injectedKeywords,
      generatedSummary,
      matchBefore,
      matchAfter: after.pct,
    } as TailorReport,
  };
}
