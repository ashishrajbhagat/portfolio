import { projects } from "@/content/projects";
import { site, socialLinks } from "@/content/site";

/**
 * Allow-list for the `open` command. Only URLs that come from the content files can be opened,
 * and placeholder links ("#") are skipped.
 */
export function getOpenTargets(): Record<string, string> {
  const targets: Record<string, string> = {};
  for (const project of projects) {
    if (project.links.live && project.links.live !== "#") targets[project.id] = project.links.live;
    if (project.links.repo && project.links.repo !== "#") targets[`${project.id}-repo`] = project.links.repo;
  }
  for (const link of socialLinks) {
    if (link.url && link.url !== "#") targets[link.id] = link.url;
  }
  targets.resume = site.resumeUrl;
  targets.email = `mailto:${site.email}`;
  return targets;
}

export function openTargetNames(): string[] {
  return Object.keys(getOpenTargets());
}
