import { describe, it, expect } from "vitest";
import { createBm25Scorer, countOccurrences, tokenCount } from "./score";

const single = (text: string, keywords: string[]) => createBm25Scorer([text]).score(text, keywords);

describe("single-document scoring", () => {
  it("scores keyword overlap", () => {
    const kw = ["react", "node.js", "team leadership"];
    expect(single("Built React apps", kw)).toBeGreaterThan(0);
  });
  it("is zero for no overlap", () => {
    expect(single("gardening", ["react"])).toBe(0);
  });
  it("matches multi-word phrases", () => {
    expect(single("Owned team leadership across squads", ["team leadership"])).toBeGreaterThan(0);
  });
});

describe("countOccurrences", () => {
  it("respects token boundaries", () => {
    expect(countOccurrences("javascript everywhere", "java")).toBe(0);
    expect(countOccurrences("java and scala", "java")).toBe(1);
  });
  it("counts repeats", () => {
    expect(countOccurrences("react react react", "react")).toBe(3);
  });
});

describe("createBm25Scorer", () => {
  it("weights rarer keywords higher than common ones (IDF)", () => {
    // "react" appears in every bullet (common), "kubernetes" in only one (rare).
    const corpus = ["react app", "react ui", "react kubernetes"];
    const scorer = createBm25Scorer(corpus);
    const common = scorer.score("react kubernetes", ["react"]);
    const rare = scorer.score("react kubernetes", ["kubernetes"]);
    expect(rare).toBeGreaterThan(common);
  });

  it("penalizes longer documents for the same match (length normalization)", () => {
    const corpus = ["short react bullet", "a much longer bullet that mentions react once among many other filler words here"];
    const scorer = createBm25Scorer(corpus);
    const short = scorer.score(corpus[0], ["react"]);
    const long = scorer.score(corpus[1], ["react"]);
    expect(short).toBeGreaterThan(long);
  });

  it("tokenCount counts word-like tokens", () => {
    expect(tokenCount("built c++ and node.js apps")).toBe(5);
  });
});
