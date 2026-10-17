import Image from "next/image";
import { site } from "@/content/site";

interface PortraitProps {
  className?: string;
  /** Hint for the browser about the rendered width, e.g. "(min-width: 1024px) 320px, 60vw". */
  sizes?: string;
  /** Set for portraits that are visible on first paint. */
  priority?: boolean;
}

/**
 * The site owner's photo, cropped to a square. Swap the picture by changing `site.avatar`.
 * SVG placeholders are served as-is; real photos go through Next's image optimisation.
 */
export default function Portrait({ className = "", sizes = "320px", priority = false }: PortraitProps) {
  const isSvg = site.avatar.endsWith(".svg");

  return (
    <div className={`relative aspect-square overflow-hidden ${className}`}>
      <Image
        src={site.avatar}
        alt={site.avatarAlt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isSvg}
        className="object-cover"
      />
    </div>
  );
}
