import type { ReactNode } from "react";
import { funFacts, site } from "@/content";
import {
  About, CertEntry, Certs, Education, Neofetch, Whoami,
} from "@/components/terminal/outputs/profile";
import { Experience, ProjectDetail, ProjectList, Skills } from "@/components/terminal/outputs/work";
import { Contact, Credits, Fortune, Resume, Reviews } from "@/components/terminal/outputs/fun";
import {
  ErrorLine, Help, HireMe, History, Ls, Man, ThemeList, type HelpEntry,
} from "@/components/terminal/outputs/system";
import { displayName, getNode, root, type FsDir } from "./fsTree";
import { getOpenTargets } from "./openTargets";
import { absolutePath, resolvePath } from "./path";
import { projects } from "@/content/projects";
import { terminalThemes, type Command, type CommandResult, type TerminalThemeName } from "./types";

const error = (message: ReactNode): CommandResult => ({ error: true, output: <ErrorLine>{message}</ErrorLine> });

/** Renders the file behind a virtual filesystem `target` (see fsTree.ts). */
function renderTarget(target: string): ReactNode {
  if (target.startsWith("project:")) return <ProjectDetail id={target.slice("project:".length)} />;
  if (target.startsWith("cert:")) return <CertEntry id={target.slice("cert:".length)} />;

  switch (target) {
    case "about": return <About />;
    case "experience": return <Experience />;
    case "skills": return <Skills />;
    case "education": return <Education />;
    case "fortune": return <Fortune fact={pickFact()} />;
    case "reviews": return <Reviews />;
    case "contact": return <Contact />;
    case "credits": return <Credits />;
    case "resume": return <Resume />;
    default: return null;
  }
}

function pickFact() {
  const items = funFacts.items;
  return items[Math.floor(Math.random() * items.length)];
}

function isTheme(value: string): value is TerminalThemeName {
  return (terminalThemes as readonly string[]).includes(value);
}

const trapped = (editor: string): Command => ({
  name: editor,
  hidden: true,
  summary: "Definitely not an editor",
  run: () => ({
    output: (
      <p>
        You are now trapped in {editor}. Press <span className="t-accent">Esc</span>, then type{" "}
        <span className="t-accent">:q!</span> to escape. (This is a portfolio. Nothing here is editable. You are free.)
      </p>
    ),
  }),
});

