// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { site } from "@/content/site";
import Portrait from "./Portrait";

afterEach(cleanup);

describe("Portrait", () => {
  it("shows the configured photo with descriptive alt text", () => {
    render(<Portrait />);
    const image = screen.getByAltText(site.avatarAlt) as HTMLImageElement;
    expect(decodeURIComponent(image.getAttribute("src") ?? "")).toContain(site.avatar);
  });

  it("passes the className to its square wrapper", () => {
    const { container } = render(<Portrait className="h-24 w-24 rounded-full" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("aspect-square");
    expect(wrapper.className).toContain("rounded-full");
  });

  it("points at a file that exists in public/ (so swapping in a real photo is a one-line change)", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    expect(existsSync(join(process.cwd(), "public", site.avatar))).toBe(true);
  });
});
