import type { ParsedResume } from "./types";

// Boilerplate headers that commonly appear at the top of a job post but are
// not the role title itself.
const BOILERPLATE =
  /^(about|overview|job description|the company|who we are|responsibilities|requirements|summary|company|description|role overview)\b/i;

// Words that signal a line is an actual role title.
const ROLE_WORDS =
  /\b(engineer|developer|designer|manager|lead|director|analyst|scientist|architect|consultant|specialist|administrator|officer|coordinator|intern|head of|product|marketing|sales|recruiter|writer|researcher)\b/i;

export function extractRoleTitle(jd: string): string {
  const lines = jd
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Prefer a short, title-like line that names a role and isn't boilerplate.
  for (const line of lines.slice(0, 8)) {
    if (line.length > 70 || BOILERPLATE.test(line)) continue;
    // Trim a trailing description after a colon ("Engineer: join us"), but keep
    // periods so abbreviated titles like "Sr. Software Engineer" survive.
    if (ROLE_WORDS.test(line)) return line.replace(/:.*$/, "").trim();
  }
  return "this role";
}

export function buildSummary(resume: ParsedResume, jd: string, keywords: string[]): string {
  const role = extractRoleTitle(jd);
  const hay = JSON.stringify(resume).toLowerCase();
  const present = keywords.filter((k) => hay.includes(k.toLowerCase())).slice(0, 4);
  const skillList = present.length ? present.join(", ") : "relevant skills";
  return `Results-driven professional targeting ${role}, with proven strengths in ${skillList}.`;
}
