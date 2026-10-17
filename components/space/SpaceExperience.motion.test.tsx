// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { getProfile } from "@/content/profiles";
import { sectionOrder } from "@/content/types";
import { distanceLy } from "@/lib/space/format";
import { applyEndBlend, computeSceneT, referenceLine } from "@/lib/space/scene-progress";
import { space } from "@/lib/space/store";

// Motion allowed: the scroll-linked flight is live.
vi.hoisted(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("./SpaceBackdrop", () => ({ default: () => null }));

import SpaceExperience from "./SpaceExperience";

const SECTION_HEIGHT = 100;
const SCROLL_Y = 250;
const PAGE_HEIGHT = sectionOrder.length * SECTION_HEIGHT;

beforeAll(() => {
  class Noop {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  (window as unknown as Record<string, unknown>).IntersectionObserver = Noop;

  // Lay the sections out as a simple stack so the scroll maths can be checked against known numbers.
  Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
    const index = sectionOrder.indexOf(this.id as (typeof sectionOrder)[number]);
    const top = index === -1 ? 5000 : index * SECTION_HEIGHT - window.scrollY;
    return { top, bottom: top + SECTION_HEIGHT, left: 0, right: 0, width: 0, height: SECTION_HEIGHT, x: 0, y: top, toJSON: () => ({}) };
  };
  Object.defineProperty(document.documentElement, "scrollHeight", { value: PAGE_HEIGHT, configurable: true });
  Object.defineProperty(window, "scrollY", { value: SCROLL_Y, writable: true, configurable: true });
});

afterEach(() => {
  cleanup();
  space.t = 0;
  space.velocity = 0;
});

describe("SpaceExperience (motion on)", () => {
  it("turns page scroll into a scene position and drives the telemetry", async () => {
    render(<SpaceExperience profile={getProfile("explorer")!} />);

    // Work out where the scroll position should put us, using the same stacked layout the test sets up.
    const lastIndex = sectionOrder.length - 1;
    const pageProgress = SCROLL_Y / (PAGE_HEIGHT - window.innerHeight);
    const rects = sectionOrder.map((_, i) => ({ top: i * SECTION_HEIGHT - SCROLL_Y, height: SECTION_HEIGHT }));
    const expectedT = applyEndBlend(computeSceneT(rects, referenceLine(window.innerHeight, pageProgress)), lastIndex, pageProgress);
    expect(expectedT).toBeGreaterThan(1); // the scroll position really is part-way down the page

    await waitFor(() => expect(space.t).toBeGreaterThan(expectedT - 0.2), { timeout: 2000 });
    expect(space.t).toBeCloseTo(expectedT, 1);

    // The HUD shows the matching distance (anything but the starting 0.00 ly).
    const hud = screen.getByRole("complementary", { name: "Flight telemetry" });
    await waitFor(() => expect(hud.textContent).toContain(`DIST ${distanceLy(space.t, lastIndex)}`), { timeout: 2000 });
    expect(hud.textContent).not.toContain("DIST 0.00 ly");
  });

  it("resets the journey when leaving the page", () => {
    const { unmount } = render(<SpaceExperience profile={getProfile("explorer")!} />);
    space.focusId = "udaan-library";
    unmount();
    expect(space.t).toBe(0);
    expect(space.focusId).toBeNull();
  });
});
