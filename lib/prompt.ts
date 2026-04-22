export interface PromptInput {
  resume: string;
  jd: string;
  keywords: string[];
  tone: string;
  pages: string;
}

export function buildPrompt({ resume, jd, keywords, tone, pages }: PromptInput): string {
  return `You are an expert resume writer who specializes in tailoring resumes to pass Applicant Tracking Systems (ATS) and land interviews.

TASK
Rewrite the candidate's resume below so it is optimized for the target job description. Your output must:

1. Use a clean, ATS-friendly plain-text format (no tables, columns, images, icons, or special characters). Use standard section headers: SUMMARY, EXPERIENCE, SKILLS, EDUCATION, PROJECTS, CERTIFICATIONS (include only the sections that apply).
2. Naturally incorporate the high-value keywords from the job description — especially: ${keywords.slice(0, 20).join(", ")}. Never stuff keywords; they must appear in context and only where truthful.
3. Rewrite bullet points in the STAR pattern (action verb + what you did + quantified impact). Start each bullet with a strong past-tense verb. Include metrics where the original resume suggests them; do not fabricate numbers.
4. Reorder experience/skills so the most job-relevant items appear first.
5. Preserve ALL factual content — companies, titles, dates, degrees, names. Do not invent employers, titles, dates, credentials, or achievements.
6. Target length: ${pages}. Tone: ${tone}.
7. Output ONLY the finished resume as plain text. No commentary, no markdown code fences, no preamble, no explanation.

JOB DESCRIPTION
"""
${jd}
"""

CANDIDATE'S CURRENT RESUME
"""
${resume}
"""

Now output the tailored ATS-ready resume:`;
}
