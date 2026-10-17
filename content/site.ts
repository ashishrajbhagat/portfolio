import type { Dummyable } from "./types";

export const site = {
  name: "Ashish Raj",
  handle: "ashishrajbhagat",
  domain: "ashishrajbhagat.dev",
  /** Canonical public URL. Override per environment with NEXT_PUBLIC_SITE_URL (see .env.example). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashishrajbhagat.dev").replace(/\/+$/, ""),
  title: "Ashish Raj | Software Engineer (AEM & Full-stack)",
  description:
    "Portfolio of Ashish Raj: Adobe Experience Manager (AEM) and full-stack developer. Pick a profile and enjoy the show.",
  location: "Buxar, Bihar, India",
  email: "ashishrajbhagat@gmail.com",
  /** Used to calculate years of experience automatically (TA Digital, Aug 2020). */
  careerStart: { year: 2020, month: 8 },
  /** Square head-and-shoulders crop, used for avatars and portraits. */
  avatar: "/images/ashish.jpg",
  avatarAlt: "Portrait of Ashish Raj",
  /** Taller photo at his desk, used as the Movie theme's hero image. */
  scene: "/images/ashish-workspace.jpg",
  sceneAlt: "Ashish Raj at his desk with a laptop",
  /** A public-safe resume (no phone number, date of birth or marks). Regenerate it if the content changes. */
  resumeUrl: "/resume.pdf",
};

export interface SocialLink extends Dummyable {
  id: string;
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/ashishrajbhagat" },
  { id: "github", label: "GitHub", url: "https://github.com/ashishrajbhagat" },
  { id: "x", label: "X (Twitter)", url: "https://x.com/ashishrajbhagat" },
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/ashishrajbhagat" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/ashishrajbhagat23" },
];

export function yearsOfExperience(now: Date = new Date()): number {
  const months =
    (now.getFullYear() - site.careerStart.year) * 12 +
    (now.getMonth() + 1 - site.careerStart.month);
  return Math.max(0, Math.floor(months / 12));
}
