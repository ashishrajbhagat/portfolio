"use client";

import { useEffect } from "react";
import { projects, type Project } from "@/content/projects";
import { posterStatus } from "@/lib/movie/format";
import { space } from "@/lib/space/store";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";
import { useSpace } from "../SpaceContext";

const systemStatus: Record<Project["status"], string> = {
  Live: "INHABITED",
  "In progress": "TERRAFORMING",
  Prototype: "UNCHARTED",
};

export default function Projects() {
  const { openProject } = useSpace();

  // Never leave a planet highlighted after leaving the page.
  useEffect(
    () => () => {
      space.focusId = null;
    },
    []
  );

  return (
    <SectorSection id="projects">
      <SectorHeading id="projects" />
      <ul>
        {projects.map((project, index) => (
          <li key={project.id} className="flex min-h-[70vh] items-center">
            <Reveal className={`w-full ${index % 2 === 0 ? "lg:pr-[45%]" : "lg:pl-[45%]"}`}>
              <article
                className="space-panel p-6 sm:p-8"
                onMouseEnter={() => (space.focusId = project.id)}
                onMouseLeave={() => (space.focusId = null)}
                onFocus={() => (space.focusId = project.id)}
                onBlur={() => (space.focusId = null)}
              >
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">
                  SYSTEM {String(index + 1).padStart(2, "0")} · {systemStatus[project.status]} · {posterStatus(project.status).toUpperCase()}
                </p>
                <h3 className="mt-3 font-space text-3xl font-semibold sm:text-4xl">{project.title}</h3>
                <p className="mt-2 italic text-s-dim">{project.tagline}</p>
                <p className="mt-4 text-base leading-relaxed">{project.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                  {project.stack.map((tech) => (
                    <li key={tech} className="font-hud rounded border border-s-line px-2.5 py-1 text-xs text-s-dim">
                      {tech}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openProject(project.id)}
                  aria-haspopup="dialog"
                  className="mt-6 rounded bg-s-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  Inspect system
                </button>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectorSection>
  );
}
