import type { ProfileSlug, ThemeKey } from "./types";

export interface Profile {
  slug: ProfileSlug;
  name: string;
  theme: ThemeKey;
  /** Short line shown under the name on the profile screen. */
  caption: string;
  /** Glow and accent colour for this profile. */
  accent: string;
  themeLabel: string;
  /** Which build phase delivers the real theme. */
  phase: number;
  pitch: string;
}

export const profiles: Profile[] = [
  {
    slug: "recruiter",
    name: "Recruiter",
    theme: "movie",
    caption: "Cinematic story",
    accent: "#f5b301",
    themeLabel: "Movie theme",
    phase: 3,
    pitch: "Short, sharp and cinematic. Resume is one click away.",
  },
  {
    slug: "developer",
    name: "Developer",
    theme: "terminal",
    caption: "Terminal OS",
    accent: "#39ff88",
    themeLabel: "Terminal OS theme",
    phase: 2,
    pitch: "Boot sequence, commands and `ls projects/`.",
  },
  {
    slug: "explorer",
    name: "Explorer",
    theme: "space",
    caption: "Space journey",
    accent: "#8b7bff",
    themeLabel: "Space journey theme",
    phase: 4,
    pitch: "Fly through a night sky where every project is a planet.",
  },
];

export function getProfile(slug: string): Profile | undefined {
  return profiles.find((p) => p.slug === slug);
}
