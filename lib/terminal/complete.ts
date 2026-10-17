import { projects } from "@/content/projects";
import { displayName, getNode, root } from "./fsTree";
import { openTargetNames } from "./openTargets";
import { resolvePath } from "./path";
import { commonPrefix } from "./suggest";
import { terminalThemes } from "./types";

export interface Completion {
  /** New input value after completing as far as is unambiguous. */
  value: string;
  /** All candidates that matched (full words). */
  matches: string[];
}

const PATH_COMMANDS = new Set(["cat", "cd", "ls", "ll", "dir"]);
const DIRECTORY_ONLY = new Set(["cd"]);

function argumentCandidates(command: string, commandNames: string[]): string[] {
  switch (command) {
    case "open":
      return openTargetNames();
    case "projects":
      return projects.map((p) => p.id);
    case "theme":
      return [...terminalThemes];
    case "crt":
      return ["on", "off"];
    case "help":
    case "man":
      return commandNames;
    default:
      return [];
  }
}

/** Tab completion for command names, paths and a few command arguments. */
export function complete(input: string, cwd: string[], commandNames: string[]): Completion | null {
  const lastSpace = input.lastIndexOf(" ");
  const head = lastSpace === -1 ? "" : input.slice(0, lastSpace + 1);
  const word = lastSpace === -1 ? input : input.slice(lastSpace + 1);
  const command = head.trim().split(/\s+/)[0] ?? "";

  let candidates: string[];
  if (head === "") {
    candidates = commandNames;
  } else if (PATH_COMMANDS.has(command)) {
    const slash = word.lastIndexOf("/");
    const dirPart = slash === -1 ? "" : word.slice(0, slash + 1);
    const dir = getNode(root, resolvePath(cwd, dirPart || "."));
    if (!dir || dir.type !== "dir") return null;
    candidates = dir.children
      .filter((child) => !DIRECTORY_ONLY.has(command) || child.type === "dir")
      .map((child) => dirPart + displayName(child));
  } else {
    candidates = argumentCandidates(command, commandNames);
  }

  const matches = candidates.filter((candidate) => candidate.startsWith(word));
  if (matches.length === 0) return null;

  if (matches.length === 1) {
    const only = matches[0];
    return { value: head + only + (only.endsWith("/") ? "" : " "), matches };
  }
  return { value: head + commonPrefix(matches), matches };
}