export const commands: Command[] = [
  {
    name: "help",
    aliases: ["?"],
    summary: "List available commands",
    run: () => ({ output: <Help commands={visibleCommands()} /> }),
  },
  { name: "whoami", summary: "Who is Ashish?", run: () => ({ output: <Whoami /> }) },
  { name: "about", summary: "Read about.md", run: () => ({ output: <About /> }) },
  {
    name: "experience",
    aliases: ["log"],
    summary: "Career history, git log style",
    run: () => ({ output: <Experience /> }),
  },
  {
    name: "projects",
    summary: "List projects, or show one",
    usage: "projects [name]",
    run: (args) => {
      if (!args[0]) return { output: <ProjectList /> };
      const project = projects.find((p) => p.id === args[0]);
      if (!project) return error(`projects: no such project: ${args[0]}. Run \`projects\` to see the list.`);
      return { output: <ProjectDetail id={project.id} /> };
    },
  },
  { name: "skills", summary: "Skills, with honest commentary", run: () => ({ output: <Skills /> }) },
  { name: "education", summary: "Degree and coursework", run: () => ({ output: <Education /> }) },
  { name: "certs", summary: "Certifications", run: () => ({ output: <Certs /> }) },
  { name: "fortune", summary: "A random fact about Ashish", run: () => ({ output: <Fortune fact={pickFact()} /> }) },
  { name: "reviews", summary: "What people (and ducks) say", run: () => ({ output: <Reviews /> }) },
  { name: "resume", summary: "Get the resume", run: () => ({ output: <Resume /> }) },
  { name: "contact", summary: "Get in touch", run: () => ({ output: <Contact /> }) },
  { name: "credits", summary: "Roll the credits", run: () => ({ output: <Credits /> }) },
  { name: "neofetch", summary: "System information", run: () => ({ output: <Neofetch /> }) },
  {
    name: "ls",
    aliases: ["ll", "dir"],
    summary: "List directory contents",
    usage: "ls [path]",
    run: (args, ctx) => {
      const target = args.find((a) => !a.startsWith("-")) ?? ".";
      const node = getNode(root, resolvePath(ctx.cwd, target));
      if (!node) return error(`ls: cannot access '${target}': No such file or directory`);
      if (node.type === "file") return { output: <p>{displayName(node)}</p> };
      return { output: <Ls dir={node as FsDir} /> };
    },
  },
  {
    name: "cd",
    summary: "Change directory",
    usage: "cd [path]",
    run: (args, ctx) => {
      const target = args[0] ?? "~";
      const path = resolvePath(ctx.cwd, target);
      const node = getNode(root, path);
      if (!node) return error(`cd: no such file or directory: ${target}`);
      if (node.type !== "dir") return error(`cd: not a directory: ${target}`);
      return { effects: [{ type: "cd", path }] };
    },
  },
  {
    name: "cat",
    summary: "Print a file",
    usage: "cat <file>",
    run: (args, ctx) => {
      if (!args[0]) return error("cat: missing file operand");
      const node = getNode(root, resolvePath(ctx.cwd, args[0]));
      if (!node) return error(`cat: ${args[0]}: No such file or directory`);
      if (node.type === "dir") return error(`cat: ${args[0]}: Is a directory`);
      return { output: renderTarget(node.target) };
    },
  },
  { name: "pwd", summary: "Print working directory", run: (_, ctx) => ({ output: <p>{absolutePath(ctx.cwd)}</p> }) },
  {
    name: "open",
    summary: "Open a project or link in a new tab",
    usage: "open <project | linkedin | github | resume | email>",
    run: (args) => {
      const targets = getOpenTargets();
      if (!args[0]) return error(`open: missing target. Available: ${Object.keys(targets).join(", ")}`);
      const url = targets[args[0]];
      if (!url) return error(`open: unknown target: ${args[0]}. Available: ${Object.keys(targets).join(", ")}`);
      return { output: <p className="t-dim">Opening {args[0]}...</p>, effects: [{ type: "open", url }] };
    },
  },
  { name: "history", summary: "Show command history", run: (_, ctx) => ({ output: <History items={ctx.history} /> }) },
  {
    name: "echo",
    summary: "Print text",
    usage: "echo [text]",
    run: (args) => ({ output: <p>{args.join(" ")}</p> }),
  },
  {
    name: "date",
    summary: "Print the date and time",
    run: () => ({ output: <p>{new Date().toString()}</p> }),
  },
  {
    name: "theme",
    summary: "Change colours (neon, green, amber, ice)",
    usage: "theme [neon|green|amber|ice]",
    run: (args, ctx) => {
      if (!args[0]) return { output: <ThemeList current={ctx.settings.theme} /> };
      if (!isTheme(args[0])) return error(`theme: unknown theme '${args[0]}'. Choose: ${terminalThemes.join(", ")}`);
      return { output: <p className="t-dim">Theme set to {args[0]}.</p>, effects: [{ type: "theme", value: args[0] }] };
    },
  },
  {
    name: "crt",
    summary: "Toggle the scanline effect",
    usage: "crt [on|off]",
    run: (args, ctx) => {
      const value = args[0] === "on" ? true : args[0] === "off" ? false : args[0] === undefined ? !ctx.settings.crt : null;
      if (value === null) return error("crt: usage: crt [on|off]");
      return { output: <p className="t-dim">CRT effect {value ? "on" : "off"}.</p>, effects: [{ type: "crt", value }] };
    },
  },
  { name: "clear", aliases: ["cls"], summary: "Clear the screen (Ctrl+L)", run: () => ({ effects: [{ type: "clear" }] }) },
  { name: "plain", summary: "Switch to the plain, readable view", run: () => ({ effects: [{ type: "plain" }] }) },
  {
    name: "reboot",
    summary: "Replay the boot sequence",
    run: () => ({ output: <p className="t-warn">Rebooting...</p>, effects: [{ type: "reboot" }] }),
  },
  {
    name: "exit",
    aliases: ["logout", "quit"],
    summary: "Log out and pick another profile",
    run: () => ({ output: <p className="t-dim">logout. Taking you back to the profiles...</p>, effects: [{ type: "exit" }] }),
  },
  {
    name: "man",
    summary: "Show help for one command",
    usage: "man <command>",
    run: (args) => {
      if (!args[0]) return error("What manual page do you want? Try `man projects`.");
      const command = findCommand(args[0]);
      if (!command) return error(`No manual entry for ${args[0]}.`);
      return { output: <Man entry={toHelpEntry(command)} /> };
    },
  },
  {
    name: "git",
    hidden: true,
    summary: "Version control",
    run: (args) => {
      if (args[0] === "log") return { output: <Experience /> };
      if (args[0] === "blame") {
        return { output: <p>Blame assigned to: nobody. It was working on my system.</p> };
      }
      return error("fatal: not a git repository (it's a portfolio). Try `git log`.");
    },
  },
  {
    name: "sudo",
    hidden: true,
    summary: "Run a command as superuser",
    run: (args) => {
      if (args[0] === "hire-me") return { output: <HireMe href={`mailto:${site.email}`} /> };
      if (!args[0]) return error("usage: sudo <command>");
      return error("guest is not in the sudoers file. This incident will be reported to Ashish (he will probably laugh).");
    },
  },
  {
    name: "rm",
    hidden: true,
    summary: "Remove files",
    run: (args) =>
      args.includes("-rf") || args.includes("-fr")
        ? error("rm: nice try. Ashish keeps backups. Also backups of the backups.")
        : error("rm: cannot remove: Permission denied (this portfolio is read-only)."),
  },
  {
    name: "bug",
    hidden: true,
    summary: "Report a bug",
    run: () => ({ output: <p>Status: <span className="t-yellow">closed</span>. Reason: it&apos;s not a bug, it&apos;s a feature.</p> }),
  },
  trapped("vim"),
  trapped("vi"),
  trapped("nano"),
  trapped("emacs"),
];

function toHelpEntry(command: Command): HelpEntry {
  return { name: command.name, summary: command.summary, usage: command.usage };
}

export function visibleCommands(): HelpEntry[] {
  return commands.filter((c) => !c.hidden).map(toHelpEntry);
}

export function commandNames(): string[] {
  return commands.filter((c) => !c.hidden).map((c) => c.name);
}

export function findCommand(name: string): Command | undefined {
  const wanted = name.toLowerCase();
  return commands.find((c) => c.name === wanted || c.aliases?.includes(wanted));
}
