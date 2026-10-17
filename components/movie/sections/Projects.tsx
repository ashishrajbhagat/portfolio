"use client";

import { useRef, useState, type CSSProperties } from "react";
import { projects, type Project } from "@/content/projects";
import { accentAt } from "@/lib/movie/accents";
import { posterStatus } from "@/lib/movie/format";
import { useMovie } from "../MovieContext";
import ProjectDialog from "../ProjectDialog";
import SceneHeading from "../SceneHeading";
import { useTilt } from "../useTilt";

/** "AEM Tutorial" -> "AT". Used as big faint lettering on the poster. */
function initials(title: string): string {
  return title
    .split(/\s+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function Poster({ project, onOpen, tilt, accent }: { project: Project; onOpen: (project: Project) => void; tilt: boolean; accent: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useTilt(ref, tilt);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(project)}
      aria-haspopup="dialog"
      style={{ "--accent": accent } as CSSProperties}
      className="poster group relative block aspect-[2/3] w-full overflow-hidden rounded-md border border-m-line bg-black text-left"
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: `radial-gradient(90% 60% at 15% 0%, ${accent}40, transparent 70%), linear-gradient(165deg, #17171c, #0a0a0c)` }}
      />
      <span aria-hidden className="absolute -right-2 top-2 font-title text-[9rem] leading-none text-white/[0.06]">
        {initials(project.title)}
      </span>
      <span aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: `linear-gradient(155deg, ${accent}, transparent 65%)` }} />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <span className="absolute inset-x-0 bottom-0 block p-5">
        <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em]" style={{ color: accent }}>
          {project.status === "Live" && <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />}
          {posterStatus(project.status).toUpperCase()}
        </span>
        <span className="mt-2 block font-title text-2xl leading-tight">{project.title}</span>
        <span className="mt-2 block text-sm text-m-dim">{project.tagline}</span>
        <span className="mt-4 inline-block text-xs text-m-fg underline-offset-4 group-hover:underline">
          Watch the trailer →
        </span>
      </span>
    </button>
  );
}

export default function Projects() {
  const { reduced } = useMovie();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" aria-labelledby="projects-title" data-aurora="rose" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="projects" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <li key={project.id} data-reveal="">
              <Poster project={project} onOpen={setActive} tilt={!reduced} accent={accentAt(index)} />
            </li>
          ))}
        </ul>
      </div>
      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </section>
  );
}
