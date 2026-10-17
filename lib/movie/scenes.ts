import { sectionOrder, type SectionKey } from "@/content/types";

/** Short names for the scene navigation. Every section needs one (enforced by a test). */
export const sceneLabels: Record<SectionKey, string> = {
  hero: "Opening Scene",
  about: "Origin Story",
  experience: "The Grind",
  projects: "Presentations",
  skills: "The Cast",
  education: "Flashback",
  certifications: "Awards",
  funFacts: "Behind the Scenes",
  testimonials: "Reviews",
  resume: "Press Kit",
  contact: "Book a Screening",
  credits: "End Credits",
};

export interface Scene {
  id: SectionKey;
  label: string;
  number: number;
}

export const scenes: Scene[] = sectionOrder.map((id, index) => ({
  id,
  label: sceneLabels[id],
  number: index + 1,
}));

export const sceneCount = scenes.length;
