export type Tone = "funny" | "serious" | "sarcastic";
export type ThemeKey = "movie" | "terminal" | "space";
export type ProfileSlug = "recruiter" | "developer" | "explorer";

export const sectionOrder = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "funFacts",
  "testimonials",
  "resume",
  "contact",
  "credits",
] as const;

export type SectionKey = (typeof sectionOrder)[number];

/** Anything marked `dummy: true` is placeholder content. Replace before going live. */
export interface Dummyable {
  dummy?: boolean;
}

export interface Flavor {
  title: string;
  subtitle: string;
}
