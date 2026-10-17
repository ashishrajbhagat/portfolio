import { experience } from "@/content/experience";
import { pad2 } from "@/lib/movie/format";
import SceneHeading from "../SceneHeading";

/** Chapter 2: the heading stays in view (sticky on large screens) while each role scrolls past as a full card. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" data-aurora="amber" className="relative px-6 py-28 sm:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SceneHeading id="experience" />
        </div>

        <ol className="space-y-8">
          {experience.map((role, index) => (
            <li key={role.id} data-reveal="">
              <article
                aria-label={`${role.role} at ${role.company}`}
                className="rounded-lg border border-m-line bg-white/[0.025] p-7 sm:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-medium tracking-[0.3em] text-m-amber">{role.period.toUpperCase()}</p>
                    <h3 className="mt-3 font-title text-3xl sm:text-4xl">{role.role}</h3>
                    <p className="mt-1 text-lg text-m-dim">{role.company}</p>
                  </div>
                  <span aria-hidden className="font-title text-5xl leading-none text-m-fg/10 sm:text-6xl">
                    {pad2(index + 1)}
                  </span>
                </div>

                <p className="mt-6 max-w-prose text-base leading-relaxed sm:text-lg">{role.summary}</p>

                <ul className="mt-5 space-y-2.5 text-sm text-m-fg/90 sm:text-base">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-m-amber" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {role.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-m-line px-3 py-1 text-xs text-m-dim">
                      {tech}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 border-l border-m-amber/60 pl-4 text-sm italic text-m-dim">
                  Director&apos;s note: {role.plotTwist}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
