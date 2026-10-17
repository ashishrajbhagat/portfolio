import type { Tone } from "./types";

/** Tone: FUNNY. First impression, so confident with a wink. */
export const hero = {
  tone: "funny" as Tone,
  greeting: "Hi, I'm Ashish.",
  headline: "I build enterprise websites on Adobe Experience Manager, and web platforms for clients.",
  subheadline:
    "Software Engineer at Concentrix Catalyst. I like turning complicated requirements into things that feel simple, and fixing the bugs that make them feel otherwise.",
  roles: ["Software Engineer", "AEM Developer (Certified)", "Full-stack Developer"],
  ctas: {
    primary: { label: "See my work", target: "projects" },
    secondary: { label: "Download resume", target: "resume" },
  },
  status: "Open to interesting conversations and good problems.",
};
