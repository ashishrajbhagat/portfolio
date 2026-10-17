import { describe, expect, it } from "vitest";
import { sectionOrder } from "@/content/types";
import {
  LAST_INDEX, SCENE_SPACING, SECTION_COUNT, getCurve, placeAt, pointAt, sceneIndex, tangentAt, waypointPositions,
} from "./waypoints";

describe("flight path", () => {
  it("has one waypoint per section, flying away from the origin", () => {
    const points = waypointPositions();
    expect(points).toHaveLength(SECTION_COUNT);
    expect(SECTION_COUNT).toBe(sectionOrder.length);
    points.forEach((p, i) => expect(p.z).toBeCloseTo(-i * SCENE_SPACING));
  });

  it("passes exactly through each waypoint at integer scene positions", () => {
    waypointPositions().forEach((expected, i) => {
      const actual = pointAt(i);
      expect(actual.distanceTo(expected)).toBeLessThan(1e-6);
    });
  });

  it("clamps outside the journey", () => {
    expect(pointAt(-5).distanceTo(pointAt(0))).toBeLessThan(1e-9);
    expect(pointAt(99).distanceTo(pointAt(LAST_INDEX))).toBeLessThan(1e-9);
  });

  it("always heads forward (down the negative z axis)", () => {
    for (let t = 0; t <= LAST_INDEX; t += 0.25) expect(tangentAt(t).z).toBeLessThan(0);
  });

  it("keeps the curve stable between calls", () => {
    expect(getCurve()).toBe(getCurve());
  });
});

describe("placeAt", () => {
  it("offsets sideways by the requested distance", () => {
    const base = pointAt(3);
    const placed = placeAt(3, 8, 0);
    expect(placed.distanceTo(base)).toBeCloseTo(8, 5);
  });

  it("puts positive `right` on the camera's right-hand side (+x while flying down -z)", () => {
    expect(placeAt(0, 10, 0).x).toBeGreaterThan(pointAt(0).x);
    expect(placeAt(0, -10, 0).x).toBeLessThan(pointAt(0).x);
  });

  it("applies the vertical offset", () => {
    expect(placeAt(2, 0, 4).y - pointAt(2).y).toBeCloseTo(4, 5);
  });

  it("moves further along the path with `ahead`", () => {
    const base = placeAt(5, 0, 0);
    const ahead = placeAt(5, 0, 0, 20);
    expect(ahead.distanceTo(base)).toBeCloseTo(20, 5);
    expect(ahead.z).toBeLessThan(base.z);
  });

  it("finds a scene index by section id", () => {
    expect(sceneIndex("hero")).toBe(0);
    expect(sceneIndex("credits")).toBe(LAST_INDEX);
  });
});
