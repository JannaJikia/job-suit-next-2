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
      sorted.forEach((item, newIdx) => {
        if (item.i !== newIdx) reordered++;
      });
      return { ...entry, bullets: sorted.map((x) => x.b) };
    });
    return { ...section, entries };
  });
  return { resume: { ...resume, sections }, reordered };
}
