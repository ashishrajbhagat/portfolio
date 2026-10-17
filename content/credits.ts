import type { Dummyable, Tone } from "./types";

/** Tone: FUNNY. The movie profile rolls these as end credits. */
export const credits: {
  tone: Tone;
  items: Array<{ role: string; name: string }>;
  postCredits: string;
} & Dummyable = {
  tone: "funny",
  dummy: true,
  items: [
    { role: "Directed by", name: "Ashish Raj" },
    { role: "Written by", name: "Ashish Raj (and Stack Overflow)" },
    { role: "Cinematography", name: "Tailwind CSS" },
    { role: "Special Effects", name: "Framer Motion, GSAP & Three.js" },
    { role: "Sound Department", name: "Your imagination (sounds optional)" },
    { role: "Soundtrack", name: "Keyboard clatter, mostly" },
    { role: "Stunt Double", name: "Ctrl + Z" },
    { role: "Tested On", name: "My machine (where it worked)" },
    { role: "Known Issues", name: "Features, not bugs" },
    { role: "Location", name: "Buxar, Bihar, India" },
    { role: "Legal Notice", name: "No bugs were harmed in the making of this website. Several were evicted." },
  ],
  postCredits: "Post-credits scene: Ashish refreshes the page one more time, just to be sure it still works.",
};
