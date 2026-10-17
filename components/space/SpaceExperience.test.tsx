// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { flavor } from "@/content/flavor";
import { getProfile } from "@/content/profiles";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { sectionOrder } from "@/content/types";
import { space } from "@/lib/space/store";

// Visitor with "reduce motion" on: the page must work with no scroll-linked flight at all.
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

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// The WebGL scene cannot run under jsdom: stand in for it, keeping the planet-click callback testable.
vi.mock("./SpaceBackdrop", () => ({
  default: ({ onOpenProject }: { onOpenProject: (id: string) => void }) => (
    <div data-testid="backdrop">
      <button type="button" onClick={() => onOpenProject(projects[1].id)}>
        click planet
      </button>
    </div>
  ),
}));

import SpaceExperience from "./SpaceExperience";

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
  document.documentElement.style.overflow = "";
});

const profile = getProfile("explorer")!;

describe("SpaceExperience (reduced motion)", () => {
  beforeEach(() => {
    space.focusId = null;
  });

  it("renders every sector with its space-voice title", () => {
    render(<SpaceExperience profile={profile} />);
    for (const id of sectionOrder) {
      const heading = document.getElementById(`${id}-title`);
      expect(heading, `heading for ${id}`).not.toBeNull();
    }
    expect(screen.getByRole("heading", { name: flavor.space.projects.title })).toBeTruthy();
    expect(screen.getByRole("heading", { name: flavor.space.credits.title })).toBeTruthy();
  });

  it("offers a sector index, a skip link and the sky backdrop", () => {
    render(<SpaceExperience profile={profile} />);
    const nav = screen.getByRole("navigation", { name: "Sectors" });
    expect(within(nav).getAllByRole("link")).toHaveLength(sectionOrder.length);
    expect(screen.getByText("Skip to content")).toBeTruthy();
    expect(screen.getByTestId("backdrop")).toBeTruthy();
  });

  it("shows the portrait in the hero and the about panel", () => {
    render(<SpaceExperience profile={profile} />);
    expect(screen.getAllByAltText(site.avatarAlt).length).toBeGreaterThanOrEqual(2);
  });

  it("hides the live telemetry readouts but keeps the sector label", () => {
    render(<SpaceExperience profile={profile} />);
    const hud = screen.getByRole("complementary", { name: "Flight telemetry" });
    expect(hud.textContent).toContain(`SECTOR 01 / ${String(sectionOrder.length).padStart(2, "0")}`);
    expect(hud.textContent).not.toContain("DIST");
  });

  it("has a real scroll-down button in the hero", () => {
    render(<SpaceExperience profile={profile} />);
    expect(within(document.getElementById("hero")!).getByRole("button", { name: "Scroll to the next section" })).toBeTruthy();
  });

  it("shows the Adobe mark on each certification badge", () => {
    render(<SpaceExperience profile={profile} />);
    expect(within(document.getElementById("certifications")!).getAllByRole("img", { name: "Adobe" })).toHaveLength(3);
  });

  it("shows all three education stages in the same style", () => {
    render(<SpaceExperience profile={profile} />);
    const stages = within(document.getElementById("education")!).getAllByRole("article");
    expect(stages).toHaveLength(3);
    for (const stage of stages) expect(stage.querySelector("h3")?.className).toContain("text-3xl");
  });

  it("never renders placeholder links", () => {
    render(<SpaceExperience profile={profile} />);
    const placeholders = Array.from(document.querySelectorAll("a")).filter((a) => a.getAttribute("href") === "#");
    expect(placeholders).toHaveLength(0);
  });

  it("opens a project from its card and releases the scroll lock on close", async () => {
    const user = userEvent.setup();
    render(<SpaceExperience profile={profile} />);

    await user.click(screen.getAllByRole("button", { name: "Inspect system" })[0]);
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
    render(<SpaceExperience profile={profile} />);
    await user.click(screen.getAllByRole("button", { name: "Inspect system" })[0]);
    const dialog = document.querySelector("dialog")!;
    const frame = within(dialog).getByTitle(`${projects[0].title}: live preview`) as HTMLIFrameElement;
    expect(frame.getAttribute("src")).toBe(projects[0].links.live);
    expect(dialog.querySelector("img[alt$='screenshot']")).toBeNull();
  });

  it("releases the scroll lock when the browser closes the dialog itself (Escape)", async () => {
    const user = userEvent.setup();
    render(<SpaceExperience profile={profile} />);

    await user.click(screen.getAllByRole("button", { name: "Inspect system" })[0]);
    const dialog = document.querySelector("dialog")!;
    expect(document.documentElement.style.overflow).toBe("hidden");

    act(() => {
      dialog.removeAttribute("open");
      dialog.dispatchEvent(new Event("close"));
    });
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("opens the matching project when a planet is clicked in the 3D scene", async () => {
    const user = userEvent.setup();
    render(<SpaceExperience profile={profile} />);

    await user.click(screen.getByRole("button", { name: "click planet" }));
    const dialog = document.querySelector("dialog")!;
    expect(within(dialog).getByRole("heading", { name: projects[1].title })).toBeTruthy();
  });

  it("lights up a planet while its card is hovered or focused", () => {
    render(<SpaceExperience profile={profile} />);
    const card = screen.getAllByRole("button", { name: "Inspect system" })[2].closest("article")!;

    fireEvent.mouseEnter(card);
    expect(space.focusId).toBe(projects[2].id);
    fireEvent.mouseLeave(card);
    expect(space.focusId).toBeNull();

    fireEvent.focus(card);
    expect(space.focusId).toBe(projects[2].id);
    fireEvent.blur(card);
    expect(space.focusId).toBeNull();
  });

  it("copies the email address", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<SpaceExperience profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Copy / }));
    await screen.findByText("Copied!");
    expect(writeText).toHaveBeenCalledWith(site.email);
  });

  it("shows final stat values straight away", () => {
    render(<SpaceExperience profile={profile} />);
    const label = screen.getByText("AEM certifications");
    expect(label.previousElementSibling?.textContent).toBe("3");
  });
});
