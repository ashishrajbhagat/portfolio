import { NextResponse } from "next/server";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { embedUrl } from "@/lib/embed";
import type { EmbedStatusMap } from "@/lib/embed-status";
import { frameVerdict } from "@/lib/frame-policy";

// Checked on request (and cached by the CDN for an hour), never baked in at build time.
export const dynamic = "force-dynamic";

/** Origins that will be framing the sites: this portfolio, with and without "www". */
function parentOrigins(): string[] {
  const { origin, hostname } = new URL(site.url);
  const other = hostname.startsWith("www.") ? origin.replace("www.", "") : origin.replace("://", "://www.");
  return [origin, other];
}

/**
 * Reports, for every project previewed live, whether its site allows being shown in an iframe on this portfolio.
 * Only URLs from `content/projects.ts` are ever fetched (nothing comes from the request), so this cannot be used
 * to make the server request arbitrary addresses.
 */
export async function GET() {
  const parents = parentOrigins();
  const entries = await Promise.all(
    projects.map(async (project): Promise<[string, EmbedStatusMap[string]] | null> => {
      const url = embedUrl(project);
      if (!url) return null;
      try {
        const response = await fetch(url, {
          redirect: "follow",
          cache: "no-store",
          signal: AbortSignal.timeout(6000),
          headers: { "user-agent": "portfolio-embed-check/1.0" },
        });
        return [project.id, frameVerdict(response.headers, parents)];
      } catch {
        return [project.id, { embeddable: true, unknown: true }];
      }
    })
  );

  return NextResponse.json(Object.fromEntries(entries.filter((entry) => entry !== null)), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
