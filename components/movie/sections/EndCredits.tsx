"use client";

import Link from "next/link";
import { useRef } from "react";
import { credits } from "@/content/credits";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/movie/gsap";
import { useMovie } from "../MovieContext";
import SceneHeading from "../SceneHeading";

/** Large screens: the credits roll up while the scene is pinned, ending on the post-credits scene. */
export default function EndCredits() {
  const { ready, scrollTo } = useMovie();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const roll = rollRef.current;
        const end = endRef.current;
        if (!section || !stage || !roll || !end) return;

        stage.dataset.pinned = "true";
        const rollDistance = () => roll.offsetHeight + window.innerHeight;

        gsap.set(end, { autoAlpha: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${rollDistance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        tl.fromTo(roll, { y: () => window.innerHeight }, { y: () => -roll.offsetHeight, ease: "none", duration: 1 })
          .to(end, { autoAlpha: 1, duration: 0.18, ease: "none" }, 0.9);

        return () => {
          delete stage.dataset.pinned;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <section id="credits" ref={sectionRef} aria-labelledby="credits-title" className="relative">
      <div ref={stageRef} className="credits-stage px-6 py-28 sm:px-12">
        <div ref={rollRef} className="credits-roll mx-auto max-w-3xl pb-24 text-center">
          <SceneHeading id="credits" reveal={false} className="mx-auto" />
          <dl className="mt-12 space-y-6">
            {credits.items.map((item) => (
              <div key={item.role}>
                <dt className="text-xs tracking-[0.35em] text-m-amber">{item.role.toUpperCase()}</dt>
                <dd className="mt-1 font-title text-2xl sm:text-3xl">{item.name}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-16 text-sm text-m-dim">
            © {new Date().getFullYear()} {site.name}. All rights reserved. Most wrongs reversed.
          </p>
        </div>

        <div ref={endRef} className="credits-end grid place-items-center text-center">
          <div className="max-w-lg">
            <p className="text-grad-warm font-title text-2xl italic leading-snug sm:text-3xl">{credits.postCredits}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollTo("hero")}
                className="rounded bg-m-amber hover:bg-m-gold px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
              >
                Watch again
              </button>
              <Link
                href="/"
                className="rounded border border-m-fg/25 px-6 py-3 text-m-fg transition-colors hover:border-m-amber hover:text-m-amber"
              >
                Switch Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
