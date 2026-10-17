"use client";

import { useRef } from "react";
import { educationEntries } from "@/content/education";
import { gsap, useGSAP } from "@/lib/movie/gsap";
import { useMovie } from "../MovieContext";
import SceneHeading from "../SceneHeading";

/** The flashback starts as sepia black-and-white and regains colour as you scroll through it. */
export default function Flashback() {
  const { ready, reduced } = useMovie();
  const ref = useRef<HTMLElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = gradeRef.current;
      if (!el) return;
      if (!ready || reduced) {
        el.style.setProperty("--grade", reduced ? "0.35" : "1");
        return;
      }
      gsap.fromTo(
        el,
        { "--grade": 1 },
        {
          "--grade": 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 45%", scrub: true },
        }
      );
    },
    { scope: ref, dependencies: [ready, reduced] }
  );

  return (
    <section id="education" ref={ref} aria-labelledby="education-title" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="education" />
        <div ref={gradeRef} className="flashback space-y-8">
          {educationEntries.map((entry) => (
            <article
              key={entry.id}
              aria-label={`${entry.level}, ${entry.institute}`}
              className="grid gap-10 rounded-md border border-m-line bg-white/[0.02] p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]"
            >
              <div>
                <p className="inline-block text-xs font-semibold tracking-[0.3em] text-m-amber">{entry.period}</p>
                <h3 className="mt-3 font-title text-3xl sm:text-4xl">{entry.level}</h3>
                <p className="mt-2 text-lg text-m-dim">
                  {entry.institute}, {entry.location}
                </p>
                <p className="mt-6 max-w-prose text-base leading-relaxed">{entry.summary}</p>
              </div>
              <div>
                <p className="mb-3 text-sm text-m-dim">Syllabus highlights</p>
                <ul className="flex flex-wrap gap-2">
                  {entry.highlights.map((item) => (
                    <li key={item} className="rounded-full border border-m-line px-3 py-1 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
