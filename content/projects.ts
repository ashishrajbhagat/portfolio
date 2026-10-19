import type { Dummyable, Tone } from "./types";

export interface Project extends Dummyable {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  status: "Live" | "In progress" | "Prototype";
  links: { live?: string; repo?: string };
  /** Optional still image. Not used by default: the live site is previewed instead. */
  image?: string;
  /** Set false to never embed the live site (e.g. this portfolio itself). Defaults to true when a live link exists. */
  embed?: boolean;
  /** Shown in place of the live preview when there is nothing to embed. */
  previewNote?: string;
  tone: Tone;
  featured?: boolean;
}

/**
 * Tone: SERIOUS descriptions, FUNNY taglines.
 * All five are real and live. The Udaan feature list is an educated guess (the others come from the live sites).
 */
export const projects: Project[] = [
  {
    id: "aem-tutorial",
    title: "AEM Tutorial",
    tagline: "Learn AEM the way real developers use it.",
    description:
      "A free learning hub for Adobe Experience Manager, written from real project experience. It follows a roadmap from the fundamentals (JCR, Sling, OSGi, components and templates) through backend development, workflows, Dispatcher, security and headless delivery, with interview preparation alongside.",
    highlights: [
      "A structured roadmap from beginner to advanced, with the sidebar organised by topic.",
      "Covers AEM as a Cloud Service and AEM 6.5, calling out where they differ.",
      "Practical guides: building a component from dialog to Sling Model, Dispatcher explained visually, scenario-based interview questions.",
      "Open on GitHub, with suggestions and contributions welcome.",
    ],
    stack: ["AEM", "AEM Cloud Service", "Sling Models", "OSGi", "Dispatcher", "Headless"],
    status: "Live",
    links: { live: "https://aem-tutorial.vercel.app/", repo: "https://github.com/ashishrajbhagat/aem-tutorial" },
    tone: "serious",
    featured: true,
  },
  {
    id: "yantrastack",
    title: "YantraStack",
    tagline: "Every everyday tool, in one stack.",
    description:
      "A client website that brings a whole toolbox together: free PDF tools, image tools and developer utilities that run entirely in the browser, so files never leave the user's device.",
    highlights: [
      "Privacy-first: files are processed locally in the browser and never uploaded.",
      "PDF tools, image tools and developer utilities in one suite, with a built-in tool search.",
      "Always free, with no account and no watermarks.",
      "An articles section explaining the techniques behind the tools.",
    ],
    stack: [],
    status: "Live",
    links: { live: "https://yantrastack.com/" },
    tone: "serious",
    featured: true,
  },
  {
    id: "english-daily",
    title: "English Daily",
    tagline: "English speaking practice, a little every day.",
    description:
      "A web app for practising spoken English, made for Hindi speakers and built for a client. Learners pick a level and a roadmap, then work through small daily tasks: speaking phrases out loud, free talk, dictation, words, grammar and quizzes, earning XP and keeping a daily streak.",
    highlights: [
      "Level-based roadmaps so every learner starts in the right place.",
      "Speaking-first practice: say a phrase out loud, 60 seconds of free talk, and dictation.",
      "Words, grammar lessons and quizzes, with a notebook that saves mistakes for review.",
      "XP, daily streaks and badges to build the habit, in light and dark themes.",
    ],
    stack: [],
    status: "Live",
    links: { live: "https://english-daily-iota.vercel.app/" },
    tone: "serious",
    featured: true,
  },
  {
    id: "udaan-library",
    title: "Udaan Library Management System",
    tagline: "From paper registers to one dashboard.",
    description:
      "A library management system built for a client's study library, using Next.js 14 and Supabase. It is split into three role-based portals so that each type of user sees only what they need.",
    highlights: [
      "Three role-based portals with separate dashboards and permissions.",
      "Student records, seat allocation and fee tracking in one place.",
      "Attendance and renewals that replace a registers-and-pen routine.",
      "Deployed on Vercel with Supabase handling auth, database and row-level security.",
    ],
    stack: ["Next.js 14", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    status: "Live",
    links: { live: "https://udaan-library.vercel.app/" },
    tone: "serious",
    featured: true,
    dummy: true,
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    tagline: "Three websites in a trench coat.",
    description:
      "A Netflix-style 'Who's watching?' portfolio where each profile opens a completely different experience: a cinematic movie, a terminal OS, and a journey through space.",
    highlights: [
      "One content source powers all three themes.",
      "Framer Motion, GSAP, Lenis and React Three Fiber for the cinematic parts.",
      "Respects reduced-motion settings, because cinematic shouldn't mean nauseating.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Three.js"],
    status: "Live",
    links: { live: "https://ashishrajbhagat.dev" },
    embed: false,
    previewNote: "You're looking at this one right now.",
    tone: "funny",
    featured: true,
  },
];
