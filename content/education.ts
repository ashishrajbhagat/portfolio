import type { Dummyable, Tone } from "./types";

export interface EducationEntry extends Dummyable {
  id: string;
  level: string;
  institute: string;
  location: string;
  period: string;
  /** A short, human explanation of the stage. */
  summary: string;
  /** Shown as "Syllabus highlights". */
  highlights: string[];
}

/**
 * Tone: SERIOUS with a light touch. Degrees, institutes and years are real (from the resume).
 * No marks or CGPA are shown anywhere, on purpose. Summaries and highlight lists are generic placeholders:
 * edit them freely (especially the subjects for Intermediate and Matriculation).
 * Newest first, every stage is shown in the same style.
 */
export const educationEntries: EducationEntry[] = [
  {
    id: "btech",
    level: "B.Tech in Computer Science and Engineering",
    institute: "National Institute of Science & Technology (NIST)",
    location: "Berhampur, Odisha",
    period: "2016 – 2020",
    summary:
      "Four years of algorithms, operating systems, databases and a surprising amount of group projects where one person did everything. I'll let you guess if that was me.",
    highlights: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "Web Technologies",
      "Computer Organization & Architecture",
      "Discrete Mathematics",
      "Theory of Computation",
    ],
    dummy: true,
  },
  {
    id: "intermediate",
    level: "Intermediate in Science",
    institute: "M.V. College",
    location: "Buxar, Bihar",
    period: "2013 – 2015",
    summary:
      "Two years of Science: board exams, long study sessions and the first serious taste of problems that don't have their answer at the back of the book. The bridge between school and engineering.",
    highlights: ["Physics", "Chemistry", "Mathematics", "English", "Hindi"],
    dummy: true,
  },
  {
    id: "matriculation",
    level: "Matriculation",
    institute: "S.V.M.",
    location: "Buxar, Bihar",
    period: "2011 – 2013",
    summary:
      "Where it started. Two foundation years, learning how to learn, and getting through the first big board exam of the journey.",
    highlights: ["Mathematics", "Science", "Social Science", "English", "Hindi"],
    dummy: true,
  },
];

export const educationTone: Tone = "serious";

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expires: string;
  tone: Tone;
  note: string;
}

/** "Issued Jul 2023 · Expires Jul 2027" */
export function certificationDates(cert: Pick<Certification, "issued" | "expires">): string {
  return `Issued ${cert.issued} · Expires ${cert.expires}`;
}

/** Tone: SERIOUS names and dates (real, from the Adobe credentials), FUNNY notes. */
export const certifications: Certification[] = [
  {
    id: "aem-sites-developer",
    title: "Adobe Certified Expert: AEM Sites Developer",
    issuer: "Adobe",
    issued: "Jul 2023",
    expires: "Jul 2027",
    tone: "funny",
    note: "Proof that I can explain the difference between a resource and a node.",
  },
  {
    id: "aem-business-practitioner",
    title: "Adobe Certified Expert: AEM Business Practitioner",
    issuer: "Adobe",
    issued: "Jan 2024",
    expires: "Jul 2027",
    tone: "funny",
    note: "For the part of the job where the question is not how it works, but what the business needs from it.",
  },
  {
    id: "aem-assets-developer",
    title: "Adobe Certified Professional: AEM Assets Developer",
    issuer: "Adobe",
    issued: "Sep 2026",
    expires: "Sep 2028",
    tone: "funny",
    note: "Because someone has to know where the 4,000 hero images went.",
  },
];
