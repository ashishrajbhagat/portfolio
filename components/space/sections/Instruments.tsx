import type { CSSProperties } from "react";
import { skillGroups } from "@/content/skills";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Gauge({ level, name }: { level: number; name: string }) {
  const style = { "--c": CIRCUMFERENCE.toFixed(2), "--off": (CIRCUMFERENCE * (1 - level / 100)).toFixed(2) } as CSSProperties;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90" role="img" aria-label={`${name}: ${level} percent`} style={style}>
      <circle cx="32" cy="32" r={RADIUS} fill="none" stroke="rgba(139,123,255,0.2)" strokeWidth="5" />
      <circle className="gauge-fg" cx="32" cy="32" r={RADIUS} fill="none" stroke="var(--s-cyan)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export default function Instruments() {
  return (
    <SectorSection id="skills" className="min-h-screen">
      <SectorHeading id="skills" />
      <div className="space-y-8">
        {skillGroups.map((group) => (
          <Reveal key={group.group}>
            <section className="space-panel p-6 sm:p-8" aria-label={group.group}>
              <h3 className="font-hud text-xs tracking-[0.3em] text-s-warm">{group.group.toUpperCase()}</h3>
              <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((skill) => (
                  <li key={skill.name} className="flex items-start gap-4">
                    <div className="relative">
                      <Gauge level={skill.level} name={skill.name} />
                      <span aria-hidden className="font-hud absolute inset-0 grid place-items-center text-[11px]">
                        {skill.level}
                      </span>
                    </div>
                    <div>
                      <p className="font-space text-lg font-medium">{skill.name}</p>
                      <p className="mt-1 text-sm text-s-dim">{skill.quip}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>
    </SectorSection>
  );
}
