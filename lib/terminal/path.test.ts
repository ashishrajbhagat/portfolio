import { describe, expect, it } from "vitest";
import { absolutePath, formatPath, resolvePath } from "./path";

describe("resolvePath", () => {
  it("resolves relative paths", () => {
    expect(resolvePath([], "projects")).toEqual(["projects"]);
    expect(resolvePath(["projects"], "..")).toEqual([]);
    expect(resolvePath(["projects"], "../certs")).toEqual(["certs"]);
  });
  it("never goes above home", () => {
    expect(resolvePath([], "..")).toEqual([]);
    expect(resolvePath([], "../../..")).toEqual([]);
  });
  it("handles ~ and absolute-looking paths", () => {
    expect(resolvePath(["projects"], "~")).toEqual([]);
    expect(resolvePath(["projects"], "~/certs")).toEqual(["certs"]);
    expect(resolvePath(["projects"], "/")).toEqual([]);
    expect(resolvePath(["projects"], "/certs")).toEqual(["certs"]);
  });
  it("ignores . and duplicate slashes", () => {
    expect(resolvePath([], "./a//b/./c")).toEqual(["a", "b", "c"]);
    expect(resolvePath([], "./a/../b")).toEqual(["b"]);
  });
});

describe("formatPath", () => {
  it("formats prompt and pwd paths", () => {
    expect(formatPath([])).toBe("~");
    expect(formatPath(["projects"])).toBe("~/projects");
    expect(absolutePath([])).toBe("/home/guest");
    expect(absolutePath(["certs"])).toBe("/home/guest/certs");
  });
});
