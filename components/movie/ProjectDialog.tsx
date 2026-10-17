"use client";

import type { Project } from "@/content/projects";
import ProjectPreview from "@/components/ProjectPreview";
import { posterStatus } from "@/lib/movie/format";
import { useModalDialog } from "@/lib/use-modal-dialog";
import { useMovie } from "./MovieContext";

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
}

/** Native <dialog>: focus trap, Escape to close and inert background come for free. */
export default function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const { lockScroll } = useMovie();
  const ref = useModalDialog(project !== null, lockScroll);

  const links = project
    ? [
        project.links.live && project.links.live !== "#" ? { label: "Visit live site", href: project.links.live } : null,
        project.links.repo && project.links.repo !== "#" ? { label: "View source", href: project.links.repo } : null,
      ].filter((link): link is { label: string; href: string } => link !== null)
    : [];

  return (
    <dialog
      ref={ref}
      className="movie-dialog"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      {project && (
        <div data-lenis-prevent className="max-h-[88dvh] overflow-y-auto">
          <ProjectPreview project={project} accent="#c9a45c" />
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-grad-warm inline-block text-xs font-semibold tracking-[0.3em]">{posterStatus(project.status).toUpperCase()}</p>
                <h3 id="project-dialog-title" className="mt-2 font-title text-3xl sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-1 italic text-m-dim">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                autoFocus
                className="shrink-0 rounded border border-m-line px-3 py-1.5 text-sm transition-colors hover:border-m-amber hover:text-m-amber"
              >
                Close
              </button>
            </div>

            <p className="text-base leading-relaxed">{project.description}</p>

            <ul className="space-y-2 text-sm sm:text-base">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-m-amber" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {project.stack.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-m-line px-3 py-1 text-xs text-m-dim">
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-m-amber hover:bg-m-gold px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
