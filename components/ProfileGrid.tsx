"use client";

import "@fontsource-variable/fraunces";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import Confetti from "@/components/Confetti";
import Portrait from "@/components/Portrait";
import { profiles } from "@/content/profiles";
import { site } from "@/content/site";
import type { ProfileSlug } from "@/content/types";
import { ui } from "@/content/ui";
import { createKonami } from "@/lib/konami";
import { useLastProfile, useProfileStore } from "@/lib/profile-store";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { AddAvatar, avatarBySlug } from "./avatars";
import ProfileCard, { type CardState } from "./ProfileCard";

export default function ProfileGrid() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const last = useLastProfile();
  const setLast = useProfileStore((s) => s.setLast);

  const [selected, setSelected] = useState<ProfileSlug | null>(null);
  const [hovered, setHovered] = useState<ProfileSlug | null>(null);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const navTimer = useRef<number | null>(null);
  const toastIndex = useRef(0);

  useEffect(() => {
    profiles.forEach((p) => router.prefetch(`/watch/${p.slug}`));
  }, [router]);

  // Timers are cleared only on unmount. (Clearing them whenever `router` changes would cancel a pending navigation.)
  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (navTimer.current) window.clearTimeout(navTimer.current);
    },
    []
  );

  // Keyboard: 1, 2, 3 pick a profile, and the Konami code is an easter egg. Ignored while typing in a field.
  const chooseRef = useRef(choose);
  useEffect(() => {
    chooseRef.current = choose;
  });
  useEffect(() => {
    let confettiTimer: number | undefined;
    const konami = createKonami(() => {
      showToast(ui.profileScreen.konamiToast);
      setConfetti(true);
      window.clearTimeout(confettiTimer);
      confettiTimer = window.setTimeout(() => setConfetti(false), 3600);
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if ((event.target as HTMLElement | null)?.closest?.("input, textarea, select, [contenteditable='true']")) return;
      konami(event.key);
      const index = ["1", "2", "3"].indexOf(event.key);
      if (index !== -1 && profiles[index]) chooseRef.current(profiles[index].slug);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(confettiTimer);
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }

  function choose(slug: ProfileSlug) {
    if (selected) return;
    if (editing) {
      showToast(ui.editToasts[toastIndex.current++ % ui.editToasts.length]);
      return;
    }
    setSelected(slug);
    setLast(slug);
    navTimer.current = window.setTimeout(() => router.push(`/watch/${slug}`), reduced ? 150 : 1000);
  }

  // Starting values must not depend on the reduced-motion preference: the server cannot know it, so any
  // difference here would be a hydration mismatch. MotionConfig below skips the movement for those visitors.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.11, delayChildren: reduced ? 0 : 0.3 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 14 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: reduced ? 0.01 : 0.55, ease: [0.2, 0.8, 0.2, 1] } },
  };

  const selectedProfile = profiles.find((p) => p.slug === selected);
  const spotlight = selected ?? hovered;

  function stateFor(slug: ProfileSlug): CardState {
    if (!selected) return "idle";
    return selected === slug ? "selected" : "dimmed";
  }

  return (
    <MotionConfig reducedMotion="user">
      {/* Backdrop: ink, a soft champagne glow, a spotlight in the hovered profile's colour, and fine grain. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#0a0a0c]" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "radial-gradient(70% 50% at 50% -10%, rgba(201,164,92,0.16), transparent 70%)" }}
      />
      {profiles.map((p) => (
        <div
          key={p.slug}
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700"
          style={{ opacity: spotlight === p.slug ? 1 : 0, background: `radial-gradient(55% 45% at 50% 62%, ${p.accent}30, transparent 72%)` }}
        />
      ))}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.06]"
        style={{ backgroundImage: "url(/textures/grain.svg)" }}
      />

      <main className="relative flex min-h-dvh flex-col px-6 pb-10 pt-6 sm:px-12">
        <header className="flex items-center gap-3">
          <Portrait className="h-11 w-11 rounded-full ring-1 ring-white/20" sizes="44px" priority />
          <div>
            <p className="font-title text-lg leading-tight text-white">{ui.brand}</p>
            <p className="text-xs text-neutral-500">Software Engineer · {site.location.split(",")[0]}</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 0 : 1 }}
            transition={{ duration: reduced ? 0.01 : 0.7 }}
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#c9a45c]"
          >
            Portfolio · three ways to explore
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: selected ? 0 : 1, y: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.6 }}
            className="mt-4 text-center font-title text-5xl font-light tracking-tight text-white sm:text-7xl"
          >
            {ui.profileScreen.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 0 : 1 }}
            transition={{ duration: reduced ? 0.01 : 0.7, delay: reduced ? 0 : 0.15 }}
            className="mt-4 max-w-md text-center text-sm text-neutral-400 sm:text-base"
          >
            The same story, told three different ways. Pick the one that suits you.
          </motion.p>

          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-x-7"
          >
            {profiles.map((p, index) => {
              const Avatar = avatarBySlug[p.slug];
              return (
                <ProfileCard
                  key={p.slug}
                  shortcut={String(index + 1)}
                  name={p.name}
                  caption={p.caption}
                  pitch={p.pitch}
                  accent={p.accent}
                  avatar={<Avatar />}
                  state={stateFor(p.slug)}
                  editing={editing}
                  isLast={last === p.slug}
                  lastLabel={ui.profileScreen.lastWatched}
                  reduced={reduced}
                  onActivate={() => choose(p.slug)}
                  onHover={(active) => setHovered((current) => (active ? p.slug : current === p.slug ? null : current))}
                  variants={item}
                />
              );
            })}
            <ProfileCard
              name={ui.addProfile.name}
              caption={ui.addProfile.caption}
              pitch={ui.addProfile.pitch}
              accent="#8a8a93"
              avatar={<AddAvatar />}
              state={selected ? "dimmed" : "idle"}
              editing={false}
              isLast={false}
              lastLabel=""
              reduced={reduced}
              onActivate={() => !selected && showToast(ui.addProfile.toast)}
              onHover={() => {}}
              variants={item}
              ariaLabel={ui.addProfile.name}
              muted
            />
          </motion.ul>

          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: selected ? 0 : 1 }}
            transition={{ delay: reduced ? 0 : 0.9, duration: reduced ? 0.01 : 0.5 }}
            onClick={() => setEditing((v) => !v)}
            disabled={!!selected}
            className="mt-14 rounded border border-white/20 px-6 py-2 text-sm text-neutral-300 transition-colors hover:border-[#c9a45c] hover:text-[#c9a45c]"
          >
            {editing ? ui.profileScreen.done : ui.profileScreen.manage}
          </motion.button>
        </div>

        <p className="text-center text-xs text-neutral-600">
          {ui.profileScreen.footnote} · {site.domain}
        </p>

        {confetti && !reduced && <Confetti />}

        <AnimatePresence>
          {selectedProfile && (
            <motion.div
              aria-hidden
              className="pointer-events-none fixed inset-0"
              initial={{ opacity: 0, scale: reduced ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0.01 : 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ background: `radial-gradient(circle at center, ${selectedProfile.accent}40 0%, #0a0a0c 62%)`, zIndex: -1 }}
            />
          )}
          {toast && (
            <motion.div
              key={toast}
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed bottom-16 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 rounded-md border border-white/15 bg-neutral-900 px-5 py-3 text-center text-sm text-neutral-200 shadow-xl"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
