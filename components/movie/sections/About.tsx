"use client";

import { useEffect, useRef, useState } from "react";
import Portrait from "@/components/Portrait";
import { about, getAboutStats, quickFacts } from "@/content/about";
import CountUp from "../CountUp";
import { useMovie } from "../MovieContext";
import SceneHeading from "../SceneHeading";

/**
 * Left: the heading and portrait stay put (sticky on large screens).
 * Right: the story scrolls past and the paragraph in the middle of the screen is lit while the others dim.
 * Without motion (or without JavaScript) every paragraph is simply fully visible.
 */
export default function About() {
  const { reduced } = useMovie();
  const [active, setActive] = useState(0);
  const [spotlight, setSpotlight] = useState(false);
  const paragraphs = useRef<Array<HTMLParagraphElement | null>>([]);

  useEffect(() => {
    if (reduced || typeof IntersectionObserver === "undefined") return;

    setSpotlight(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-38% 0px -45% 0px" }
    );
    paragraphs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section id="about" aria-labelledby="about-title" data-aurora="teal" className="relative px-6 py-28 sm:px-12">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SceneHeading id="about" />
          <figure className="mt-2 flex items-center gap-5" data-reveal="">
            <div className="rounded-sm border border-m-amber/60 p-1.5">
              <Portrait className="h-32 w-32 sm:h-40 sm:w-40" sizes="160px" priority />
            </div>
            <figcaption className="text-xs tracking-[0.28em] text-m-dim">
              THE LEAD
              <span className="mt-1 block font-title text-xl normal-case tracking-normal text-m-fg">Ashish Raj</span>
            </figcaption>
          </figure>
        </div>

        <div>
          <div>
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.text}
                ref={(el) => {
                  paragraphs.current[index] = el;
                }}
                data-index={index}
                className={`max-w-prose py-6 font-title text-2xl leading-[1.5] transition-opacity duration-500 sm:text-[1.7rem] lg:py-12 ${
                  spotlight && active !== index ? "opacity-30" : "opacity-100"
                }`}
              >
                {paragraph.text}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-m-line pt-10 sm:grid-cols-4">
            {getAboutStats().map((stat) => (
              <div key={stat.label}>
                <dd className="font-title text-4xl text-m-amber">
                  <CountUp value={stat.value} />
                </dd>
                <dt className="mt-1 text-sm text-m-dim">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <dl className="mt-10 grid gap-3 text-sm sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-m-dim">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
