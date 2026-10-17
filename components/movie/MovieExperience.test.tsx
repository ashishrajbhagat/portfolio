// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { experience } from "@/content/experience";
import { flavor } from "@/content/flavor";
import { getProfile } from "@/content/profiles";
import { projects } from "@/content/projects";
import { sectionOrder } from "@/content/types";
import { scenes } from "@/lib/movie/scenes";
import Intro from "./Intro";
import MovieExperience from "./MovieExperience";

// GSAP's ScrollTrigger calls matchMedia while the module loads, so it must exist before the imports run.
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

function stubBrowserApis(reducedMotion: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

beforeAll(() => {
  class FakeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeObserver;

  // jsdom has no modal <dialog> support.
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.sessionStorage.clear();
  document.documentElement.style.overflow = "";
});

describe("MovieExperience (reduced motion)", () => {
  beforeEach(() => stubBrowserApis(true));

  const profile = getProfile("recruiter")!;

  it("renders every scene with its movie-voice title", () => {
    render(<MovieExperience profile={profile} />);
    for (const id of sectionOrder) {
      const heading = document.getElementById(`${id}-title`);
      expect(heading, `heading for ${id}`).not.toBeNull();
    }
    // Hero uses the greeting as h1; spot-check a few flavour titles.
    expect(screen.getByRole("heading", { name: flavor.movie.experience.title })).toBeTruthy();
    expect(screen.getByRole("heading", { name: flavor.movie.credits.title })).toBeTruthy();
  });

  it("skips the intro and plays no animation setup", () => {
    render(<MovieExperience profile={profile} />);
    expect(document.querySelector(".intro")).toBeNull();
    expect(document.querySelector(".movie-cover")).toBeNull();
    expect(document.querySelector(".movie")?.getAttribute("data-anim")).toBe("off");
  });

  it("lays every role out in full, with nothing clipped or scrolled sideways", () => {
    render(<MovieExperience profile={profile} />);
    const section = document.getElementById("experience")!;
    const roles = within(section).getAllByRole("article");
    expect(roles).toHaveLength(experience.length);
    for (const [index, role] of experience.entries()) {
      expect(within(roles[index]).getByText(role.company)).toBeTruthy();
      expect(within(roles[index]).getByText(role.summary)).toBeTruthy();
    }
    // The old horizontal film strip clipped the second role. Guard against any clipping container coming back.
    expect(section.className).not.toContain("overflow-hidden");
    expect(section.querySelector(".lg\\:w-max, .lg\\:flex-row")).toBeNull();
  });

  it("offers a scene index with one link per scene and a skip link", () => {
    render(<MovieExperience profile={profile} />);
    const nav = screen.getByRole("navigation", { name: "Scenes" });
    expect(within(nav).getAllByRole("link")).toHaveLength(scenes.length);
    expect(screen.getByText("Skip to content")).toBeTruthy();
  });

  it("has a real scroll-down button in the hero and no 'Now Showing' label", () => {
    render(<MovieExperience profile={profile} />);
    const hero = document.getElementById("hero")!;
    expect(within(hero).getByRole("button", { name: "Scroll to the next section" })).toBeTruthy();
    expect(hero.textContent).not.toMatch(/now showing/i);
    expect(document.getElementById("experience")!.textContent).not.toMatch(/now showing/i);
  });

  it("shows the Adobe mark on each certification", () => {
    render(<MovieExperience profile={profile} />);
    const awards = document.getElementById("certifications")!;
    expect(within(awards).getAllByRole("img", { name: "Adobe" })).toHaveLength(3);
  });

  it("shows all three education stages in the same style, each with syllabus highlights", () => {
    render(<MovieExperience profile={profile} />);
    const education = document.getElementById("education")!;
    const stages = within(education).getAllByRole("article");
    expect(stages).toHaveLength(3);
    for (const stage of stages) {
      expect(stage.querySelector("h3")?.className).toContain("text-3xl");
      expect(within(stage).getByText("Syllabus highlights")).toBeTruthy();
    }
  });

  it("never renders placeholder links", () => {
    render(<MovieExperience profile={profile} />);
    const placeholders = Array.from(document.querySelectorAll("a")).filter((a) => a.getAttribute("href") === "#");
    expect(placeholders).toHaveLength(0);
  });

  it("opens a project dialog and releases the scroll lock when closed", async () => {
    const user = userEvent.setup();
    render(<MovieExperience profile={profile} />);

    const poster = screen.getByRole("button", { name: new RegExp(projects[0].title) });
    await user.click(poster);

    const dialog = document.querySelector("dialog")!;
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(within(dialog).getByRole("heading", { name: projects[0].title })).toBeTruthy();
    expect(document.documentElement.style.overflow).toBe("hidden");

    await user.click(within(dialog).getByRole("button", { name: "Close" }));
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("previews the live website inside the project dialog instead of a static image", async () => {
    const user = userEvent.setup();
    render(<MovieExperience profile={profile} />);
    await user.click(screen.getByRole("button", { name: new RegExp(projects[0].title) }));
    const dialog = document.querySelector("dialog")!;
    const frame = within(dialog).getByTitle(`${projects[0].title}: live preview`) as HTMLIFrameElement;
    expect(frame.getAttribute("src")).toBe(projects[0].links.live);
    expect(dialog.querySelector("img[alt$='screenshot']")).toBeNull();
  });

  it("releases the scroll lock when the dialog closes itself (Escape)", async () => {
    const user = userEvent.setup();
    render(<MovieExperience profile={profile} />);

    await user.click(screen.getByRole("button", { name: new RegExp(projects[0].title) }));
    const dialog = document.querySelector("dialog")!;
    expect(document.documentElement.style.overflow).toBe("hidden");

    // The browser closes a modal dialog on Escape and fires "close" without going through our code.
    act(() => {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    });
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("copies the email address", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<MovieExperience profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Copy / }));
    await screen.findByText("Copied!");
    expect(writeText).toHaveBeenCalledWith("ashishrajbhagat@gmail.com");
  });

  it("shows final stat values without counting", () => {
    render(<MovieExperience profile={profile} />);
    const label = screen.getByText("AEM certifications");
    expect(label.previousElementSibling?.textContent).toBe("3");
  });
});

describe("Intro", () => {
  beforeEach(() => {
    stubBrowserApis(false);
    vi.useFakeTimers();
  });

  it("counts down, shows the title card, then reveals and unmounts", () => {
    const onReveal = vi.fn();
    const onGone = vi.fn();
    const { container } = render(<Intro onReveal={onReveal} onGone={onGone} />);

    expect(container.textContent).toContain("3");
    act(() => void vi.advanceTimersByTime(700));
    expect(container.textContent).toContain("2");
    act(() => void vi.advanceTimersByTime(700));
    expect(container.textContent).toContain("1");
    act(() => void vi.advanceTimersByTime(700));
    expect(container.textContent).toContain("Ashish Raj");
    expect(onReveal).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(1700));
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(onGone).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(800));
    expect(onGone).toHaveBeenCalledTimes(1);
  });

  it("can be skipped with the button or any key, and only reveals once", () => {
    const onReveal = vi.fn();
    const onGone = vi.fn();
    render(<Intro onReveal={onReveal} onGone={onGone} />);

    fireEvent.click(screen.getByRole("button", { name: "Skip intro" }));
    fireEvent.keyDown(window, { key: "a" });
    expect(onReveal).toHaveBeenCalledTimes(1);

    act(() => void vi.advanceTimersByTime(800));
    expect(onGone).toHaveBeenCalledTimes(1);
  });

  it("ignores modifier keys", () => {
    const onReveal = vi.fn();
    render(<Intro onReveal={onReveal} onGone={vi.fn()} />);
    fireEvent.keyDown(window, { key: "Shift" });
    expect(onReveal).not.toHaveBeenCalled();
  });
});
