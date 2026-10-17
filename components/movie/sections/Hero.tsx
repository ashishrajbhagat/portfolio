"use client";

import { useRef } from "react";
import ScenePhoto from "@/components/ScenePhoto";
import ScrollCue from "@/components/ScrollCue";
import { hero } from "@/content/hero";
import { gsap, useGSAP } from "@/lib/movie/gsap";
import { useMovie } from "../MovieContext";
import Words from "../Words";

const bokeh = [
  { size: 170, left: "8%", top: "18%", color: "#6fa8a4", speed: 0.18 },
  { size: 100, left: "78%", top: "14%", color: "#b8606d", speed: 0.3 },
  { size: 230, left: "70%", top: "62%", color: "#c9a45c", speed: 0.12 },
  { size: 80, left: "20%", top: "72%", color: "#e6cc92", speed: 0.25 },
  { size: 130, left: "46%", top: "8%", color: "#8b97c9", speed: 0.35 },
];

export default function Hero() {
  const { ready, reduced, scrollTo } = useMovie();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready || reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-word", { yPercent: 115, duration: 1.1, stagger: 0.07 })
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.9 }, "-=0.6")
        .from(".hero-photo", { opacity: 0, y: 36, duration: 1.2 }, "-=1.1")
        .from(".hero-cta > *", { opacity: 0, y: 16, stagger: 0.1, duration: 0.7 }, "-=0.5")
        .from(".hero-cue", { opacity: 0, duration: 1 }, "-=0.2");
    },
    { scope: ref, dependencies: [ready, reduced] }
  );

  return (
    <section
      id="hero"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pb-24 pt-28 sm:px-12"
    >
      <div aria-hidden className="hero-beam absolute inset-0" />
      <div aria-hidden className="absolute inset-0">
        {bokeh.map((b) => (
          <span
            key={`${b.left}-${b.top}`}
            data-parallax={b.speed}
            className="bokeh"
            style={{ width: b.size, height: b.size, left: b.left, top: b.top, background: b.color }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div>

        <h1 id="hero-title" className="font-title text-[clamp(3rem,11vw,9rem)] font-medium leading-[0.95] tracking-tight">
          <Words text={hero.greeting} wordClassName="hero-word text-grad-warm" />
        </h1>

        <p className="hero-sub mt-8 max-w-2xl text-xl text-m-fg sm:text-2xl">{hero.headline}</p>
        <p className="hero-sub mt-4 max-w-2xl text-base text-m-dim sm:text-lg">{hero.subheadline}</p>

        <p className="hero-sub mt-6 text-sm text-m-dim">
          <span className="font-semibold text-m-amber">Starring:</span> {hero.roles.join("  ·  ")}
        </p>

        <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo(hero.ctas.primary.target)}
            className="rounded bg-m-amber hover:bg-m-gold px-6 py-3 font-semibold text-black shadow-[0_14px_34px_-18px_var(--m-amber)] transition-transform hover:-translate-y-0.5"
          >
            {hero.ctas.primary.label}
          </button>
          <button
            type="button"
            onClick={() => scrollTo(hero.ctas.secondary.target)}
            className="rounded border border-m-fg/25 px-6 py-3 font-medium text-m-fg transition-colors hover:border-m-amber hover:text-m-amber"
          >
            {hero.ctas.secondary.label}
          </button>
          <span className="rounded border border-m-line px-3 py-1.5 text-xs text-m-dim">
            <span className="font-semibold text-m-fg">RATED W</span> for Work: {hero.status}
          </span>
        </div>

        <div className="hero-cue mt-12 text-m-dim">
          <ScrollCue onClick={() => scrollTo("about")} />
        </div>
        </div>

        <figure className="hero-photo mx-auto w-full max-w-sm lg:max-w-none lg:justify-self-end">
          <div className="relative rounded-sm border border-m-amber p-2">
            <ScenePhoto className="aspect-[5/6] w-full" priority />
            <span aria-hidden className="pointer-events-none absolute inset-2 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <figcaption className="pointer-events-none absolute bottom-5 left-5 text-[11px] tracking-[0.3em] text-m-fg">
              ASHISH RAJ
              <span className="mt-1 block text-[10px] tracking-[0.25em] text-m-dim">SOFTWARE ENGINEER</span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
