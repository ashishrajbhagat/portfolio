import {
  contact, credits, flavor, resume, socialLinks, testimonials, type FunFact,
} from "@/content";
import { Comment, ExtLink, Out } from "./common";

const f = flavor.terminal;

export function Fortune({ fact }: { fact: FunFact }) {
  return (
    <Out>
      <Comment>{f.funFacts.subtitle}</Comment>
      <p className="max-w-prose">
        <span aria-hidden>{fact.emoji} </span>
        {fact.text}
      </p>
      <p className="t-dim">(run `fortune` again for another)</p>
    </Out>
  );
}

export function Reviews() {
  return (
    <Out>
      <Comment>{f.testimonials.subtitle}</Comment>
      <ul className="space-y-3">
        {testimonials.items.map((t) => (
          <li key={t.name}>
            <p>
              <span className="t-orange">[REVIEW]</span> <span className="t-cyan font-bold">{t.name}</span>{" "}
              <span className="t-dim">({t.title})</span>
            </p>
            <p className="max-w-prose pl-4">&ldquo;{t.quote}&rdquo;</p>
          </li>
        ))}
      </ul>
    </Out>
  );
}

export function Resume() {
  return (
    <Out>
      <Comment>{f.resume.subtitle}</Comment>
      <p className="t-pink font-bold">{resume.headline}</p>
      <p className="max-w-prose">{resume.description}</p>
      <p>
        <span className="t-dim">$</span> ./download-resume.sh <span className="t-dim">→</span>{" "}
        <ExtLink href={resume.url} download>
          {resume.fileLabel}
        </ExtLink>
      </p>
    </Out>
  );
}

export function Contact() {
  const links = socialLinks.filter((link) => link.url && link.url !== "#");
  return (
    <Out>
      <Comment>{f.contact.subtitle}</Comment>
      <p className="t-pink text-lg font-bold">{contact.headline}</p>
      <p className="max-w-prose">{contact.body}</p>
      <p className="t-dim">{contact.availability}</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 pt-1">
        <dt className="t-purple">email</dt>
        <dd>
          <ExtLink href={contact.cta.href}>{contact.email}</ExtLink>
        </dd>
        <dt className="t-purple">location</dt>
        <dd>{contact.location}</dd>
        {links.map((link) => (
          <div key={link.id} className="contents">
            <dt className="t-purple">{link.id}</dt>
            <dd>
              <ExtLink href={link.url}>{link.url.replace(/^https?:\/\//, "")}</ExtLink>
            </dd>
          </div>
        ))}
      </dl>
    </Out>
  );
}

export function Credits() {
  return (
    <Out>
      <Comment>{f.credits.subtitle}</Comment>
      <dl className="grid grid-cols-1 gap-y-1 sm:grid-cols-[11rem_1fr] sm:gap-x-4">
        {credits.items.map((c) => (
          <div key={c.role} className="contents">
            <dt className="t-purple">{c.role}</dt>
            <dd>{c.name}</dd>
          </div>
        ))}
      </dl>
      <p className="t-dim italic">{credits.postCredits}</p>
    </Out>
  );
}
