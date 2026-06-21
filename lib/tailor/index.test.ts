import { describe, it, expect } from "vitest";
import { tailorResume } from "./index";

const RESUME = `Jane Doe
jane@example.com

EXPERIENCE
Acme Corp — Engineer (2020–2024)
- Responsible for managing a team of 4
- Did gardening tasks

SKILLS
JavaScript`;

const JD = `Senior React Engineer
We need React, TypeScript, and team leadership.`;

describe("tailorResume", () => {
  it("preserves facts (company, dates)", () => {
    const { tailored } = tailorResume({ resume: RESUME, jd: JD });
    expect(tailored).toContain("Acme Corp");
    expect(tailored).toContain("2020–2024");
  });
  it("does not lower the match score", () => {
    const { report } = tailorResume({ resume: RESUME, jd: JD });
    expect(report.matchAfter).toBeGreaterThanOrEqual(report.matchBefore);
  });
  it("reports strengthened bullets and injected keywords", () => {
    const { report } = tailorResume({ resume: RESUME, jd: JD });
    expect(report.strengthenedBullets).toBeGreaterThan(0);
    expect(report.injectedKeywords).toContain("typescript");
  });
  it("never invents numbers", () => {
    const { tailored } = tailorResume({ resume: RESUME, jd: JD });
    const digits = tailored.match(/\d+/g) || [];
    expect(digits.every((d) => RESUME.includes(d) || JD.includes(d))).toBe(true);
  });
});
