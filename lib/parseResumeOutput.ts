/** Shared plain-text resume layout rules for .docx / PDF export. */

export const SECTION_HEADING_RE =
  /^(SUMMARY|EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|SKILLS|TECHNICAL SKILLS|EDUCATION|PROJECTS|CERTIFICATIONS|AWARDS|PUBLICATIONS|LANGUAGES)\s*:?\s*$/i;

/**
 * Matches a leading bullet marker (many glyphs, with or without a following
 * space) so bullets from any resume style are recognized, e.g. "- ", "• ",
 * "•Led", "· ", "▪", "–". The lookahead requires real content after the marker
 * so a lone dash separator line is not treated as an empty bullet.
 */
export const BULLET_RE = /^\s*[-*•·‣▪◦‧∙●○➤▸►◆»–—]\s*(?=\S)/;

export type ParsedResumeLine =
  | { kind: "blank" }
  | { kind: "title"; text: string }
  | { kind: "section"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "body"; text: string };

export function parseResumeOutputLines(output: string): ParsedResumeLine[] {
  const lines = output.split(/\r?\n/);
  const out: ParsedResumeLine[] = [];
  let firstNonEmpty = true;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === "") {
      out.push({ kind: "blank" });
      continue;
    }
    if (firstNonEmpty) {
      out.push({ kind: "title", text: line });
      firstNonEmpty = false;
      continue;
    }
    const trimmed = line.trim();
    if (SECTION_HEADING_RE.test(trimmed)) {
      out.push({ kind: "section", text: trimmed });
      continue;
    }
    if (BULLET_RE.test(line)) {
      out.push({ kind: "bullet", text: line.replace(BULLET_RE, "") });
      continue;
    }
    out.push({ kind: "body", text: line });
  }
  return out;
}
