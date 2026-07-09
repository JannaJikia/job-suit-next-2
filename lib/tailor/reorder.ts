import type { ParsedResume } from "./types";
import { createBm25Scorer } from "./score";

const REORDERABLE = /EXPERIENCE|PROJECTS|SKILLS/i;

export function reorder(resume: ParsedResume, keywords: string[]) {
  let reordered = 0;

  // Corpus = every bullet across the reorderable sections. Building IDF over
  // this set means a keyword that shows up in most bullets carries less weight
  // than one that only appears in a few, so genuinely distinguishing bullets
  // rise to the top.
  const corpus: string[] = [];
  for (const section of resume.sections) {
    if (!REORDERABLE.test(section.name)) continue;
    for (const entry of section.entries) corpus.push(...entry.bullets);
  }
  const scorer = createBm25Scorer(corpus.length ? corpus : [""]);

  const sections = resume.sections.map((section) => {
    if (!REORDERABLE.test(section.name)) return section;
    const entries = section.entries.map((entry) => {
      const indexed = entry.bullets.map((b, i) => ({ b, i, s: scorer.score(b, keywords) }));
      const sorted = [...indexed].sort((a, z) => z.s - a.s || a.i - z.i);
      sorted.forEach((item, newIdx) => {
        if (item.i !== newIdx) reordered++;
      });
      return { ...entry, bullets: sorted.map((x) => x.b) };
    });
    return { ...section, entries };
  });
  return { resume: { ...resume, sections }, reordered };
}
