import type { ReactNode } from "react";
import type { SectionKey } from "@/content/types";

interface SectorSectionProps {
  id: SectionKey;
  children: ReactNode;
  className?: string;
}

/**
 * A scrolling scene. The wrapper lets pointer events through to the 3D sky; panels inside opt back in with
 * the `space-panel` class.
 */
export default function SectorSection({ id, children, className = "" }: SectorSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`pointer-events-none relative px-5 py-24 sm:px-10 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
