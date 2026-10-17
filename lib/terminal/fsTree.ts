import { certifications } from "@/content/education";
import { projects } from "@/content/projects";

export interface FsFile {
  type: "file";
  name: string;
  /** Identifies which output `cat` renders, e.g. "about" or "project:udaan-library". */
  target: string;
}

export interface FsDir {
  type: "dir";
  name: string;
  children: FsNode[];
}

export type FsNode = FsFile | FsDir;

const file = (name: string, target: string): FsFile => ({ type: "file", name, target });

/** The virtual home directory. Built from content so new projects and certs appear automatically. */
export const root: FsDir = {
  type: "dir",
  name: "~",
  children: [
    file("about.md", "about"),
    file("experience.log", "experience"),
    file("skills.txt", "skills"),
    file("education.txt", "education"),
    file("fortune.txt", "fortune"),
    file("reviews.log", "reviews"),
    file("contact.txt", "contact"),
    file("credits.txt", "credits"),
    file("resume.sh", "resume"),
    { type: "dir", name: "projects", children: projects.map((p) => file(`${p.id}.md`, `project:${p.id}`)) },
    { type: "dir", name: "certs", children: certifications.map((c) => file(`${c.id}.cert`, `cert:${c.id}`)) },
  ],
};

export function getNode(start: FsDir, segments: string[]): FsNode | null {
  let node: FsNode = start;
  for (const segment of segments) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children.find((child) => child.name === segment);
    if (!next) return null;
    node = next;
  }
  return node;
}

export function displayName(node: FsNode): string {
  return node.type === "dir" ? `${node.name}/` : node.name;
}
