import { flavor } from "@/content/flavor";
import type { SectionKey } from "@/content/types";
import { sectorLabel } from "@/lib/space/format";
import { sectionOrder } from "@/content/types";
import Reveal from "./Reveal";

export default function SectorHeading({ id, className = "" }: { id: SectionKey; className?: string }) {
  const copy = flavor.space[id];
  const index = sectionOrder.indexOf(id);

  return (
    <Reveal className={`mb-10 max-w-3xl ${className}`}>
      <p className="font-hud text-xs tracking-[0.3em] text-s-cyan">{sectorLabel(index, sectionOrder.length)}</p>
      <h2 id={`${id}-title`} className="mt-3 font-space text-4xl font-semibold leading-[1.05] sm:text-6xl">
        {copy.title}
      </h2>
      <p className="mt-4 max-w-prose text-base text-s-dim sm:text-lg">{copy.subtitle}</p>
    </Reveal>
  );
}
