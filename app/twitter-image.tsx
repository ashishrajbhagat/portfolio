import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Ashish Raj: Software Engineer, AEM and full-stack developer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Portfolio" });
}
