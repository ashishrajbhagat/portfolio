import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPreview from "@/components/ContentPreview";
import MovieExperience from "@/components/movie/MovieExperience";
import ProfileShell from "@/components/ProfileShell";
import SpaceExperience from "@/components/space/SpaceExperience";
import TerminalExperience from "@/components/terminal/TerminalExperience";
import { getProfile, profiles } from "@/content/profiles";
import { site } from "@/content/site";
import { profileMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ profile: string }>;
}

export function generateStaticParams() {
  return profiles.map((p) => ({ profile: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profile: slug } = await params;
  const profile = getProfile(slug);
  return profile ? profileMetadata(profile) : { title: site.title, robots: { index: false } };
}

export default async function WatchPage({ params }: PageProps) {
  const { profile: slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  if (profile.theme === "terminal") {
    return (
      <>
        <TerminalExperience profile={profile} />
        {/* Without JavaScript the terminal cannot run, so show the full content as plain HTML. */}
        <noscript>
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#141414] text-white">
            <div className="mx-auto max-w-4xl px-5 py-10">
              <ContentPreview theme="terminal" />
            </div>
          </div>
        </noscript>
      </>
    );
  }

  if (profile.theme === "movie") {
    return (
      <>
        <MovieExperience profile={profile} />
        {/* Without JavaScript nothing animates: show the content as-is and drop the intro cover. */}
        <noscript>
          <style>{`.movie-cover,.intro{display:none!important}.movie[data-anim="pending"] [data-reveal]{opacity:1!important}`}</style>
        </noscript>
      </>
    );
  }

  if (profile.theme === "space") {
    return <SpaceExperience profile={profile} />;
  }

  return <ProfileShell profile={profile} />;
}
