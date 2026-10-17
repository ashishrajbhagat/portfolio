import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { embedOrigins, embedUrl } from "./embed";

describe("embedUrl", () => {
  it("embeds a project's live https site", () => {
    expect(embedUrl({ links: { live: "https://aem-tutorial.vercel.app/" } })).toBe("https://aem-tutorial.vercel.app/");
  });

  it("does not embed projects without a live link or with a placeholder link", () => {
    expect(embedUrl({ links: {} })).toBeNull();
    expect(embedUrl({ links: { live: "#" } })).toBeNull();
  });

  it("respects embed: false", () => {
    expect(embedUrl({ links: { live: "https://example.vercel.app" }, embed: false })).toBeNull();
  });

  it("never embeds insecure or malformed URLs", () => {
    expect(embedUrl({ links: { live: "http://example.com" } })).toBeNull();
    expect(embedUrl({ links: { live: "not a url" } })).toBeNull();
    expect(embedUrl({ links: { live: "javascript:alert(1)" } })).toBeNull();
  });

  it("never frames this site inside itself", () => {
    expect(embedUrl({ links: { live: site.url } })).toBeNull();
  });
});

describe("embedOrigins", () => {
  it("returns unique origins for the embeddable projects only", () => {
    const origins = embedOrigins([
      { links: { live: "https://a.vercel.app/x" } },
      { links: { live: "https://a.vercel.app/y" } },
      { links: { live: "https://b.vercel.app" } },
      { links: {} },
      { links: { live: "https://c.vercel.app" }, embed: false },
    ]);
    expect(origins).toEqual(["https://a.vercel.app", "https://b.vercel.app"]);
  });

  it("covers every real project that has a live site, and not the portfolio itself", () => {
    const origins = embedOrigins();
    expect(origins).toContain("https://aem-tutorial.vercel.app");
    expect(origins).toContain("https://udaan-library.vercel.app");
    expect(origins).not.toContain(new URL(site.url).origin);
    expect(origins.length).toBe(projects.filter((p) => embedUrl(p)).length);
  });
});
