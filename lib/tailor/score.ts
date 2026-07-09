/**
 * BM25 relevance scoring for ranking resume bullets against job-description
 * keywords. BM25 improves on a plain keyword count in two ways:
 *   - IDF weighting: a keyword that appears in almost every bullet is less
 *     discriminating than a rare one, so it contributes less to the score.
 *   - Length normalization: a short, focused bullet is not out-competed by a
 *     long one simply because the long one has more words to match.
 * The scorer is deterministic and runs entirely offline — no AI, no network.
 */

const TOKEN_RE = /[a-z0-9+#.]+/gi;

/** Number of word-like tokens in a piece of text (document length). */
export function tokenCount(text: string): number {
  const m = text.match(TOKEN_RE);
  return m ? m.length : 0;
}

function isAlnum(code: number): boolean {
  return (
    (code >= 48 && code <= 57) || // 0-9
    (code >= 97 && code <= 122) || // a-z
    (code >= 65 && code <= 90) // A-Z
  );
}

/**
 * Count whole-token occurrences of `term` in `text` (case-insensitive).
 * Boundaries are non-alphanumeric characters, so "java" does not match inside
 * "javascript", while multi-word phrases like "team leadership" still match.
 *
 * Implemented with a plain indexOf scan rather than a lookbehind regex, which
 * throws a SyntaxError on WebKit before Safari 16.4 — and it avoids compiling a
 * regex on every call in the hot reorder loop.
 */
export function countOccurrences(text: string, term: string): number {
  const t = term.trim().toLowerCase();
  if (!t) return 0;
  const hay = text.toLowerCase();
  let count = 0;
  let from = 0;
  let idx: number;
  while ((idx = hay.indexOf(t, from)) !== -1) {
    const end = idx + t.length;
    const beforeOk = idx === 0 || !isAlnum(hay.charCodeAt(idx - 1));
    const afterOk = end >= hay.length || !isAlnum(hay.charCodeAt(end));
    if (beforeOk && afterOk) {
      count++;
      from = end;
    } else {
      from = idx + 1;
    }
  }
  return count;
}

export interface Bm25Options {
  /** Term-frequency saturation. Higher = repeated terms keep adding value. */
  k1?: number;
  /** Length-normalization strength (0 = off, 1 = full). */
  b?: number;
}

export interface Bm25Scorer {
  /** Relevance of a single document text to the given query keywords. */
  score(text: string, keywords: string[]): number;
}

/**
 * Build a BM25 scorer over a corpus of documents (e.g. all resume bullets).
 * IDF and average document length are computed once from the corpus, then
 * reused when scoring each document.
 */
export function createBm25Scorer(corpus: string[], opts: Bm25Options = {}): Bm25Scorer {
  const k1 = opts.k1 ?? 1.5;
  const b = opts.b ?? 0.75;

  const docs = corpus.map((d) => (d || "").toLowerCase());
  const N = docs.length || 1;
  const avgdl = docs.length
    ? docs.reduce((sum, d) => sum + tokenCount(d), 0) / docs.length || 1
    : 1;

  const dfCache = new Map<string, number>();
  const df = (term: string): number => {
    const cached = dfCache.get(term);
    if (cached !== undefined) return cached;
    let count = 0;
    for (const d of docs) if (countOccurrences(d, term) > 0) count++;
    dfCache.set(term, count);
    return count;
  };

  // BM25 IDF with +1 smoothing so terms present in every document still score
  // positively (the classic form can go slightly negative for such terms).
  const idf = (term: string): number => {
    const n = df(term);
    return Math.log(1 + (N - n + 0.5) / (n + 0.5));
  };

  return {
    score(text: string, keywords: string[]): number {
      if (!text || keywords.length === 0) return 0;
      const doc = text.toLowerCase();
      const dl = tokenCount(doc) || 1;
      let total = 0;
      for (const kw of keywords) {
        const term = kw.toLowerCase();
        const f = countOccurrences(doc, term);
        if (f === 0) continue;
        const denom = f + k1 * (1 - b + (b * dl) / avgdl);
        total += idf(term) * ((f * (k1 + 1)) / denom);
      }
      return total;
    },
  };
}
