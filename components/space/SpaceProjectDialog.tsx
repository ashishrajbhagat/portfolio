"use client";

import type { Project } from "@/content/projects";
import ProjectPreview from "@/components/ProjectPreview";
import { posterStatus } from "@/lib/movie/format";
import { useModalDialog } from "@/lib/use-modal-dialog";

interface SpaceProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  lockScroll: (locked: boolean) => void;
}

/** Native <dialog> (focus trap, Escape to close, inert background) showing one planetary system in detail. */
export default function SpaceProjectDialog({ project, onClose, lockScroll }: SpaceProjectDialogProps) {
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
      className="space-dialog"
      aria-labelledby="space-project-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose(); // click on the backdrop
      }}
    >
      {project && (
        <div className="max-h-[88dvh] overflow-y-auto">
          <ProjectPreview project={project} accent="#7fdbff" />
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">{posterStatus(project.status).toUpperCase()}</p>
                <h3 id="space-project-title" className="mt-2 font-space text-3xl font-semibold sm:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-1 italic text-s-dim">{project.tagline}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                autoFocus
                className="shrink-0 rounded border border-s-line px-3 py-1.5 text-sm transition-colors hover:border-s-cyan hover:text-s-cyan"
              >
                Close
              </button>
            </div>

            <p className="text-base leading-relaxed">{project.description}</p>

            <ul className="space-y-2 text-sm sm:text-base">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-s-accent" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {project.stack.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.stack.map((tech) => (
                  <li key={tech} className="font-hud rounded border border-s-line px-2.5 py-1 text-xs text-s-dim">
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
                    className="rounded bg-s-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
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
