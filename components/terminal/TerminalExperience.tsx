"use client";

import "@fontsource-variable/jetbrains-mono";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContentPreview from "@/components/ContentPreview";
import type { Profile } from "@/content/profiles";
import { useProfileStore } from "@/lib/profile-store";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import {
  BOOT_SESSION_KEY, defaultSettings, loadSettings, saveSettings,
} from "@/lib/terminal/settings";
import { readStorage, removeStorage, writeStorage } from "@/lib/terminal/storage";
import type { TerminalSettings } from "@/lib/terminal/types";
import BootSequence from "./BootSequence";
import TerminalSession from "./TerminalSession";
import TopBar from "./TopBar";

type Phase = "init" | "boot" | "session";

/**
 * The Developer profile: boot sequence, then an interactive terminal.
 * Boot plays once per tab session and is skipped under prefers-reduced-motion.
 */
export default function TerminalExperience({ profile }: { profile: Profile }) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const setLast = useProfileStore((s) => s.setLast);

  const [phase, setPhase] = useState<Phase>("init");
  const [sessionKey, setSessionKey] = useState(0);
  const [plain, setPlain] = useState(false);
  const [settings, setSettings] = useState<TerminalSettings>(defaultSettings);

  useEffect(() => {
    setLast(profile.slug);
  }, [profile.slug, setLast]);

  useEffect(() => {
    setSettings(loadSettings());
    const alreadyBooted = readStorage("session", BOOT_SESSION_KEY) === "1";
    setPhase(reduced === true || alreadyBooted ? "session" : "boot");
    // Decide once on mount; later preference changes should not restart the session.
  }, []);

  const updateSettings = useCallback((next: TerminalSettings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const finishBoot = useCallback(() => {
    writeStorage("session", BOOT_SESSION_KEY, "1");
    setPhase("session");
  }, []);

  const reboot = useCallback(() => {
    removeStorage("session", BOOT_SESSION_KEY);
    setPlain(false);
    setSessionKey((k) => k + 1);
    setPhase(reduced === true ? "session" : "boot");
  }, [reduced]);

  const exit = useCallback(() => router.push("/"), [router]);
  const showPlain = useCallback(() => setPlain(true), []);

  return (
    <div
      className="term fixed inset-0 z-40 flex flex-col overflow-hidden"
      data-theme={settings.theme}
      data-crt={settings.crt && !plain ? "on" : "off"}
    >
      <TopBar plain={plain} onTogglePlain={() => setPlain((v) => !v)} />

      <div className="relative min-h-0 flex-1">
        {phase === "boot" && <BootSequence onDone={finishBoot} />}

        {phase === "session" && (
          <div className={plain ? "hidden" : "h-full term-power-on"} key={sessionKey}>
            <TerminalSession
              settings={settings}
              onSettingsChange={updateSettings}
              onExit={exit}
              onReboot={reboot}
              onPlain={showPlain}
            />
          </div>
        )}

        {phase === "session" && plain && (
          <div className="h-full overflow-y-auto bg-[#141414] font-sans text-white">
            <div className="mx-auto max-w-4xl px-5 py-10">
              <ContentPreview theme="terminal" />
            </div>
          </div>
        )}

        <div aria-hidden className="term-crt pointer-events-none absolute inset-0" />
      </div>
    </div>
  );
}
