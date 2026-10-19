import { describe, expect, it } from "vitest";
import { complete } from "./complete";

const names = ["help", "projects", "profile", "skills", "cat", "cd", "ls", "theme"];

describe("complete", () => {
  it("completes a unique command name with a trailing space", () => {
    expect(complete("sk", [], names)).toEqual({ value: "skills ", matches: ["skills"] });
  });
  it("completes the shared prefix when ambiguous", () => {
    const result = complete("pro", [], names);
    expect(result?.value).toBe("pro");
    expect(result?.matches).toEqual(["projects", "profile"]);
  });
  it("returns null when nothing matches", () => {
    expect(complete("zz", [], names)).toBeNull();
  });
  it("completes directories for cd without a trailing space", () => {
    expect(complete("cd pro", [], names)?.value).toBe("cd projects/");
  });
  it("only offers directories for cd", () => {
    expect(complete("cd ab", [], names)).toBeNull();
  });
  it("completes files inside a directory for cat", () => {
    expect(complete("cat projects/ud", [], names)?.value).toBe("cat projects/udaan-library.md ");
  });
  it("completes relative to the current directory", () => {
    expect(complete("cat ud", ["projects"], names)?.value).toBe("cat udaan-library.md ");
  });
  it("completes theme names", () => {
    expect(complete("theme am", [], names)?.value).toBe("theme amber ");
  });
  it("completes project ids for the projects command", () => {
    expect(complete("projects en", [], names)?.value).toBe("projects english-daily ");
  });
});
