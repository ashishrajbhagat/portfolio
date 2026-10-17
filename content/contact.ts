import type { Tone } from "./types";
import { site } from "./site";

/** Tone: SERIOUS (friendly). This is where people decide to hire you. */
export const resume = {
  tone: "serious" as Tone,
  headline: "The one-page version",
  description:
    "Experience, skills and education in one clean page. No 'rockstar', no 'ninja', no 'synergy'.",
  fileLabel: "Download resume (PDF)",
  url: site.resumeUrl,
  dummy: true, // TODO: add the PDF at public/resume.pdf
};

export const contact = {
  tone: "serious" as Tone,
  headline: "Let's build something worth shipping.",
  body: "Whether it's an AEM project, a full-stack build or a product that needs a developer, my inbox is open. I usually reply within a couple of days.",
  availability:
    "Open to full-time roles, freelance projects and interesting conversations.",
  email: site.email,
  location: site.location,
  cta: { label: "Send an email", href: `mailto:${site.email}` },
  dummy: true, // availability wording is a guess
};
