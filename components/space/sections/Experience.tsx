import { experience } from "@/content/experience";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Experience() {
  return (
    <SectorSection id="experience" className="min-h-screen">
      <SectorHeading id="experience" />
      <ol className="relative space-y-8 border-l border-s-line pl-6 sm:pl-10">
        {experience.map((role, index) => (
          <li key={role.id} className="relative">
            <span aria-hidden className="absolute -left-[31px] top-7 h-3 w-3 rounded-full bg-s-cyan shadow-[0_0_14px_var(--s-cyan)] sm:-left-[47px]" />
            <Reveal>
              <article className="space-panel max-w-3xl p-6 sm:p-8" aria-label={`${role.role} at ${role.company}`}>
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">
                  MISSION {String(experience.length - index).padStart(2, "0")} · {role.period.toUpperCase()}
                  {role.current ? " · IN ORBIT" : ""}
                </p>
                <h3 className="mt-3 font-space text-2xl font-semibold sm:text-3xl">{role.role}</h3>
                <p className="mt-1 text-s-dim">{role.company}</p>
                <p className="mt-5 text-base">{role.summary}</p>
                <ul className="mt-4 space-y-2 text-sm sm:text-base">
                  {role.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-s-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {role.stack.map((tech) => (
                    <li key={tech} className="font-hud rounded border border-s-line px-2.5 py-1 text-xs text-s-dim">
                      {tech}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-l-2 border-s-warm pl-4 text-sm italic text-s-dim">Mission note: {role.plotTwist}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectorSection>
  );
}
