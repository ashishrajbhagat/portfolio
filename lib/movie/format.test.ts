import { describe, expect, it } from "vitest";
import { formatStat, pad2, parseStat, posterStatus } from "./format";

describe("parseStat", () => {
  it("parses plain numbers with suffixes", () => {
    expect(parseStat("6+")).toEqual({ prefix: "", value: 6, decimals: 0, suffix: "+" });
    expect(parseStat("100%")).toEqual({ prefix: "", value: 100, decimals: 0, suffix: "%" });
  });
  it("keeps decimals and trailing text", () => {
    expect(parseStat("8.6 / 10")).toEqual({ prefix: "", value: 8.6, decimals: 1, suffix: " / 10" });
  });
  it("keeps a prefix", () => {
    expect(parseStat("~500+")).toEqual({ prefix: "~", value: 500, decimals: 0, suffix: "+" });
  });
  it("returns null when there is no number", () => {
    expect(parseStat("many")).toBeNull();
  });
});

describe("formatStat", () => {
  it("rebuilds the string for an intermediate value", () => {
    const stat = parseStat("8.6 / 10")!;
    expect(formatStat(stat, 4.3)).toBe("4.3 / 10");
    expect(formatStat(parseStat("6+")!, 3.2)).toBe("3+");
  });
});

describe("helpers", () => {
  it("pads numbers", () => {
    expect(pad2(3)).toBe("03");
    expect(pad2(12)).toBe("12");
  });
  it("maps project status to poster wording", () => {
    expect(posterStatus("Live")).toBe("Now Playing");
    expect(posterStatus("In progress")).toBe("In Production");
    expect(posterStatus("Prototype")).toBe("Coming Soon");
  });
});
