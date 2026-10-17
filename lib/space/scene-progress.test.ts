import { describe, expect, it } from "vitest";
import { applyEndBlend, computeSceneT, referenceLine } from "./scene-progress";

// Three sections of 100px each, stacked from the top of the page.
const stack = (offset: number) => [0, 1, 2].map((i) => ({ top: i * 100 + offset, height: 100 }));

describe("computeSceneT", () => {
  it("returns 0 for no sections", () => {
    expect(computeSceneT([], 50)).toBe(0);
  });
  it("reports the fraction through the section under the reference line", () => {
    expect(computeSceneT(stack(0), 50)).toBeCloseTo(0.5);
    expect(computeSceneT(stack(0), 150)).toBeCloseTo(1.5);
    expect(computeSceneT(stack(0), 199)).toBeCloseTo(1.99);
  });
  it("parks on the final waypoint while inside the last section", () => {
    expect(computeSceneT(stack(0), 275)).toBe(2);
  });
  it("clamps before the first and after the last section", () => {
    expect(computeSceneT(stack(500), 50)).toBe(0);
    expect(computeSceneT(stack(-1000), 50)).toBe(2);
  });
  it("treats a gap as the end of the previous section", () => {
    const rects = [
      { top: 0, height: 100 },
      { top: 200, height: 100 },
    ];
    expect(computeSceneT(rects, 150)).toBe(1);
  });
  it("copes with zero-height sections", () => {
    expect(computeSceneT([{ top: 0, height: 0 }, { top: 10, height: 50 }], 5)).toBe(0);
  });
});

describe("referenceLine", () => {
  it("drifts from 30% to 70% of the viewport", () => {
    expect(referenceLine(1000, 0)).toBeCloseTo(300);
    expect(referenceLine(1000, 0.5)).toBeCloseTo(500);
    expect(referenceLine(1000, 1)).toBeCloseTo(700);
    expect(referenceLine(1000, 5)).toBeCloseTo(700);
  });
});

describe("applyEndBlend", () => {
  it("leaves the journey alone until the last few percent of the page", () => {
    expect(applyEndBlend(4.2, 12, 0.5)).toBe(4.2);
    expect(applyEndBlend(4.2, 12, 0.97)).toBe(4.2);
  });
  it("lands exactly on the last scene at the bottom of the page", () => {
    expect(applyEndBlend(11.4, 12, 1)).toBe(12);
  });
  it("blends in between", () => {
    const blended = applyEndBlend(10, 12, 0.985);
    expect(blended).toBeGreaterThan(10);
    expect(blended).toBeLessThan(12);
  });
});
