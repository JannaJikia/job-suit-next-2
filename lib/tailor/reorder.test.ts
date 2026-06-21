import { describe, it, expect } from "vitest";
import { reorder } from "./reorder";
import type { ParsedResume } from "./types";

const make = (bullets: string[]): ParsedResume => ({
  title: "X",
  contact: [],
  preamble: [],
  sections: [{ name: "EXPERIENCE", entries: [{ header: "Co", bullets, body: [] }] }],
});

describe("reorder", () => {
  it("moves relevant bullets up", () => {
    const r = make(["Did gardening", "Built React apps"]);
    const { resume, reordered } = reorder(r, ["react"]);
    expect(resume.sections[0].entries[0].bullets[0]).toContain("React");
    expect(reordered).toBeGreaterThan(0);
  });
  it("is stable when no keywords match", () => {
    const r = make(["A", "B"]);
    const { resume, reordered } = reorder(r, ["zzz"]);
    expect(resume.sections[0].entries[0].bullets).toEqual(["A", "B"]);
    expect(reordered).toBe(0);
  });
});
