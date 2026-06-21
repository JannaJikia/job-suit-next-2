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
    if (ln.kind === "title") {
      resume.title = ln.text;
      continue;
    }
    if (ln.kind === "section") {
      pushEntry();
      section = { name: ln.text.replace(/:\s*$/, ""), entries: [] };
      resume.sections.push(section);
      sawSection = true;
      continue;
    }
    if (ln.kind === "blank") {
      if (section) pushEntry();
      continue;
    }
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
    } else {
      // body line: a new entry header if no bullets yet, else body
      if (entry && entry.bullets.length) pushEntry();
      if (!entry) entry = { header: ln.text, bullets: [], body: [] };
      else if (!entry.header) entry.header = ln.text;
      else entry.body.push(ln.text);
    }
  }
  pushEntry();
  return resume;
}
