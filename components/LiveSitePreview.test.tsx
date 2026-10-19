// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEmbedStatus } from "@/lib/embed-status";
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
  beforeEach(() => {
    cleanup();
    resetEmbedStatus();
  });
  afterEach(() => vi.unstubAllGlobals());
  const byId = (id: string) => projects.find((p) => p.id === id)!;
  const stubVerdicts = (body: unknown, ok = true) =>
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => body }));

  it("embeds the live site when the server says it allows framing", async () => {
    stubVerdicts({ "aem-tutorial": { embeddable: true } });
    render(<ProjectPreview project={byId("aem-tutorial")} />);
    expect(screen.getByTitle("AEM Tutorial: live preview")).toBeTruthy();
    await act(async () => {});
    expect(screen.getByTitle("AEM Tutorial: live preview")).toBeTruthy();
  });

  it("swaps the iframe for a clear explanation and an 'open' link when the site blocks framing", async () => {
    stubVerdicts({ "aem-tutorial": { embeddable: false, reason: "X-Frame-Options: deny" } });
    render(<ProjectPreview project={byId("aem-tutorial")} />);
    await screen.findByText(/can't be shown inside another page/);
    expect(document.querySelector("iframe")).toBeNull();
    const link = screen.getByRole("link", { name: /Open aem-tutorial.vercel.app/ });
    expect(link.getAttribute("href")).toBe("https://aem-tutorial.vercel.app/");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByText(/X-Frame-Options: deny/)).toBeTruthy();
  });

  it("still tries the preview when the check cannot run", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ProjectPreview project={byId("aem-tutorial")} />);
    await act(async () => {});
    expect(screen.getByTitle("AEM Tutorial: live preview")).toBeTruthy();
  });

  it("only asks the server once for several projects", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    render(<ProjectPreview project={byId("aem-tutorial")} />);
    render(<ProjectPreview project={byId("yantrastack")} />);
    await act(async () => {});
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/embed-check");
  });

  it("never frames this portfolio inside itself: it explains instead", () => {
    render(<ProjectPreview project={byId("portfolio")} />);
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("You're looking at this one right now.")).toBeTruthy();
  });
});
