import { describe, it, expect } from "vitest";
import { injectKeywords } from "./injectKeywords";
import type { ParsedResume } from "./types";

const base: ParsedResume = {
  title: "X",
  contact: [],
  preamble: [],
  sections: [{ name: "SKILLS", entries: [{ bullets: [], body: ["JavaScript, React"] }] }],
};

describe("injectKeywords", () => {
  it("adds missing single-word skills to SKILLS", () => {
    const { resume, injected } = injectKeywords(base, ["typescript", "react"]);
    expect(injected).toContain("typescript");
    expect(injected).not.toContain("react"); // already present
    expect(JSON.stringify(resume)).toContain("typescript");
  });
  it("skips multi-word phrases", () => {
    const { injected } = injectKeywords(base, ["team leadership"]);
    expect(injected).not.toContain("team leadership");
  });
  it("skips generic non-skill nouns", () => {
    const { injected } = injectKeywords(base, ["cost", "internal", "kubernetes"]);
    expect(injected).not.toContain("cost");
    expect(injected).not.toContain("internal");
    expect(injected).toContain("kubernetes");
  });
});
