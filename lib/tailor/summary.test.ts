import { describe, it, expect } from "vitest";
import { buildSummary, extractRoleTitle } from "./summary";
import type { ParsedResume } from "./types";

const resume: ParsedResume = {
  title: "Jane",
  contact: [],
  preamble: [],
  sections: [{ name: "SKILLS", entries: [{ bullets: [], body: ["React, Node.js, AWS"] }] }],
};

describe("summary", () => {
  it("extracts a role title", () => {
    expect(extractRoleTitle("Senior Frontend Engineer\nWe are hiring...")).toMatch(/Engineer/i);
  });
  it("builds a summary from present skills only", () => {
    const s = buildSummary(resume, "Senior Frontend Engineer", ["react", "aws", "kotlin"]);
    expect(s.toLowerCase()).toContain("react");
    expect(s.toLowerCase()).not.toContain("kotlin"); // not in resume
  });
});
