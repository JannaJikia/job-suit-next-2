import type { ParsedResume, Section } from "./types";

// Generic job-post nouns that pass a naive "looks like a word" filter but are
// not actual skills, so they should never be injected into a Skills section.
const GENERIC_TERMS = new Set(
  (
    "cost new internal role roles company companies product products model models " +
    "research customer customers team teams work working business plan plans goal " +
    "goals impact value values people user users client clients project projects " +
    "experience experiences requirement requirements responsibility responsibilities " +
    "opportunity benefits salary office remote hybrid year years month months day days " +
    "stipend compensation candidate candidates applicant applicants"
  ).split(/\s+/)
);

const isSkillLike = (k: string) =>
  !/\s/.test(k) &&
  k.length >= 2 &&
  k.length <= 30 &&
  !/^\d+$/.test(k) &&
  !GENERIC_TERMS.has(k);

export function injectKeywords(resume: ParsedResume, missing: string[]) {
  const haystack = JSON.stringify(resume).toLowerCase();
  const injected: string[] = [];
  for (const k of missing) {
    if (injected.length >= 12) break;
    const kw = k.toLowerCase();
    if (isSkillLike(kw) && !haystack.includes(kw)) injected.push(kw);
  }
  if (injected.length === 0) return { resume, injected };

  const sections = resume.sections.map((s) => ({
    ...s,
    entries: s.entries.map((e) => ({ ...e })),
  }));
  let skills: Section | undefined = sections.find((s) => /SKILLS/i.test(s.name));
  if (!skills) {
    skills = { name: "SKILLS", entries: [{ bullets: [], body: [] }] };
    sections.push(skills);
  }
  if (skills.entries.length === 0) skills.entries.push({ bullets: [], body: [] });
  const entry = skills.entries[0];
  const existing = entry.body.join(", ");
  entry.body = [[existing, injected.join(", ")].filter(Boolean).join(", ")];
  return { resume: { ...resume, sections }, injected };
}
