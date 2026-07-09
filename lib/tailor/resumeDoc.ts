import { parseResume } from "./parseResume";
import type { Section } from "./types";

/** Separator between contact fields on the single centered contact line. */
export const CONTACT_SEPARATOR = "  ·  ";

export interface ResumeDoc {
  title: string;
  /** Contact fields joined onto one line ("" when there is no contact info). */
  contactLine: string;
  /** Intro/objective lines before the first section, each rendered on its own line. */
  intro: string[];
  sections: Section[];
}

/**
 * Normalize tailored resume text into the shape every renderer (on-screen
 * preview, .docx, PDF) consumes, so the contact line and intro are laid out
 * identically everywhere. Contact fields collapse to one centered line; the
 * intro block keeps its separate lines instead of being mashed together.
 */
export function toResumeDoc(output: string): ResumeDoc {
  const parsed = parseResume(output);
  return {
    title: parsed.title,
    contactLine: parsed.contact.join(CONTACT_SEPARATOR),
    intro: parsed.preamble,
    sections: parsed.sections,
  };
}
