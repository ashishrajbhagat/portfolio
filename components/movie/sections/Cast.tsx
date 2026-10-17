"use client";

import { useRef } from "react";
import { skillGroups } from "@/content/skills";
import { gsap, useGSAP } from "@/lib/movie/gsap";
import { useMovie } from "../MovieContext";
import SceneHeading from "../SceneHeading";

export default function Cast() {
  const { ready, reduced } = useMovie();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            transformOrigin: "left center",
            scrollTrigger: { trigger: bar, start: "top 92%", once: true },
          }
        );
      });
    },
    { scope: ref, dependencies: [ready, reduced] }
  );

  return (
    <section id="skills" ref={ref} aria-labelledby="skills-title" data-aurora="teal" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="skills" />
        <div className="space-y-14">
          {skillGroups.map((group) => (
            <div key={group.group} data-reveal="" className="grid gap-6 border-t border-m-line pt-8 lg:grid-cols-[15rem_1fr]">
              <h3 className="font-title text-2xl italic text-m-amber">{group.group}</h3>
              <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {group.items.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg">{skill.name}</span>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-m-line" />
                      <span className="text-sm tabular-nums text-m-dim">{skill.level}%</span>
                    </div>
                    <div
                      className="mt-2 h-[3px] bg-m-line"
                      role="img"
                      aria-label={`${skill.name}: ${skill.level} percent`}
                    >
                      <div data-bar className="h-full" style={{ width: `${skill.level}%`, background: "linear-gradient(90deg, var(--m-amber), var(--m-gold))" }} />
                    </div>
                    <p className="mt-2 text-sm text-m-dim">{skill.quip}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
