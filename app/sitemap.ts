import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { sitemapPaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return sitemapPaths.map((path, index) => ({
    url: new URL(path, site.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
