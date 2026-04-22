const STOPWORDS = new Set(
  "a an and or but if then so of in on at to for from by with as is are was were be been being have has had do does did will would shall should can could may might must not no nor this that these those the we you your our their i he she it they them his her its they who whom whose which what where when why how all any both each few more most other some such only own same than too very s t just about up down over under into through during before after above below between within without across against among throughout upon off out we're we've they're they've it's you're you've i'm i've also use used using".split(
    /\s+/
  )
);

const COMMON_ATS = new Set(
  "experience skills work projects leadership management communication collaboration agile scrum api cloud aws azure gcp docker kubernetes python java javascript typescript react node sql nosql postgres mysql rest graphql ci cd tests testing deployment backend frontend fullstack design product analytics data etl ml ai nlp security architecture scalability performance".split(
    /\s+/
  )
);

export function extractKeywords(jd: string): string[] {
  if (!jd) return [];
  const text = jd.toLowerCase().replace(/[^a-z0-9+.#\s-]/g, " ");
  const words = text.split(/\s+/).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w)
  );

  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // 2-grams
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (!STOPWORDS.has(a) && !STOPWORDS.has(b) && a.length > 2 && b.length > 2) {
      const bg = a + " " + b;
      freq[bg] = (freq[bg] || 0) + 1.2;
    }
  }

  const raw = Object.entries(freq)
    .map(([term, count]) => {
      let score = count;
      if (COMMON_ATS.has(term)) score += 2;
      if (term.includes(" ")) score += 1;
      return { term, score };
    })
    .sort((a, b) => b.score - a.score);

  const kept: { term: string; score: number }[] = [];
  for (const k of raw) {
    const dup = kept.some((x) => x.term.includes(k.term) && x.term !== k.term);
    if (!dup && k.score >= 1.5) kept.push(k);
    if (kept.length >= 30) break;
  }
  return kept.map((x) => x.term);
}

export interface MatchResult {
  pct: number;
  matched: string[];
  missing: string[];
}

export function scoreMatch(resume: string, keywords: string[]): MatchResult {
  if (!resume || keywords.length === 0)
    return { pct: 0, matched: [], missing: keywords };
  const r = resume.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  keywords.forEach((k) => {
    if (r.includes(k.toLowerCase())) matched.push(k);
    else missing.push(k);
  });
  const pct = Math.round((matched.length / keywords.length) * 100);
  return { pct, matched, missing };
}
