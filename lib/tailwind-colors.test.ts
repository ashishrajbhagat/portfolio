import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import { describe, expect, it } from "vitest";
import config from "../tailwind.config";

const root = process.cwd();

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

const sources = ["app", "components", "content"].flatMap((dir) => sourceFiles(join(root, dir)));
const text = sources.map((file) => readFileSync(file, "utf8")).join("\n");

/** Every utility like `bg-m-fg/40` or `border-s-cyan/[0.3]` found in the source. */
const opacityClasses = [
  ...new Set(
    text.match(/(?:[a-z-]+:)*(?:bg|text|border|ring|from|to|via|shadow|fill|stroke)-(?:m|s)-[a-z]+\/(?:\[[\d.]+\]|\d+)/g) ?? []
  ),
];

const escape = (cls: string) => cls.replace(/[/[\].:]/g, (c) => `\\${c}`);

describe("Tailwind colours with opacity modifiers", () => {
  it("are actually generated (a CSS-variable colour without channels silently drops them)", async () => {
    expect(opacityClasses.length).toBeGreaterThan(5);
    const result = await postcss([tailwindcss({ ...config, content: [{ raw: opacityClasses.join(" ") }] })]).process(
      "@tailwind utilities;",
      { from: undefined }
    );
    const missing = opacityClasses.filter((cls) => !result.css.includes(`.${escape(cls)}`));
    expect(missing).toEqual([]);
  });
});

describe("colour channel variables", () => {
  const css = readFileSync(join(root, "app/globals.css"), "utf8");

  const hexToChannels = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");

  for (const prefix of ["m", "s"]) {
    it(`--${prefix}-*-rgb match the hex values they mirror`, () => {
      const pairs = [...css.matchAll(new RegExp(`--${prefix}-([a-z]+): (#[0-9a-fA-F]{6});`, "g"))];
      expect(pairs.length).toBeGreaterThan(4);
      for (const [, name, hex] of pairs) {
        const channels = css.match(new RegExp(`--${prefix}-${name}-rgb: ([0-9 ]+);`));
        if (!channels) continue; // only colours exposed to Tailwind have a channel twin
        expect(channels[1], `--${prefix}-${name}`).toBe(hexToChannels(hex));
      }
    });
  }
});
