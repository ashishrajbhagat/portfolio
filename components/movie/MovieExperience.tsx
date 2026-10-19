"use client";

import "@fontsource-variable/fraunces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Profile } from "@/content/profiles";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/movie/gsap";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { INTRO_SESSION_KEY } from "@/lib/movie/storage-keys";
import { useProfileStore } from "@/lib/profile-store";
import { readStorage, writeStorage } from "@/lib/terminal/storage";
import FilmGrain from "./FilmGrain";
import Intro from "./Intro";
import { MovieProvider, type MovieContextValue } from "./MovieContext";
import MovieNav from "./MovieNav";
import Awards from "./sections/Awards";
import About from "./sections/About";
import BehindScenes from "./sections/BehindScenes";
import Booking from "./sections/Booking";
import Cast from "./sections/Cast";
import EndCredits from "./sections/EndCredits";
import Experience from "./sections/Experience";
import Flashback from "./sections/Flashback";
import Hero from "./sections/Hero";
import PressKit from "./sections/PressKit";
import Projects from "./sections/Projects";
import Reviews from "./sections/Reviews";
import { useSmoothScroll } from "./useSmoothScroll";

type Phase = "init" | "intro" | "main";

/**
 * The Recruiter profile: a cinematic one-page story.
 * Countdown intro (once per tab session), then scroll-driven scenes with smooth scrolling,
 * pinned moments, film grain and rolling end credits. Everything degrades gracefully
 * under prefers-reduced-motion and without JavaScript.
 */
export default function MovieExperience({ profile }: { profile: Profile }) {
  const reduced = usePrefersReducedMotion();
  const setLast = useProfileStore((s) => s.setLast);
  const rootRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("init");
  const [introMounted, setIntroMounted] = useState(false);
  const ready = phase === "main";

  const lenisRef = useSmoothScroll(ready && !reduced);

  useEffect(() => {
    setLast(profile.slug);
  }, [profile.slug, setLast]);

  // Decide once on mount whether to play the intro.
  useEffect(() => {
    const seen = readStorage("session", INTRO_SESSION_KEY) === "1";
    if (reduced || seen) {
      setPhase("main");
    } else {
      setPhase("intro");
      setIntroMounted(true);
    }
    // Decide once; later preference changes should not replay the intro.
  }, []);

  // No scrolling while the intro is up.
  useEffect(() => {
    if (ready) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [ready]);

  const revealPage = useCallback(() => {
    writeStorage("session", INTRO_SESSION_KEY, "1");
    setPhase("main");
  }, []);
  const removeIntro = useCallback(() => setIntroMounted(false), []);

  // Global scroll effects driven by data attributes: fade-ins and parallax layers.
  useGSAP(
    () => {
      if (!ready || reduced) return;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { opacity: 0, y: 28 });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallax ?? "0.2");
        gsap.to(layer, {
          yPercent: -speed * 140,
          ease: "none",
          scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: rootRef, dependencies: [ready, reduced] }
  );

  // Once children have set their initial states, stop hiding [data-reveal] via CSS.
  useEffect(() => {
    if (!ready || !rootRef.current) return;
    rootRef.current.dataset.anim = reduced ? "off" : "on";
  }, [ready, reduced]);

  // Pin positions depend on layout, so refresh after fonts and images have settled.
  useEffect(() => {
    if (!ready) return;
    const refresh = () => ScrollTrigger.refresh();
    const timeout = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("load", refresh);
    };
  }, [ready]);

  const scrollTo = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [lenisRef, reduced]
  );

  const lockScroll = useCallback(
    (locked: boolean) => {
      const lenis = lenisRef.current;
      if (locked) lenis?.stop();
      else lenis?.start();
      document.documentElement.style.overflow = locked ? "hidden" : "";
    },
    [lenisRef]
  );

  const context = useMemo<MovieContextValue>(
    () => ({ ready, reduced, scrollTo, lockScroll }),
    [ready, reduced, scrollTo, lockScroll]
  );

  return (
    <MovieProvider value={context}>
      <div ref={rootRef} className="movie font-sans" data-anim="pending">
        <a
          href="#main"
          className="skip-link"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("about");
          }}
        >
          Skip to content
        </a>

        <MovieNav />

        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Cast />
          <Flashback />
          <Awards />
          <BehindScenes />
          <Reviews />
          <PressKit />
          <Booking />
          <EndCredits />
        </main>

        <FilmGrain />
      </div>

      {/* Opaque cover until we know whether to play the intro (hidden without JS, see page). */}
      {phase === "init" && <div className="movie-cover" aria-hidden />}
      {introMounted && <Intro onReveal={revealPage} onGone={removeIntro} />}
    </MovieProvider>
  );
}
