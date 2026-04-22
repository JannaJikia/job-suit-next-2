export function scoreHintText(keywordCount: number, pct: number): string {
  if (keywordCount === 0) return "Paste a job description to see matched keywords.";
  if (pct >= 80) return "Excellent match — your resume is well-aligned to this job.";
  if (pct >= 60) return "Good match — a few keywords could still be strengthened.";
  if (pct >= 40) return "Moderate match — weave in more of the missing keywords.";
  return "Low match — generate a tailored resume to improve your score.";
}
