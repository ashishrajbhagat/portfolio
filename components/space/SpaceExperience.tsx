"use client";

import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projects, type Project } from "@/content/projects";
import type { Profile } from "@/content/profiles";
import { usePrefersReducedMotion } from "@/lib/movie/reduced-motion";
import { useProfileStore } from "@/lib/profile-store";
import { resetSpace } from "@/lib/space/store";
import Hud from "./Hud";
import SectorNav from "./SectorNav";
import { SpaceProvider, type SpaceContextValue } from "./SpaceContext";
import SpaceBackdrop from "./SpaceBackdrop";
import SpaceProjectDialog from "./SpaceProjectDialog";
import Academy from "./sections/Academy";
import About from "./sections/About";
import Badges from "./sections/Badges";
import Channel from "./sections/Channel";
import Dossier from "./sections/Dossier";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Instruments from "./sections/Instruments";
import MissionComplete from "./sections/MissionComplete";
import Projects from "./sections/Projects";
import Transmissions from "./sections/Transmissions";
import Trivia from "./sections/Trivia";
import { useSceneProgress } from "./useSceneProgress";

/**
 * The Explorer profile: a scroll-driven flight through a 3D night sky.
 * The page is normal scrolling HTML; a fixed WebGL canvas behind it moves a camera along a route as you scroll,
 * with each project hanging in space as a planet. Without WebGL it falls back to a CSS sky, and with reduced motion
 * the camera holds still, so the content always works.
 */
export default function SpaceExperience({ profile }: { profile: Profile }) {
  const reduced = usePrefersReducedMotion();
  const setLast = useProfileStore((s) => s.setLast);
  const [active, setActive] = useState<Project | null>(null);
  const [flash, setFlash] = useState(true);

  useEffect(() => {
    setLast(profile.slug);
  }, [profile.slug, setLast]);

  useEffect(() => {
    resetSpace();
    return resetSpace;
  }, []);

  useSceneProgress(!reduced);

  const lockScroll = useCallback((locked: boolean) => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [reduced]
  );

  const openProject = useCallback((id: string) => {
    setActive(projects.find((project) => project.id === id) ?? null);
  }, []);

  const context = useMemo<SpaceContextValue>(() => ({ reduced, scrollTo, openProject }), [reduced, scrollTo, openProject]);

  return (
    <SpaceProvider value={context}>
      <div className="space-theme font-sans">
        <a
          href="#main"
          className="space-skip"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("about");
          }}
        >
          Skip to content
        </a>

        <SpaceBackdrop reduced={reduced} onOpenProject={openProject} />

        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-5 py-4 sm:px-10">
          <span className="font-space text-lg font-semibold tracking-wide">
            Ashish Raj <span className="font-hud ml-2 text-[10px] tracking-[0.3em] text-s-cyan">EXPLORER</span>
          </span>
          <Link href="/" className="rounded border border-s-line px-3 py-1.5 text-sm transition-colors hover:border-s-cyan hover:text-s-cyan">
            Switch Profile
          </Link>
        </header>

        <SectorNav />
        <Hud />

        <main id="main" className="pointer-events-none relative z-10">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Instruments />
          <Academy />
          <Badges />
          <Trivia />
          <Transmissions />
          <Dossier />
          <Channel />
          <MissionComplete />
        </main>

        {!reduced && flash && <div aria-hidden className="warp-flash" onAnimationEnd={() => setFlash(false)} />}

        <SpaceProjectDialog project={active} onClose={() => setActive(null)} lockScroll={lockScroll} />
      </div>
    </SpaceProvider>
  );
}
