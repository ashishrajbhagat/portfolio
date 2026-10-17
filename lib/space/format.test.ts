import { describe, expect, it } from "vitest";
import { JOURNEY_LIGHT_YEARS, distanceLy, sectorLabel, velocityLabel } from "./format";
import { createRng, seedFromString } from "./rng";
import { detectQuality, qualitySettings } from "./quality";

describe("format", () => {
  it("scales distance across the journey", () => {
    expect(distanceLy(0, 12)).toBe("0.00 ly");
    expect(distanceLy(12, 12)).toBe(`${JOURNEY_LIGHT_YEARS.toFixed(2)} ly`);
    expect(distanceLy(6, 12)).toBe(`${(JOURNEY_LIGHT_YEARS / 2).toFixed(2)} ly`);
  });
  it("clamps distance outside the journey", () => {
    expect(distanceLy(-3, 12)).toBe("0.00 ly");
    expect(distanceLy(99, 12)).toBe(`${JOURNEY_LIGHT_YEARS.toFixed(2)} ly`);
  });
  it("caps velocity and ignores direction", () => {
    expect(velocityLabel(0)).toBe("0.0c");
    expect(velocityLabel(-1)).toBe(velocityLabel(1));
    expect(velocityLabel(100)).toBe("9.9c");
  });
  it("labels sectors from 1", () => {
    expect(sectorLabel(0, 13)).toBe("SECTOR 01 / 13");
    expect(sectorLabel(12, 13)).toBe("SECTOR 13 / 13");
  });
});

describe("rng", () => {
  it("is deterministic per seed and stays within [0, 1)", () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 50; i++) {
      const value = a();
      expect(value).toBe(b());
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
  it("gives different streams for different seeds", () => {
    expect(createRng(1)()).not.toBe(createRng(2)());
  });
  it("derives stable seeds from strings", () => {
    expect(seedFromString("udaan")).toBe(seedFromString("udaan"));
    expect(seedFromString("udaan")).not.toBe(seedFromString("gyan"));
  });
});

describe("quality", () => {
  it("uses fewer stars and a lower pixel ratio in low quality", () => {
    const low = qualitySettings("low");
    const high = qualitySettings("high");
    expect(low.starCount).toBeLessThan(high.starCount);
    expect(low.maxDpr).toBeLessThan(high.maxDpr);
    expect(low.planetSegments).toBeLessThan(high.planetSegments);
  });
  it("defaults to high quality when there is no window", () => {
    expect(detectQuality()).toBe("high");
  });
});
