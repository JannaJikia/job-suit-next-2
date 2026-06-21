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
  it("skips boilerplate headers and finds the real role line", () => {
    const jd = "About the job\nAbout The Company\nWe need a Backend Developer to join us.";
    expect(extractRoleTitle(jd)).toMatch(/Backend Developer/i);
  });
  it("falls back to a generic phrase when no role line exists", () => {
    expect(extractRoleTitle("About the job\nModels are what they eat.")).toBe("this role");
  });
  it("keeps periods in abbreviated titles but trims after a colon", () => {
    expect(extractRoleTitle("Sr. Software Engineer: apply now")).toBe("Sr. Software Engineer");
  });
  it("builds a summary from present skills only", () => {
    const s = buildSummary(resume, "Senior Frontend Engineer", ["react", "aws", "kotlin"]);
    expect(s.toLowerCase()).toContain("react");
    expect(s.toLowerCase()).not.toContain("kotlin"); // not in resume
  });
});
