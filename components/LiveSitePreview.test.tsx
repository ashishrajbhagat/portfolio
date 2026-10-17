// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LiveSitePreview from "./LiveSitePreview";
import ProjectPreview from "./ProjectPreview";
import { projects } from "@/content/projects";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const url = "https://aem-tutorial.vercel.app/";

describe("LiveSitePreview", () => {
  it("embeds the site in a sandboxed, lazily loaded iframe with a descriptive title", () => {
    render(<LiveSitePreview url={url} title="AEM Tutorial" />);
    const frame = screen.getByTitle("AEM Tutorial: live preview") as HTMLIFrameElement;
    expect(frame.getAttribute("src")).toBe(url);
    expect(frame.getAttribute("loading")).toBe("lazy");
    expect(frame.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
    const sandbox = frame.getAttribute("sandbox") ?? "";
    expect(sandbox).toContain("allow-scripts");
    expect(sandbox).not.toContain("allow-top-navigation"); // the framed site can never navigate this page away
  });

  it("shows the host in the address bar and a safe 'open in a new tab' link", () => {
    render(<LiveSitePreview url={url} title="AEM Tutorial" />);
    expect(screen.getByText("aem-tutorial.vercel.app")).toBeTruthy();
    for (const link of screen.getAllByRole("link", { name: /Open/ })) {
      expect(link.getAttribute("href")).toBe(url);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("switches between desktop and mobile widths", () => {
    render(<LiveSitePreview url={url} title="AEM Tutorial" />);
    const frame = screen.getByTitle("AEM Tutorial: live preview");
    const holder = () => frame.parentElement as HTMLElement;

    expect(screen.getByRole("button", { name: "Desktop" }).getAttribute("aria-pressed")).toBe("true");
    expect(holder().className).toContain("w-full");

    fireEvent.click(screen.getByRole("button", { name: "Mobile" }));
    expect(screen.getByRole("button", { name: "Mobile" }).getAttribute("aria-pressed")).toBe("true");
    expect(holder().className).toContain("w-[390px]");
  });

  it("shows a loading message until the page has loaded", () => {
    render(<LiveSitePreview url={url} title="AEM Tutorial" />);
    expect(screen.getByText("Loading live preview…")).toBeTruthy();
    fireEvent.load(screen.getByTitle("AEM Tutorial: live preview"));
    expect(screen.queryByText("Loading live preview…")).toBeNull();
  });

  it("tells the visitor it is taking a while, after a few seconds", () => {
    vi.useFakeTimers();
    render(<LiveSitePreview url={url} title="AEM Tutorial" />);
    expect(screen.queryByRole("status")).toBeNull();
    act(() => void vi.advanceTimersByTime(8100));
    expect(screen.getByRole("status").textContent).toContain("Taking a while to load");
  });
});

describe("ProjectPreview", () => {
  beforeEach(() => cleanup());
  const byId = (id: string) => projects.find((p) => p.id === id)!;

  it("embeds the live site for a project with a live link", () => {
    render(<ProjectPreview project={byId("aem-tutorial")} />);
    expect(screen.getByTitle("AEM Tutorial: live preview")).toBeTruthy();
  });

  it("never frames this portfolio inside itself: it explains instead", () => {
    render(<ProjectPreview project={byId("portfolio")} />);
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("You're looking at this one right now.")).toBeTruthy();
  });

  it("explains when a project has no live link yet", () => {
    render(<ProjectPreview project={byId("english-tutorial")} />);
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText(/Still in the planning stage/)).toBeTruthy();
  });
});
