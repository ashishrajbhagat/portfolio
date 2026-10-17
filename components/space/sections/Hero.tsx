"use client";

import Portrait from "@/components/Portrait";
import ScrollCue from "@/components/ScrollCue";
import { hero } from "@/content/hero";
import { flavor } from "@/content/flavor";
import { useSpace } from "../SpaceContext";

export default function Hero() {
  const { scrollTo } = useSpace();

  return (
    <section id="hero" aria-labelledby="hero-title" className="pointer-events-none relative flex min-h-[100svh] items-center px-5 pb-24 pt-28 sm:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative mb-6 inline-block">
          <span aria-hidden className="orbit-ring absolute -inset-2 rounded-full border border-dashed border-s-cyan/60" />
          <Portrait className="h-20 w-20 rounded-full ring-2 ring-s-accent sm:h-24 sm:w-24" sizes="96px" priority />
        </div>
        <p className="font-hud text-xs tracking-[0.35em] text-s-cyan sm:text-sm">
          T-MINUS 00:00:00 · {flavor.space.hero.title.toUpperCase()}
        </p>

        <h1 id="hero-title" className="mt-6 font-space text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.95] [text-shadow:0_0_40px_rgba(139,123,255,0.45)]">
          {hero.greeting}
        </h1>

        <p className="mt-8 max-w-2xl text-xl sm:text-2xl">{hero.headline}</p>
        <p className="mt-4 max-w-2xl text-base text-s-dim sm:text-lg">{hero.subheadline}</p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-hud text-xs tracking-[0.25em] text-s-warm">CREW MANIFEST</span>
          {hero.roles.map((role) => (
            <span key={role} className="space-panel rounded-full px-3 py-1 text-s-fg">
              {role}
            </span>
          ))}
        </div>

        <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="rounded bg-s-accent px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Begin the journey
          </button>
          <button
            type="button"
            onClick={() => scrollTo(hero.ctas.secondary.target)}
            className="space-panel px-6 py-3 font-medium transition-colors hover:border-s-cyan hover:text-s-cyan"
          >
            Mission dossier
          </button>
        </div>
        <p className="mt-6 text-sm text-s-dim">{hero.status}</p>
      </div>

      <div className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2 text-s-cyan">
        <ScrollCue onClick={() => scrollTo("about")} />
      </div>
    </section>
  );
}
