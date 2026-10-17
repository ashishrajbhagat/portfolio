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
 * AEM Tutorial, Udaan and this portfolio are real; the Udaan feature list is an educated guess and the English
 * Speaking Tutorial is a planned future project (shown as "Coming Soon").
 * Replace the placeholder screenshots in public/placeholders/ with real ones.
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
      "A client website that brings a whole toolbox together in one place: PDF tools, image tools and developer tools, ready to use right in the browser.",
    highlights: [
      "PDF tools for everyday document tasks.",
      "Image tools for quick edits and conversions.",
      "Developer tools for the small jobs that come up every day.",
      "One clean, fast interface for the whole toolbox.",
    ],
    stack: [],
    status: "Live",
    // TODO: add the live URL (links: { live: "https://..." }) and the live preview switches on automatically.
    links: {},
    previewNote: "The live preview link is coming soon.",
    tone: "serious",
    featured: true,
    dummy: true,
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
    links: { live: "https://udaan-library.vercel.app" },
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
  {
    id: "english-tutorial",
    title: "English Speaking Tutorial",
    tagline: "Learn to speak English with confidence, one conversation at a time.",
    description:
      "A planned learning platform for spoken English, to be built for a client. The focus is speaking practice: guided lessons, real-life conversation scenarios and progress tracking, so learners practise out loud instead of only reading rules.",
    highlights: [
      "Speaking-first lessons built around everyday conversations.",
      "Guided practice with pronunciation and fluency tips.",
      "Progress tracking so learners can see themselves improving.",
      "Simple enough for first-time learners, and designed to work well on a phone.",
    ],
    stack: ["Next.js", "Supabase"],
    status: "Prototype",
    links: {},
    previewNote: "Still in the planning stage. Check back soon.",
    tone: "serious",
    dummy: true,
  },
];
