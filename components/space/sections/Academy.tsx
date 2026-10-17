import { educationEntries } from "@/content/education";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Academy() {
  return (
    <SectorSection id="education">
      <SectorHeading id="education" />
      <div className="space-y-8">
        {educationEntries.map((entry) => (
          <Reveal key={entry.id}>
            <article
              aria-label={`${entry.level}, ${entry.institute}`}
              className="space-panel grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]"
            >
              <div>
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">{entry.period}</p>
                <h3 className="mt-3 font-space text-3xl font-semibold sm:text-4xl">{entry.level}</h3>
                <p className="mt-2 text-lg text-s-dim">
                  {entry.institute}, {entry.location}
                </p>
                <p className="mt-5 max-w-prose text-base leading-relaxed">{entry.summary}</p>
              </div>
              <div>
                <p className="font-hud mb-3 text-[11px] tracking-[0.3em] text-s-dim">SYLLABUS HIGHLIGHTS</p>
                <ol className="space-y-2">
                  {entry.highlights.map((item, index) => (
                    <li key={item} className="flex items-baseline gap-3 border-b border-s-line pb-2">
                      <span className="font-hud text-xs text-s-cyan">M{String(index + 1).padStart(2, "0")}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectorSection>
  );
}
