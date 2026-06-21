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
