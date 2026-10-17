import type { ReactNode } from "react";
import { terminalThemes, type TerminalSettings } from "@/lib/terminal/types";
import { displayName, type FsDir } from "@/lib/terminal/fsTree";
import { ExtLink, Out } from "./common";

export interface HelpEntry {
  name: string;
  summary: string;
  usage?: string;
}

export function Help({ commands }: { commands: HelpEntry[] }) {
  return (
    <Out>
      <p className="t-pink font-bold">Available commands</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
        {commands.map((c) => (
          <div key={c.name} className="contents">
            <dt className="t-cyan font-bold">{c.name}</dt>
            <dd>{c.summary}</dd>
          </div>
        ))}
      </dl>
      <p className="t-dim">
        Tips: <span className="t-yellow">Tab</span> completes, <span className="t-yellow">↑ ↓</span> browse history,{" "}
        <span className="t-yellow">Ctrl+L</span> clears. There may be a few secrets. Try <span className="t-yellow">sudo</span>.
      </p>
    </Out>
  );
}

export function Man({ entry }: { entry: HelpEntry }) {
  return (
    <Out>
      <p>
        <span className="t-cyan font-bold">{entry.name}</span> <span className="t-dim">: {entry.summary}</span>
      </p>
      <p>
        <span className="t-purple">usage:</span> <span className="t-yellow">{entry.usage ?? entry.name}</span>
      </p>
    </Out>
  );
}

const FILE_COLORS: Record<string, string> = {
  md: "t-cyan",
  log: "t-yellow",
  txt: "t-fg",
  sh: "t-green",
  cert: "t-pink",
};

function colorFor(node: FsDir["children"][number]): string {
  if (node.type === "dir") return "t-blue font-bold";
  const extension = node.name.split(".").pop() ?? "";
  return FILE_COLORS[extension] ?? "t-fg";
}

/** `ls` output coloured by file type, like a real terminal: directories blue, scripts green, and so on. */
export function Ls({ dir }: { dir: FsDir }) {
  if (dir.children.length === 0) return <p className="t-dim">(empty)</p>;
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {dir.children.map((node) => (
        <li key={node.name} className={colorFor(node)}>
          {displayName(node)}
        </li>
      ))}
    </ul>
  );
}

export function UnknownCommand({ name, suggestion }: { name: string; suggestion: string | null }) {
  return (
    <p>
      <span className="t-err">zsh: command not found: {name}.</span>{" "}
      {suggestion ? (
        <span className="t-dim">
          Did you mean <span className="t-yellow">{suggestion}</span>?
        </span>
      ) : (
        <span className="t-dim">
          Try <span className="t-yellow">help</span>.
        </span>
      )}
    </p>
  );
}

export function ErrorLine({ children }: { children: ReactNode }) {
  return <p className="t-err">{children}</p>;
}

export function History({ items }: { items: string[] }) {
  return (
    <ol className="t-dim">
      {items.map((line, index) => (
        <li key={`${index}-${line}`} className="flex gap-3">
          <span className="w-8 shrink-0 text-right tabular-nums">{index + 1}</span>
          <span className="t-fg">{line}</span>
        </li>
      ))}
    </ol>
  );
}

export function ThemeList({ current }: { current: TerminalSettings["theme"] }) {
  return (
    <Out>
      <p>
        Themes:{" "}
        {terminalThemes.map((name, index) => (
          <span key={name}>
            {index > 0 && ", "}
            <span className={name === current ? "t-green font-bold" : "t-dim"}>{name}</span>
          </span>
        ))}
      </p>
      <p className="t-dim">
        Usage: <span className="t-yellow">theme &lt;name&gt;</span> · toggle scanlines with <span className="t-yellow">crt on|off</span>
      </p>
    </Out>
  );
}

export function HireMe({ href }: { href: string }) {
  return (
    <Out>
      <p className="t-green font-bold">Permission granted. Elevating privileges...</p>
      <p>Excellent choice. The hiring process is the one command that is not read-only.</p>
      <p>
        <span className="t-dim">$</span> mail -s &quot;let&apos;s talk&quot; ashish <span className="t-dim">→</span>{" "}
        <ExtLink href={href}>Send the email</ExtLink>
      </p>
    </Out>
  );
}
