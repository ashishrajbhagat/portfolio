import { describe, expect, it } from "vitest";
import { closest, commonPrefix, levenshtein } from "./suggest";

describe("levenshtein", () => {
  it("computes edit distance", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("same", "same")).toBe(0);
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
  });
});

describe("closest", () => {
  const commands = ["projects", "skills", "experience", "contact"];
  it("suggests a near match", () => {
    expect(closest("projcts", commands)).toBe("projects");
    expect(closest("skils", commands)).toBe("skills");
  });
  it("is case-insensitive", () => {
    expect(closest("SKILLS", commands)).toBe("skills");
  });
  it("returns null when nothing is close", () => {
    expect(closest("zzzzzzzz", commands)).toBeNull();
  });
});

describe("commonPrefix", () => {
  it("finds the shared prefix", () => {
    expect(commonPrefix(["projects", "profile"])).toBe("pro");
    expect(commonPrefix(["abc"])).toBe("abc");
    expect(commonPrefix(["abc", "xyz"])).toBe("");
    expect(commonPrefix([])).toBe("");
  });
});
