import { describe, expect, it } from "vitest";
import { sectionOrder } from "@/content/types";
import { sceneCount, sceneLabels, scenes } from "./scenes";

describe("scenes", () => {
  it("has a label for every section", () => {
    for (const id of sectionOrder) expect(sceneLabels[id].length).toBeGreaterThan(0);
  });
  it("numbers scenes from 1 in section order", () => {
    expect(scenes.map((s) => s.id)).toEqual([...sectionOrder]);
    expect(scenes[0].number).toBe(1);
    expect(scenes[scenes.length - 1].number).toBe(sceneCount);
  });
});
