import { describe, it, expect } from "vitest";
import { scoreText } from "./score";

describe("scoreText", () => {
  it("scores keyword overlap", () => {
    const kw = ["react", "node.js", "team leadership"];
    expect(scoreText("Built React apps", kw)).toBeGreaterThan(0);
  });
  it("weights multi-word matches higher than single", () => {
    const single = scoreText("react", ["react"]);
    const multi = scoreText("team leadership", ["team leadership"]);
    expect(multi).toBeGreaterThan(single);
  });
  it("is zero for no overlap", () => {
    expect(scoreText("gardening", ["react"])).toBe(0);
  });
});
