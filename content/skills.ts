import type { Dummyable, Tone } from "./types";

export interface Skill extends Dummyable {
  name: string;
  /** 0 to 100. Self-reported, for visual effect only. */
  level: number;
  quip: string;
}

export interface SkillGroup {
  group: string;
  tone: Tone;
  items: Skill[];
}

/**
 * Tone: SARCASTIC. Skills lists are boring, so every skill gets a one-liner.
 * Levels are for visual effect: adjust to taste.
 */
export const skillGroups: SkillGroup[] = [
  {
    group: "Adobe Experience Manager",
    tone: "sarcastic",
    items: [
      { name: "AEM (Cloud Service, 6.5, 6.4)", level: 92, quip: "Three versions, one habit: check the logs first." },
      { name: "Components & Dialogs", level: 90, quip: "If an author can use it without calling me, it's done." },
      { name: "Templates & Pages", level: 88, quip: "Structure first, pixels second." },
      { name: "Experience & Content Fragments", level: 85, quip: "Write once, reuse everywhere. In theory." },
      { name: "Workflows, Events & Schedulers", level: 84, quip: "Automation for the things nobody wants to do by hand." },
      { name: "AEM Assets", level: 80, quip: "Because someone has to know where the images went." },
      { name: "Dispatcher & Caching", level: 78, quip: "It's always the cache. Except when it isn't." },
    ],
  },
  {
    group: "Java & Backend",
    tone: "sarcastic",
    items: [
      { name: "Java", level: 82, quip: "Verbose, but we've made peace." },
      { name: "OSGi & Apache Sling", level: 86, quip: "Bundle status: Active. Mood: Unknown." },
      { name: "Sling Models", level: 88, quip: "Annotations doing the heavy lifting since forever." },
      { name: "Servlets & Services", level: 82, quip: "The old reliable. Like a landline." },
      { name: "Maven", level: 80, quip: "mvn clean install, then hope." },
      { name: "JUnit", level: 76, quip: "Green tests, calm mind." },
    ],
  },
  {
    group: "Web & Front-end",
    tone: "sarcastic",
    items: [
      { name: "HTML", level: 92, quip: "Semantic, accessible and only slightly judgmental of div soup." },
      { name: "CSS", level: 85, quip: "Centering a div is now a solved problem. Allegedly." },
      { name: "JavaScript", level: 88, quip: "I know what `this` is. Ask me again tomorrow." },
      { name: "jQuery", level: 80, quip: "The elder statesman of the DOM. Still shows up to work." },
      { name: "TypeScript", level: 80, quip: "Because 'undefined is not a function' should arrive before production.", dummy: true },
      { name: "React / Next.js", level: 84, quip: "Server component or client component? Yes." },
      { name: "Tailwind CSS", level: 82, quip: "Class names long enough to count as a paragraph.", dummy: true },
    ],
  },
  {
    group: "Languages I Went To School With",
    tone: "sarcastic",
    items: [
      { name: "C", level: 70, quip: "Taught me what a segmentation fault feels like." },
      { name: "C++", level: 68, quip: "I understand pointers. They do not understand me." },
      { name: "Python", level: 75, quip: "For when Java feels too formal." },
    ],
  },
  {
    group: "Tools & Platforms",
    tone: "sarcastic",
    items: [
      { name: "Git & Bitbucket", level: 86, quip: "git commit -m 'final fix' (it was not final)." },
      { name: "Jira & Confluence", level: 80, quip: "Moving tickets across columns counts as cardio." },
      { name: "IntelliJ IDEA", level: 85, quip: "Autocomplete is a love language." },
      { name: "Eclipse & VS Code", level: 78, quip: "Different editors, same bugs." },
      { name: "Supabase", level: 78, quip: "Postgres with a nicer hat.", dummy: true },
      { name: "Vercel", level: 80, quip: "Deploys faster than I can second-guess them.", dummy: true },
      { name: "Technical Writing", level: 78, quip: "Explaining AEM so well that people stop asking me." },
    ],
  },
];
