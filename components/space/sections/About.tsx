import { about, getAboutStats, quickFacts } from "@/content/about";
import Portrait from "@/components/Portrait";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";
import SpaceCountUp from "../SpaceCountUp";

export default function About() {
  return (
    <SectorSection id="about" className="min-h-screen">
      <SectorHeading id="about" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-5">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.text}>
              <article className="space-panel p-6 sm:p-7">
                <p className="font-hud mb-2 text-[11px] tracking-[0.3em] text-s-cyan">TRANSMISSION {String(index + 1).padStart(2, "0")}</p>
                <p className="text-base leading-relaxed sm:text-lg">{paragraph.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="lg:pl-6">
          <div className="space-panel p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-5">
              <div className="relative shrink-0">
                <span aria-hidden className="orbit-ring absolute -inset-2 rounded-full border border-dashed border-s-cyan/60" />
                <Portrait className="h-24 w-24 rounded-full ring-2 ring-s-accent" sizes="96px" priority />
              </div>
              <div>
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">COMMANDER</p>
                <p className="font-space text-xl font-semibold">Ashish Raj</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-5">
              {getAboutStats().map((stat) => (
                <div key={stat.label}>
                  <dd className="font-space text-4xl font-semibold text-s-warm">
                    <SpaceCountUp value={stat.value} />
                  </dd>
                  <dt className="mt-1 text-sm text-s-dim">{stat.label}</dt>
                </div>
              ))}
            </dl>
            <dl className="mt-7 space-y-2 border-t border-s-line pt-5 text-sm">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="flex gap-3">
                  <dt className="w-24 shrink-0 text-s-dim">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </SectorSection>
  );
}
