import { getProfile, profiles } from "@/content/profiles";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Ashish Raj: portfolio";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return profiles.map((p) => ({ profile: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ profile: string }> }) {
  const { profile: slug } = await params;
  const profile = getProfile(slug);
  return renderOgImage({
    eyebrow: profile ? `${profile.name} view · ${profile.caption}` : "Portfolio",
    accent: profile?.accent,
  });
}
