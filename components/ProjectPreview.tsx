import LiveSitePreview from "@/components/LiveSitePreview";
import type { Project } from "@/content/projects";
import { embedUrl } from "@/lib/embed";

/**
 * What the project dialogs show at the top: the live website when there is one to embed, otherwise a short
 * note (this portfolio itself, a project still being planned, or a link that is not available yet).
 */
export default function ProjectPreview({ project, accent }: { project: Project; accent?: string }) {
  const url = embedUrl(project);
  if (url) return <LiveSitePreview url={url} title={project.title} accent={accent} />;

  return (
    <div className="grid h-40 place-items-center border-b border-white/10 bg-black/30 px-6 text-center">
      <p className="max-w-sm text-sm opacity-80">{project.previewNote ?? "A live preview isn't available for this project."}</p>
    </div>
  );
}
