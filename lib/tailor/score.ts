export function scoreText(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const haystack = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    const k = kw.toLowerCase();
    if (haystack.includes(k)) score += 1 + k.split(/\s+/).length * 0.5;
  }
  return score;
}
