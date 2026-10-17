import type { ReactNode } from "react";

/** A dim italic "# comment" line, used for the flavour subtitle above command output. */
export function Comment({ children }: { children: ReactNode }) {
  return <p className="t-dim italic"># {children}</p>;
}

export function ExtLink({ href, children, download }: { href: string; children: ReactNode; download?: boolean }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className="t-link"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      {children}
    </a>
  );
}

export function Tag({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "warn" | "dim" }) {
  const className = tone === "warn" ? "t-orange" : tone === "dim" ? "t-purple" : "t-green";
  return <span className={className}>[{children}]</span>;
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="t-green select-none" aria-hidden>
            +
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const TAG_COLORS = ["t-blue", "t-purple", "t-cyan", "t-pink", "t-orange"];

/** `[tag] [tag]` list, each tag in a different colour so stacks read like syntax-highlighted code. */
export function TagList({ items }: { items: string[] }) {
  return (
    <p>
      {items.map((item, index) => (
        <span key={item} className={TAG_COLORS[index % TAG_COLORS.length]}>
          {index > 0 && " "}[{item}]
        </span>
      ))}
    </p>
  );
}

export function Out({ children }: { children: ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}
