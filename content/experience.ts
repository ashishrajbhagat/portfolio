import type { Dummyable, Tone } from "./types";

export interface Role extends Dummyable {
  id: string;
  company: string;
  role: string;
  period: string;
  current?: boolean;
  tone: Tone;
  summary: string;
  highlights: string[];
  stack: string[];
  /** One-liner that adds personality. Shown in a smaller, lighter style. */
  plotTwist: string;
}

/**
 * Tone: SERIOUS (it's your career), with one witty "plot twist" per role.
 * Titles, companies, dates and highlights come from the resume. Add measurable results when you have them.
 */
export const experience: Role[] = [
  {
    id: "concentrix",
    company: "Concentrix Catalyst",
    role: "Software Engineer",
    period: "Apr 2022 – Present",
    current: true,
    tone: "serious",
    summary:
      "Building and maintaining enterprise websites on Adobe Experience Manager: from the component and its dialog to the template, the page and the Java services behind them.",
    highlights: [
      "Build AEM solutions from scratch, and keep existing components up to date as requirements change.",
      "Create components with custom dialogs, plus templates and pages that content authors can work with comfortably.",
      "Write servlets, OSGi services and Sling Models, with configuration managed through OSGi.",
      "Work across AEM as a Cloud Service, 6.5 and 6.4 projects, and handle the differences between them.",
      "Reuse content with Experience Fragments and Content Fragments.",
      "Automate content processes with workflows, event handlers and schedulers.",
      "Cover models and servlets with JUnit tests to keep releases stable.",
      "Troubleshoot and fix bugs across author and publish, from logs to caching.",
      "Hold three Adobe certifications: AEM Sites Developer, Business Practitioner and Assets Developer.",
    ],
    stack: [
      "AEM (Cloud Service, 6.5, 6.4)", "Java", "OSGi", "Apache Sling", "Sling Models", "Servlets", "Workflows",
      "JUnit", "Maven", "Git", "Bitbucket", "Jira",
    ],
    plotTwist:
      "Learned that 'the author can't see the page' is rarely a cache problem. It is also never not a cache problem.",
  },
  {
    id: "ta-digital",
    company: "TA Digital",
    role: "Associate Software Engineer",
    period: "Aug 2020 – Apr 2022",
    tone: "serious",
    summary:
      "Started my career on AEM projects and learned the platform end to end: from components and templates to workflows and schedulers.",
    highlights: [
      "Moved from fixes to building features from scratch, and developed and updated components along the way.",
      "Created pages and templates, and built Experience Fragments and Content Fragments.",
      "Built the email templates that go out to users after an action.",
      "Wrote servlets, services and models for the backend logic behind components.",
      "Built workflows, event handlers and schedulers to automate repeatable tasks.",
      "Wrote JUnit tests for models and servlets.",
      "Troubleshot and fixed bugs, and learned to read logs like a novel.",
    ],
    stack: [
      "AEM", "Java", "OSGi", "Servlets", "Sling Models", "Workflows", "Experience Fragments", "Content Fragments",
      "JUnit", "Git",
    ],
    plotTwist:
      "My first commit message was 'fix'. Mentors have since helped me evolve.",
  },
];
