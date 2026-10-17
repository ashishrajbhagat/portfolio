import { about, certificationDates, certifications, educationEntries, flavor, getAboutStats, hero, quickFacts, site, yearsOfExperience } from "@/content";
import Portrait from "@/components/Portrait";
import { bannerLines } from "@/lib/terminal/ascii";
import { Bullets, Comment, Out, TagList } from "./common";

const f = flavor.terminal;
const LABEL_COLORS = ["t-pink", "t-cyan", "t-yellow", "t-orange", "t-purple", "t-green", "t-blue"];

export function Whoami() {
  return (
    <Out>
      <Comment>{f.hero.subtitle}</Comment>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <figure className="shrink-0">
          <Portrait className="h-28 w-28 rounded border-2 border-[color:var(--t-pink)] sm:h-36 sm:w-36" sizes="144px" priority />
          <figcaption className="t-dim mt-1 text-[11px]">profile.png</figcaption>
        </figure>
        <div className="space-y-2">
          <p className="t-gradient text-2xl font-bold sm:text-3xl">{hero.greeting}</p>
          <p>{hero.headline}</p>
          <p className="t-dim">{hero.subheadline}</p>
          <TagList items={hero.roles} />
          <p className="t-green">{hero.status}</p>
        </div>
      </div>
    </Out>
  );
}

export function About() {
  return (
    <Out>
      <Comment>{f.about.subtitle}</Comment>
      {about.paragraphs.map((p) => (
        <p key={p.text} className="max-w-prose">
          {p.text}
        </p>
      ))}
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pt-1">
        {getAboutStats().map((s) => (
          <div key={s.label} className="contents">
            <dt className="t-purple">{s.label}</dt>
            <dd className="t-yellow font-bold">{s.value}</dd>
          </div>
        ))}
        {quickFacts.map((q) => (
          <div key={q.label} className="contents">
            <dt className="t-cyan">{q.label}</dt>
            <dd>{q.value}</dd>
          </div>
        ))}
      </dl>
    </Out>
  );
}

export function Education() {
  return (
    <Out>
      <Comment>{f.education.subtitle}</Comment>
      <ul className="space-y-5">
        {educationEntries.map((entry) => (
          <li key={entry.id} className="space-y-1">
            <p className="t-pink font-bold">{entry.level}</p>
            <p>
              <span className="t-cyan">{entry.institute}</span> <span className="t-dim">· {entry.location} ·</span>{" "}
              <span className="t-yellow">{entry.period}</span>
            </p>
            <p className="max-w-prose">{entry.summary}</p>
            <p className="t-purple">syllabus highlights:</p>
            <Bullets items={entry.highlights} />
          </li>
        ))}
      </ul>
    </Out>
  );
}

export function Certs() {
  return (
    <Out>
      <Comment>{f.certifications.subtitle}</Comment>
      <ul className="space-y-3">
        {certifications.map((c) => (
          <li key={c.id}>
            <CertEntry id={c.id} />
          </li>
        ))}
      </ul>
    </Out>
  );
}

export function CertEntry({ id }: { id: string }) {
  const cert = certifications.find((c) => c.id === id);
  if (!cert) return null;
  return (
    <div>
      <p className="t-pink font-bold">{cert.title}</p>
      <p>
        <span className="t-err" aria-hidden>■</span> <span className="t-cyan">{cert.issuer}</span> <span className="t-dim">·</span>{" "}
        <span className="t-yellow">{certificationDates(cert)}</span>
      </p>
      <p>{cert.note}</p>
    </div>
  );
}

export function Neofetch() {
  const rows: Array<[string, string]> = [
    ["OS", "AshishOS 1.0 (Buxar edition)"],
    ["Host", site.location],
    ["Kernel", "debug-6.0"],
    ["Uptime", `${yearsOfExperience()}+ years in tech`],
    ["Role", "Software Engineer @ Concentrix Catalyst"],
    ["Stack", "AEM, Java, JavaScript, Next.js"],
    ["Shell", "zsh (aliases unfinished)"],
    ["Memory", "1 unread Jira notification"],
  ];
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
      <pre aria-hidden className="t-gradient overflow-x-auto text-[8px] leading-[1.1] sm:text-[10px]">
        {bannerLines.join("\n")}
      </pre>
      <div>
        <p>
          <span className="t-green font-bold">guest</span>
          <span className="t-dim">@</span>
          <span className="t-pink font-bold">ashish-os</span>
        </p>
        <p className="t-dim">----------------</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3">
          {rows.map(([label, value], index) => (
            <div key={label} className="contents">
              <dt className={`${LABEL_COLORS[index % LABEL_COLORS.length]} font-bold`}>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 flex gap-1" aria-hidden>
          {["--t-pink", "--t-orange", "--t-yellow", "--t-accent", "--t-cyan", "--t-blue", "--t-purple"].map((v) => (
            <span key={v} className="inline-block h-3 w-5" style={{ background: `var(${v})` }} />
          ))}
        </p>
      </div>
    </div>
  );
}
