import type { Tone } from "./types";
import { projects } from "./projects";
import { yearsOfExperience } from "./site";

/** Tone: SERIOUS first, then FUNNY, then a little SARCASTIC. */
export const about = {
  headline: "The short version",
  paragraphs: [
    {
      tone: "serious" as Tone,
      text: "I'm Ashish Raj, a Software Engineer at Concentrix Catalyst and a certified Adobe Experience Manager (AEM) developer, with a B.Tech in Computer Science and Engineering from NIST, Odisha. Since 2020 I've been building enterprise websites on AEM, across AEM as a Cloud Service, 6.5 and 6.4.",
    },
    {
      tone: "serious" as Tone,
      text: "On the AEM side I've worked on most of what the platform offers: components with custom dialogs, templates and pages, Sling Models, servlets and OSGi services and configurations, workflows, event handlers and schedulers, Experience Fragments and Content Fragments, email notifications, and digital assets, with JUnit tests to keep it all honest.",
    },
    {
      tone: "funny" as Tone,
      text: "Outside my day job, I build web platforms for clients: YantraStack, a whole toolbox of PDF, image and developer tools in one place, and a library management system on Next.js and Supabase, where I learned that the hardest bug is always the one a member finds at the front desk on a Monday morning.",
    },
    {
      tone: "serious" as Tone,
      text: "I also created AEM Tutorial, a free learning hub for anyone getting to grips with Adobe Experience Manager. It follows a roadmap from the fundamentals (JCR, Sling, OSGi) through components, templates and Sling Models to workflows, Dispatcher, security and headless delivery, calls out where AEM 6.5 and AEM as a Cloud Service differ, and includes scenario-based interview questions drawn from real project work.",
    },
    {
      tone: "sarcastic" as Tone,
      text: "I believe in clean code, meaningful commit messages and documentation that actually gets read. Yes, I know. I also believe in the tooth fairy.",
    },
    {
      tone: "serious" as Tone,
      text: "What I care about most: software that is boring in production and delightful in the browser. If it breaks at 2 a.m., it should at least break politely and tell you why.",
    },
  ],
};

export function getAboutStats() {
  return [
    { label: "Years in tech", value: `${yearsOfExperience()}+` },
    { label: "AEM certifications", value: "3" },
    { label: "Companies", value: "2" },
    { label: "Live projects", value: String(projects.filter((p) => p.status === "Live").length) },
  ];
}

export const quickFacts = [
  { label: "Based in", value: "Buxar, Bihar, India" },
  { label: "Works at", value: "Concentrix Catalyst" },
  { label: "AEM", value: "Cloud Service, 6.5, 6.4" },
  { label: "Core stack", value: "AEM, Java, OSGi, Sling, JavaScript, Next.js, Supabase" },
  { label: "Tools", value: "Git, Maven, IntelliJ IDEA, Jira" },
  { label: "Languages", value: "English, Hindi (and fluent Hinglish)" },
];
