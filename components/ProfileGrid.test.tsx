// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { profiles } from "@/content/profiles";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

// A visitor with "reduce motion" switched on. The stub must exist before framer-motion is imported.
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

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {}, prefetch: () => {} }),
}));

import ProfileGrid from "./ProfileGrid";

describe("ProfileGrid hydration", () => {
  // The server cannot know the visitor's motion preference, so it always renders the same hidden, offset
  // starting state. If the client's first render differed (e.g. `y: reduced ? 0 : 10`), React would report a
  // hydration mismatch. Rendering here with reduced motion ON must therefore still produce that state.
  const markup = renderToString(createElement(ProfileGrid));

  it("renders the heading in its offset starting state even when reduced motion is on", () => {
    expect(markup).toMatch(/<h1[^>]*style="[^"]*translateY\(10px\)/);
  });

  it("renders every profile tile in its hidden starting state", () => {
    const tiles = markup.match(/<li[^>]*style="[^"]*translateY\(14px\) scale\(0\.9\)/g) ?? [];
    expect(tiles).toHaveLength(4); // Recruiter, Developer, Explorer, Add Profile
  });
});

describe("ProfileGrid", () => {
  afterEach(cleanup);

  it("offers one card per profile plus the Add Profile tile", () => {
    render(createElement(ProfileGrid));
    for (const profile of profiles) {
      expect(screen.getByRole("button", { name: `Watch as ${profile.name}` })).toBeTruthy();
    }
    expect(screen.getByRole("button", { name: ui.addProfile.name })).toBeTruthy();
  });

  it("shows the owner's portrait, the headline and each profile's pitch", () => {
    render(createElement(ProfileGrid));
    expect(screen.getByAltText(site.avatarAlt)).toBeTruthy();
    expect(screen.getByRole("heading", { name: ui.profileScreen.title })).toBeTruthy();
    for (const profile of profiles) expect(screen.getByText(profile.pitch)).toBeTruthy();
  });

  it("answers the Add Profile tile with a toast", async () => {
    const user = userEvent.setup();
    render(createElement(ProfileGrid));
    await user.click(screen.getByRole("button", { name: ui.addProfile.name }));
    expect(await screen.findByRole("status")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(ui.addProfile.toast);
  });
});
