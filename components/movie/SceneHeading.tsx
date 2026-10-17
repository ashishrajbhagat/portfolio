import { flavor } from "@/content/flavor";
import type { SectionKey } from "@/content/types";
import { pad2 } from "@/lib/movie/format";
import { sceneCount, scenes } from "@/lib/movie/scenes";

interface SceneHeadingProps {
  id: SectionKey;
  /** Fade the heading in on scroll. Turn off inside pinned or horizontally scrolling scenes. */
  reveal?: boolean;
  className?: string;
}

export default function SceneHeading({ id, reveal = true, className = "" }: SceneHeadingProps) {
  const copy = flavor.movie[id];
  const scene = scenes.find((s) => s.id === id);

  return (
    <header {...(reveal ? { "data-reveal": "" } : {})} className={`mb-10 max-w-3xl ${className}`}>
      <p className="text-grad-warm mb-3 inline-block text-xs font-semibold tracking-[0.32em]">
        SCENE {pad2(scene?.number ?? 0)} / {pad2(sceneCount)}
      </p>
      <h2 id={`${id}-title`} className="font-title text-4xl leading-[1.05] sm:text-6xl">
        {copy.title}
      </h2>
      <span aria-hidden className="mt-5 block h-[3px] w-24 rounded bg-m-amber" />
      <p className="mt-4 max-w-prose text-base text-m-dim sm:text-lg">{copy.subtitle}</p>
    </header>
  );
}
