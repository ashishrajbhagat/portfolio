import type { CSSProperties } from "react";
import { experience, flavor, projects, site, skillGroups } from "@/content";
import { fakeCommitHash } from "@/lib/terminal/hash";
import { Bullets, Comment, ExtLink, Out, Tag, TagList } from "./common";

const f = flavor.terminal;

export function Experience() {
  return (
    <Out>
      <Comment>{f.experience.subtitle}</Comment>
      <ul className="space-y-5">
        {experience.map((role) => (
          <li key={role.id} className="space-y-1">
            <p>
              <span className="t-yellow">commit {fakeCommitHash(role.id)}</span>
              {role.current && (
                <span>
                  {" "}
                  (<span className="t-cyan font-bold">HEAD</span> <span className="t-dim">-&gt;</span>{" "}
                  <span className="t-green font-bold">main</span>)
                </span>
              )}
            </p>
            <p>
              <span className="t-purple">Author:</span> <span className="t-dim">{site.name} &lt;{site.email}&gt;</span>
            </p>
            <p>
              <span className="t-purple">Date:</span>   <span className="t-dim">{role.period}</span>
            </p>
            <div className="space-y-2 pl-4 pt-1 sm:pl-6">
              <p className="font-bold">
                <span className="t-pink">{role.role}</span> <span className="t-dim">·</span>{" "}
                <span className="t-cyan">{role.company}</span>
              </p>
              <p className="max-w-prose">{role.summary}</p>
              <Bullets items={role.highlights} />
              <TagList items={role.stack} />
              <p className="t-dim italic">// plot twist: {role.plotTwist}</p>
            </div>
          </li>
        ))}
      </ul>
    </Out>
  );
}

const statusTone = { Live: "accent", "In progress": "warn", Prototype: "dim" } as const;

export function ProjectList() {
  return (
    <Out>
      <Comment>{f.projects.subtitle}</Comment>
      <ul className="space-y-3">
        {projects.map((p) => (
          <li key={p.id}>
            <p>
              <span className="t-blue font-bold">{p.id}/</span> <Tag tone={statusTone[p.status]}>{p.status}</Tag>
            </p>
            <p className="t-dim pl-4">{p.tagline}</p>
          </li>
        ))}
      </ul>
      <p className="t-dim">
        Try: <span className="t-yellow">projects &lt;name&gt;</span> for details, <span className="t-yellow">open &lt;name&gt;</span> to
        visit.
      </p>
    </Out>
  );
}

export function ProjectDetail({ id }: { id: string }) {
  const p = projects.find((project) => project.id === id);
  if (!p) return null;
  const links = [
    p.links.live && p.links.live !== "#" ? { label: "live", href: p.links.live } : null,
    p.links.repo && p.links.repo !== "#" ? { label: "repo", href: p.links.repo } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <Out>
      <p>
        <span className="t-pink text-lg font-bold">{p.title}</span> <Tag tone={statusTone[p.status]}>{p.status}</Tag>
      </p>
      <p className="t-dim italic">{p.tagline}</p>
      <p className="max-w-prose">{p.description}</p>
      <Bullets items={p.highlights} />
      {p.stack.length > 0 && <TagList items={p.stack} />}
      {links.length > 0 && (
        <p>
          {links.map((link, index) => (
            <span key={link.label}>
              {index > 0 && "  "}
              <span className="t-purple">{link.label}:</span> <ExtLink href={link.href}>{link.href}</ExtLink>
            </span>
          ))}
        </p>
      )}
    </Out>
  );
}

function SkillRow({ name, level, quip, index }: { name: string; level: number; quip: string; index: number }) {
  return (
    <li className="grid grid-cols-[minmax(0,8.5rem)_1fr_2.75rem] items-center gap-x-3 sm:grid-cols-[minmax(0,11rem)_1fr_3rem]">
      <span className="truncate">{name}</span>
      <span className="skill-track" role="img" aria-label={`${name}: ${level} percent`}>
        <span className="skill-fill" style={{ width: `${level}%`, "--d": `${index * 45}ms` } as CSSProperties} />
      </span>
      <span className="t-yellow text-right tabular-nums">{level}%</span>
      <span className="t-dim col-span-3 pb-2 pt-0.5 text-[0.92em]">{quip}</span>
    </li>
  );
}

export function Skills() {
  return (
    <Out>
      <Comment>{f.skills.subtitle}</Comment>
      {skillGroups.map((group) => (
        <section key={group.group} aria-label={group.group}>
          <p className="t-purple font-bold">## {group.group}</p>
          <ul className="mt-1">
            {group.items.map((skill, index) => (
              <SkillRow key={skill.name} name={skill.name} level={skill.level} quip={skill.quip} index={index} />
            ))}
          </ul>
        </section>
      ))}
    </Out>
  );
}
