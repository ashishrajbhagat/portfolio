import { describe, expect, it } from "vitest";
import { defaultSettings, parseSettings } from "./settings";

describe("parseSettings", () => {
  it("returns defaults for missing or invalid input", () => {
    expect(parseSettings(null)).toEqual(defaultSettings);
    expect(parseSettings("not json")).toEqual(defaultSettings);
    expect(parseSettings("42")).toEqual(defaultSettings);
    expect(parseSettings("null")).toEqual(defaultSettings);
  });
  it("defaults to the colourful neon theme", () => {
    expect(defaultSettings.theme).toBe("neon");
  });
  it("still accepts previously saved themes", () => {
    expect(parseSettings('{"theme":"green","crt":true}').theme).toBe("green");
  });
  it("accepts valid values", () => {
    expect(parseSettings('{"theme":"amber","crt":false}')).toEqual({ theme: "amber", crt: false });
  });
  it("falls back per field", () => {
    expect(parseSettings('{"theme":"pink","crt":"yes"}')).toEqual(defaultSettings);
    expect(parseSettings('{"theme":"ice"}')).toEqual({ theme: "ice", crt: defaultSettings.crt });
  });
});
