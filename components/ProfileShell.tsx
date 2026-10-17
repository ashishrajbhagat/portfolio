"use client";

import { useEffect, type CSSProperties } from "react";
import Link from "next/link";
import type { Profile } from "@/content/profiles";
import { ui } from "@/content/ui";
import { useProfileStore } from "@/lib/profile-store";
import ContentPreview from "./ContentPreview";

/**
 * Phase 1 wrapper for /watch/[profile].
 * The real themes (terminal, movie, space) replace the body in later phases.
 * The top bar with "Switch Profile" stays in every phase.
 */
export default function ProfileShell({ profile }: { profile: Profile }) {
  const setLast = useProfileStore((s) => s.setLast);

  useEffect(() => {
    setLast(profile.slug);
  }, [profile.slug, setLast]);

  return (
    <div style={{ "--accent": profile.accent } as CSSProperties} className="min-h-dvh">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#141414]/85 px-5 py-3 backdrop-blur">
        <span className="font-display text-lg font-bold">{ui.brand}</span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-neutral-400 sm:inline">
            {ui.shell.watchingAs} <strong className="font-medium text-white">{profile.name}</strong>
          </span>
          <Link href="/" className="rounded border border-white/30 px-3 py-1.5 text-sm transition-colors hover:border-white">
            {ui.shell.switchProfile}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12">
        <div className="mb-14 rounded-md border border-[color:var(--accent)] bg-white/[0.03] p-5">
          <p className="font-display text-xl font-semibold" style={{ color: profile.accent }}>
            {profile.themeLabel}: arriving in Phase {profile.phase}
          </p>
          <p className="mt-1 text-sm text-neutral-300">
            {profile.pitch} Until then, this is the full content preview in this profile&apos;s voice, so you can review every
            section and every joke before the animations go on top.
          </p>
        </div>
        <ContentPreview theme={profile.theme} />
      </main>
    </div>
  );
}
