// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { getProfile } from "@/content/profiles";
import { INTRO_SESSION_KEY } from "@/lib/movie/storage-keys";
import MovieExperience from "./MovieExperience";

// Query results: a large screen with motion allowed, so every pin / scrub code path is set up.
vi.hoisted(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: !query.includes("prefers-reduced-motion: reduce") && !query.includes("pointer: fine"),
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
  (window as unknown as Record<string, unknown>).ResizeObserver = Noop;
  window.scrollTo = (() => {}) as typeof window.scrollTo; // jsdom does not implement it
});

afterEach(() => {
  cleanup();
  window.sessionStorage.clear();
});

describe("MovieExperience (animated)", () => {
  it("sets up pins, scrubs and smooth scroll, and tears them down, without throwing", async () => {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1"); // skip the intro
    const errors: unknown[] = [];
    const onError = (event: ErrorEvent) => errors.push(event.error);
    window.addEventListener("error", onError);

    const { container, unmount } = render(<MovieExperience profile={getProfile("recruiter")!} />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 600)); // let the post-mount refresh fire
    });

    expect(container.querySelector(".movie")?.getAttribute("data-anim")).toBe("on");
    // The end credits are the one pinned scene; it marks its stage once its animation is live.
    expect(container.querySelector(".credits-stage")?.getAttribute("data-pinned")).toBe("true");
    // The story and the experience are plain scrolling layouts, so nothing may hijack their scrolling.
    expect(container.querySelector("[data-pinned]:not(.credits-stage)")).toBeNull();

    expect(() => unmount()).not.toThrow();
    window.removeEventListener("error", onError);
    expect(errors).toEqual([]);
  });

  it("plays the intro first when it has not been seen", () => {
    const { container } = render(<MovieExperience profile={getProfile("recruiter")!} />);
    expect(container.ownerDocument.querySelector(".intro")).not.toBeNull();
    expect(document.documentElement.style.overflow).toBe("hidden");
  });
});
