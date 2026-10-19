import { projects, type Project } from "../content/projects";
import { site } from "../content/site";

/**
 * Relative imports on purpose: next.config.ts uses this file to build the Content-Security-Policy `frame-src` list,
 * and the config cannot resolve the "@/" alias.
 */

/** The URL to embed for a project, or null when it should not (or cannot) be previewed live. */
export function embedUrl(project: Pick<Project, "links" | "embed">): string | null {
  const live = project.links.live;
  if (!live || live === "#" || project.embed === false) return null;

  try {
    const url = new URL(live);
    if (url.protocol !== "https:") return null;
    if (url.origin === new URL(site.url).origin) return null; // never frame the site inside itself
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Origins of every project that is previewed live. These are the only hosts the CSP lets this site frame.
 * For a custom domain the "www" / apex twin is included too, because such sites commonly redirect between the two
 * and the browser checks the final address against the policy.
 */
export function embedOrigins(list: Array<Pick<Project, "links" | "embed">> = projects): string[] {
  const origins = new Set<string>();
  for (const project of list) {
    const url = embedUrl(project);
    if (!url) continue;
    const { origin, hostname, protocol } = new URL(url);
    origins.add(origin);
    if (!hostname.endsWith(".vercel.app")) {
      const twin = hostname.startsWith("www.") ? hostname.slice(4) : `www.${hostname}`;
      origins.add(`${protocol}//${twin}`);
    }
  }
  return [...origins];
}
