import { describe, it, expect } from "vitest";
import { parseResume } from "./parseResume";
import { serialize } from "./serialize";

const SAMPLE = `Jane Doe
jane@example.com | (555) 123-4567

SUMMARY
Engineer with 5 years building web apps.

EXPERIENCE
Acme Corp — Senior Engineer (2020–2024)
- Built a React dashboard used by 2,000 users
- Improved API latency

SKILLS
JavaScript, React, Node.js`;

describe("parseResume", () => {
  it("captures title and contact", () => {
    const r = parseResume(SAMPLE);
    expect(r.title).toBe("Jane Doe");
    expect(r.contact.join(" ")).toContain("jane@example.com");
  });
  it("captures sections and bullets", () => {
    const r = parseResume(SAMPLE);
    const exp = r.sections.find((s) => /EXPERIENCE/i.test(s.name));
    expect(exp?.entries[0].header).toContain("Acme Corp");
    expect(exp?.entries[0].bullets).toHaveLength(2);
  });
  it("round-trips without losing facts", () => {
    const out = serialize(parseResume(SAMPLE));
    expect(out).toContain("Acme Corp");
    expect(out).toContain("2,000 users");
    expect(out).toContain("JavaScript");
  });
});
