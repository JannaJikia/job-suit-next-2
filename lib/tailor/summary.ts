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
