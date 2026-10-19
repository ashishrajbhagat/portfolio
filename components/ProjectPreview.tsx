"use client";

import { useEffect, useState } from "react";
import LiveSitePreview from "@/components/LiveSitePreview";
import type { Project } from "@/content/projects";
import { embedUrl } from "@/lib/embed";
import { loadEmbedStatus, type EmbedStatus } from "@/lib/embed-status";

/**
 * What the project dialogs show at the top: the live website when it can be embedded; otherwise a short note
 * (this portfolio itself, a project that is not live, or a site that does not allow being shown inside another page).
 */
export default function ProjectPreview({ project, accent = "#c9a45c" }: { project: Project; accent?: string }) {
  const url = embedUrl(project);
  const [status, setStatus] = useState<EmbedStatus | null>(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    loadEmbedStatus().then((all) => {
      if (active) setStatus(all[project.id] ?? null);
    });
    return () => {
      active = false;
    };
  }, [url, project.id]);

  if (!url) {
    return (
      <div className="grid h-40 place-items-center border-b border-white/10 bg-black/30 px-6 text-center">
        <p className="max-w-sm text-sm opacity-80">{project.previewNote ?? "A live preview isn't available for this project."}</p>
      </div>
    );
  }

  if (status && !status.embeddable) {
    return (
      <div className="grid place-items-center gap-4 border-b border-white/10 bg-black/30 px-6 py-10 text-center">
        <p className="max-w-md text-sm opacity-85">
          This website can&apos;t be shown inside another page, so it opens in its own tab instead.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          style={{ background: accent }}
        >
          Open {new URL(url).hostname} ↗
        </a>
        {status.reason && <p className="text-[11px] opacity-50">Blocked by the site&apos;s own setting ({status.reason})</p>}
      </div>
    );
  }

  return <LiveSitePreview url={url} title={project.title} accent={accent} />;
}
