import { describe, it, expect } from "vitest";
import { strengthenBullet } from "./strengthen";

describe("strengthenBullet", () => {
  it("replaces weak lead verbs with strong ones", () => {
    const { text, changed } = strengthenBullet("Responsible for managing the team");
    expect(text.toLowerCase().startsWith("led")).toBe(true);
    expect(changed).toBe(true);
  });
  it("capitalizes and keeps strong verbs", () => {
    const { text, changed } = strengthenBullet("built a dashboard");
    expect(text).toBe("Built a dashboard");
    expect(changed).toBe(true);
  });
  it("never invents numbers", () => {
    const { text } = strengthenBullet("Improved performance");
    expect(/\d/.test(text)).toBe(false);
  });
});
