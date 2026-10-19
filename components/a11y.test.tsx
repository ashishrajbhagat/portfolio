// @vitest-environment jsdom
import axe from "axe-core";
import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { getProfile } from "@/content/profiles";

// Visitor with "reduce motion" on, so every theme renders its complete content without animation setup.
vi.hoisted(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion") && !query.includes("no-preference"),
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

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {}, prefetch: () => {} }) }));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/components/space/SpaceBackdrop", () => ({ default: () => null }));

import ProfileGrid from "@/components/ProfileGrid";
import MovieExperience from "@/components/movie/MovieExperience";
import SpaceExperience from "@/components/space/SpaceExperience";
import TerminalSession from "@/components/terminal/TerminalSession";
import { defaultSettings } from "@/lib/terminal/settings";

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
});

afterEach(cleanup);

/**
 * Runs axe-core against rendered markup. Rules that need a real layout engine (colour contrast, visibility of
 * off-screen regions) cannot run under jsdom, so they are left to Lighthouse in a real browser.
 */
async function violations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
    resultTypes: ["violations"],
  });
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.html.slice(0, 120)}`);
}

describe("accessibility (axe-core)", () => {
  it("home page", async () => {
    const { container } = render(<ProfileGrid />);
    expect(await violations(container)).toEqual([]);
  });

  it("Recruiter (movie) view", async () => {
    const { container } = render(<MovieExperience profile={getProfile("recruiter")!} />);
    expect(await violations(container)).toEqual([]);
  });

  it("Explorer (space) view", async () => {
    const { container } = render(<SpaceExperience profile={getProfile("explorer")!} />);
    expect(await violations(container)).toEqual([]);
  });

  it("Developer (terminal) session", async () => {
    const { container } = render(
      <TerminalSession settings={defaultSettings} onSettingsChange={() => {}} onExit={() => {}} onReboot={() => {}} onPlain={() => {}} />
    );
    expect(await violations(container)).toEqual([]);
  });
});
