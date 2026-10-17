import { describe, expect, it } from "vitest";
import { tokenize } from "./parse";

describe("tokenize", () => {
  it("splits on whitespace", () => {
    expect(tokenize("cat   about.md")).toEqual(["cat", "about.md"]);
  });
  it("returns nothing for blank input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
  });
  it("keeps quoted text together", () => {
    expect(tokenize('echo "hello world"')).toEqual(["echo", "hello world"]);
    expect(tokenize("echo 'a  b' c")).toEqual(["echo", "a  b", "c"]);
  });
  it("keeps an empty quoted argument", () => {
    expect(tokenize("echo ''")).toEqual(["echo", ""]);
  });
  it("treats an unterminated quote as running to the end", () => {
    expect(tokenize('echo "oops no end')).toEqual(["echo", "oops no end"]);
  });
});
