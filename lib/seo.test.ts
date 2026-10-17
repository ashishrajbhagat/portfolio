import { describe, expect, it } from "vitest";
import { certifications } from "@/content/education";
import { getProfile, profiles } from "@/content/profiles";
import { site, socialLinks } from "@/content/site";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import manifest from "@/app/manifest";
import { jsonLdScript, personJsonLd, profileMetadata, sitemapPaths } from "./seo";

describe("personJsonLd", () => {
  const data = personJsonLd();

  it("describes the person with absolute URLs and all social profiles", () => {
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe(site.name);
    expect(data.image).toMatch(/^https?:\/\//);
    expect(data.sameAs).toEqual(socialLinks.map((l) => l.url));
  });

  it("lists every certification", () => {
    expect(data.hasCredential.map((c) => c.name)).toEqual(certifications.map((c) => c.title));
  });

  it("contains no private details (phone, address, birth date, marks, email)", () => {
    const text = JSON.stringify(data);
    for (const forbidden of ["8368", "+91", "1996", "CGPA", "birth", "telephone", "address", "@gmail.com"]) {
      expect(text, forbidden).not.toContain(forbidden);
    }
  });
});

describe("jsonLdScript", () => {
  it("escapes '<' so the data can never close the script tag", () => {
    const out = jsonLdScript({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("profileMetadata", () => {
  it("only indexes the Recruiter view, the one carrying the full content", () => {
    const indexed = profiles.filter((p) => (profileMetadata(p).robots as { index: boolean }).index);
    expect(indexed.map((p) => p.slug)).toEqual(["recruiter"]);
  });

  it("gives each profile its own title, canonical path and share fields", () => {
    for (const profile of profiles) {
      const meta = profileMetadata(profile);
      expect(meta.title).toBe(`${profile.name} view`);
      expect(meta.alternates?.canonical).toBe(`/watch/${profile.slug}`);
      expect(meta.openGraph?.title).toContain(profile.name);
      expect((meta.twitter as { card?: string }).card).toBe("summary_large_image");
    }
  });
});

describe("crawler files", () => {
  it("sitemap lists absolute URLs for the indexed pages only", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual(sitemapPaths.map((path) => new URL(path, site.url).toString()));
    expect(urls.some((url) => url.includes("developer") || url.includes("explorer"))).toBe(false);
  });

  it("robots allows crawling and points at the sitemap", () => {
    const result = robots();
    expect(result.sitemap).toBe(new URL("/sitemap.xml", site.url).toString());
    expect(JSON.stringify(result.rules)).toContain("allow");
  });

  it("manifest has the site name and icons that exist on disk", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const result = manifest();
    expect(result.name).toBe(site.name);
    for (const icon of result.icons ?? []) expect(existsSync(join(process.cwd(), "public", icon.src))).toBe(true);
  });

  it("knows the recruiter profile exists", () => {
    expect(getProfile("recruiter")).toBeDefined();
  });
});
