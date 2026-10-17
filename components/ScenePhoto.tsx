import Image from "next/image";
import { site } from "@/content/site";

interface ScenePhotoProps {
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** The taller "at my desk" photo (`site.scene`), cover-cropped from the top so the face is never cut off. */
export default function ScenePhoto({ className = "", sizes = "(min-width: 1024px) 420px, 90vw", priority = false }: ScenePhotoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={site.scene}
        alt={site.sceneAlt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={site.scene.endsWith(".svg")}
        className="object-cover object-top"
      />
    </div>
  );
}
