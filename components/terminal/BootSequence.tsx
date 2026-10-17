"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bootLines, statusLabel, type BootStatus } from "@/lib/terminal/boot";

interface BootSequenceProps {
  onDone: () => void;
}

const LOGIN_USER = "guest";
const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);

const statusClass: Record<BootStatus, string> = {
  ok: "t-green",
  warn: "t-yellow",
  skip: "t-purple",
  info: "t-cyan",
};

type Stage = "boot" | "login" | "done";

/**
 * Fake boot log followed by an auto-typed login. Any key, tap or the Skip button ends it immediately.
 * The parent never mounts this under reduced motion.
 */
export default function BootSequence({ onDone }: BootSequenceProps) {
  const [visible, setVisible] = useState(0);
  const [stage, setStage] = useState<Stage>("boot");
  const [typed, setTyped] = useState("");
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  // Skip on any real key press.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (MODIFIER_KEYS.has(event.key)) return;
      finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  // Boot log timeline.
  useEffect(() => {
    const timers: number[] = [];
    let elapsed = 250;
    bootLines.forEach((line, index) => {
      elapsed += line.delay;
      timers.push(window.setTimeout(() => setVisible(index + 1), elapsed));
    });
    timers.push(window.setTimeout(() => setStage("login"), elapsed + 350));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Login typing, then hand over to the session.
  useEffect(() => {
    if (stage !== "login") return;
    const timers: number[] = [];
    const perChar = 110;
    [...LOGIN_USER].forEach((_, index) => {
      timers.push(window.setTimeout(() => setTyped(LOGIN_USER.slice(0, index + 1)), 150 + index * perChar));
    });
    const typingDone = 150 + LOGIN_USER.length * perChar;
    timers.push(window.setTimeout(() => setStage("done"), typingDone + 450));
    timers.push(window.setTimeout(finish, typingDone + 1500));
    return () => timers.forEach(window.clearTimeout);
  }, [stage, finish]);

  return (
    <div className="relative h-full overflow-hidden px-4 py-5 sm:px-8" onClick={finish}>
      <p className="sr-only" role="status">
        Booting AshishOS. Press any key or use the skip button to continue.
      </p>

      <div aria-hidden className="mx-auto max-w-4xl space-y-1 text-[13px] sm:text-sm">
        {bootLines.slice(0, visible).map((line) => (
          <p key={line.text} className="flex gap-3">
            <span className={`shrink-0 whitespace-pre ${statusClass[line.status]}`}>[{statusLabel[line.status]}]</span>
            <span>{line.text}</span>
          </p>
        ))}

        {stage !== "boot" && (
          <div className="pt-4">
            <p className="t-dim">AshishOS 1.0 ashish-os tty1</p>
            <p>
              <span>ashish-os login: </span>
              <span className="t-pink">{typed}</span>
              {stage === "login" && <span className="caret" />}
            </p>
          </div>
        )}
        {stage === "done" && (
          <>
            <p className="t-dim">Password: not required. It&apos;s a portfolio.</p>
            <p className="t-dim">Welcome, guest.</p>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          finish();
        }}
        className="t-btn absolute bottom-4 right-4 text-xs sm:text-sm"
      >
        Skip boot (any key)
      </button>
    </div>
  );
}
