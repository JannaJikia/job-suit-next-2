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
