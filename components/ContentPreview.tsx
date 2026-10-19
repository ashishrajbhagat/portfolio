import type { ReactNode } from "react";
import Portrait from "@/components/Portrait";
import {
  about, certificationDates, certifications, contact, credits, educationEntries, experience, flavor, funFacts, getAboutStats, hero,
  projects, quickFacts, resume, sectionOrder, sectionTones, skillGroups, socialLinks, testimonials,
  type SectionKey, type ThemeKey,
} from "@/content";

function Placeholder() {
  return (
    <span className="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 align-middle text-[11px] font-normal text-amber-300">
      placeholder
    </span>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-neutral-300">{children}</span>;
}

function Section({ id, theme, children, dummy }: { id: SectionKey; theme: ThemeKey; children: ReactNode; dummy?: boolean }) {
  const f = flavor[theme][id];
  return (
    <section id={id} className="scroll-mt-20 border-t border-white/10 py-14">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        {f.title}
        {dummy && <Placeholder />}
      </h2>
      <p className="mt-2 max-w-prose text-neutral-400">{f.subtitle}</p>
      <p className="mt-2 text-xs text-neutral-600">Voice: {sectionTones[id].join(" + ")}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function ContentPreview({ theme }: { theme: ThemeKey }) {
  const views: Record<SectionKey, ReactNode> = {
    hero: (
      <div>
        <Portrait className="mb-6 h-32 w-32 rounded-full ring-2 ring-white/20" sizes="128px" priority />
        <p className="font-display text-5xl font-bold sm:text-7xl">{hero.greeting}</p>
        <p className="mt-4 max-w-prose text-xl text-neutral-200">{hero.headline}</p>
        <p className="mt-3 max-w-prose text-neutral-400">{hero.subheadline}</p>
        <div className="mt-5 flex flex-wrap gap-2">{hero.roles.map((r) => <Chip key={r}>{r}</Chip>)}</div>
        <p className="mt-5 text-sm text-neutral-500">{hero.status}</p>
      </div>
    ),
    about: (
      <div className="space-y-5">
        {about.paragraphs.map((p) => (
          <p key={p.text} className="max-w-prose leading-relaxed text-neutral-300">{p.text}</p>
        ))}
        <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
          {getAboutStats().map((s) => (
            <div key={s.label} className="rounded-md border border-white/10 p-4">
              <p className="font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
        <dl className="grid gap-2 pt-2 text-sm sm:grid-cols-2">
          {quickFacts.map((q) => (
            <div key={q.label} className="flex gap-2">
              <dt className="text-neutral-500">{q.label}:</dt>
              <dd className="text-neutral-200">{q.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    ),
    experience: (
      <div className="space-y-8">
        {experience.map((r) => (
          <article key={r.id} className="rounded-md border border-white/10 p-6">
            <h3 className="font-display text-2xl font-semibold">
              {r.role}, {r.company}
              {r.dummy && <Placeholder />}
            </h3>
            <p className="text-sm text-neutral-500">{r.period}{r.current ? " (current)" : ""}</p>
            <p className="mt-3 max-w-prose text-neutral-300">{r.summary}</p>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-neutral-300">
              {r.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">{r.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
            <p className="mt-4 text-sm italic text-neutral-500">Plot twist: {r.plotTwist}</p>
          </article>
        ))}
      </div>
    ),
    projects: (
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-md border border-white/10">
            <div className="p-5">
              <h3 className="font-display text-xl font-semibold">
                {p.title}
                {p.dummy && <Placeholder />}
              </h3>
              <p className="text-sm text-neutral-500">{p.status}</p>
              <p className="mt-2 italic text-neutral-400">{p.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">{p.description}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-400">
                {p.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">{p.stack.map((s) => <Chip key={s}>{s}</Chip>)}</div>
              <p className="mt-3 text-xs text-neutral-500">
                {p.links.live && <>Live: {p.links.live} </>}
                {p.links.repo && <>Repo: {p.links.repo}</>}
                {!p.links.live && !p.links.repo && "No links yet"}
              </p>
            </div>
          </article>
        ))}
      </div>
    ),
    skills: (
      <div className="space-y-8">
        {skillGroups.map((g) => (
          <div key={g.group}>
            <h3 className="font-display text-xl font-semibold">{g.group}</h3>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {g.items.map((s) => (
                <li key={s.name} className="rounded-md border border-white/10 p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium">{s.name}{s.dummy && <Placeholder />}</span>
                    <span className="text-xs text-neutral-500">{s.level}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded bg-white/10">
                    <div className="h-full rounded" style={{ width: `${s.level}%`, background: "var(--accent)" }} />
                  </div>
                  <p className="mt-2 text-sm text-neutral-400">{s.quip}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
    education: (
      <div className="space-y-6">
        {educationEntries.map((entry) => (
          <div key={entry.id} className="rounded-md border border-white/10 p-6">
            <h3 className="font-display text-2xl font-semibold">
              {entry.level}
              {entry.dummy && <Placeholder />}
            </h3>
            <p className="text-neutral-400">
              {entry.institute}, {entry.location} · {entry.period}
            </p>
            <p className="mt-3 max-w-prose text-neutral-300">{entry.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.highlights.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    certifications: (
      <ul className="grid gap-4 sm:grid-cols-3">
        {certifications.map((c) => (
          <li key={c.id} className="rounded-md border border-white/10 p-5">
            <p className="font-medium">{c.title}</p>
            <p className="text-sm text-neutral-500">{c.issuer} · {certificationDates(c)}</p>
            <p className="mt-2 text-sm text-neutral-400">{c.note}</p>
          </li>
        ))}
      </ul>
    ),
    funFacts: (
      <ul className="grid gap-3 sm:grid-cols-2">
        {funFacts.items.map((f) => (
          <li key={f.text} className="rounded-md border border-white/10 p-4 text-neutral-300">
            <span className="mr-2">{f.emoji}</span>{f.text}
          </li>
        ))}
      </ul>
    ),
    testimonials: (
      <ul className="grid gap-4 sm:grid-cols-2">
        {testimonials.items.map((t) => (
          <li key={t.name} className="rounded-md border border-white/10 p-5">
            <p className="text-neutral-200">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-3 text-sm font-medium">{t.name}</p>
            <p className="text-xs text-neutral-500">{t.title}</p>
          </li>
        ))}
      </ul>
    ),
    resume: (
      <div>
        <p className="font-display text-xl font-semibold">{resume.headline}</p>
        <p className="mt-2 max-w-prose text-neutral-400">{resume.description}</p>
        <p className="mt-4 inline-block rounded border border-white/25 px-4 py-2 text-sm">
          {resume.fileLabel} → {resume.url}
        </p>
      </div>
    ),
    contact: (
      <div>
        <p className="font-display text-2xl font-semibold">{contact.headline}</p>
        <p className="mt-3 max-w-prose text-neutral-300">{contact.body}</p>
        <p className="mt-3 text-neutral-400">{contact.availability}</p>
        <p className="mt-4 text-neutral-200">{contact.email} · {contact.location}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {socialLinks.map((l) => (
            <li key={l.id}><Chip>{l.label}{l.dummy && <Placeholder />}</Chip></li>
          ))}
        </ul>
      </div>
    ),
    credits: (
      <div>
        <dl className="space-y-2">
          {credits.items.map((c) => (
            <div key={c.role} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="w-44 shrink-0 text-neutral-500">{c.role}</dt>
              <dd className="text-neutral-200">{c.name}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm italic text-neutral-500">{credits.postCredits}</p>
      </div>
    ),
  };

  const dummyBySection: Partial<Record<SectionKey, boolean>> = {
    funFacts: funFacts.dummy,
    testimonials: testimonials.dummy,
    credits: credits.dummy,
  };

  return (
    <div>
      {sectionOrder.map((id) => (
        <Section key={id} id={id} theme={theme} dummy={dummyBySection[id]}>
          {views[id]}
        </Section>
      ))}
    </div>
  );
}
