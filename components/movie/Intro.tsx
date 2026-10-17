"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface IntroProps {
  /** Called when the overlay starts fading, i.e. when the page underneath should begin its entrance. */
  onReveal: () => void;
  /** Called once the overlay has fully faded and can be unmounted. */
  onGone: () => void;
}

type Step = 3 | 2 | 1 | "title";

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);
const STEP_MS = 700;
const TITLE_MS = 1700;
const FADE_MS = 700;

/** Film-leader countdown (3, 2, 1) followed by a title card. Skippable by key, tap or button. */
export default function Intro({ onReveal, onGone }: IntroProps) {
  const [step, setStep] = useState<Step>(3);
  const [leaving, setLeaving] = useState(false);
  const revealed = useRef(false);
  const skipRef = useRef<HTMLButtonElement>(null);

  const leave = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    setLeaving(true);
    onReveal();
  }, [onReveal]);

  // Countdown timeline.
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(2), STEP_MS),
      window.setTimeout(() => setStep(1), STEP_MS * 2),
      window.setTimeout(() => setStep("title"), STEP_MS * 3),
      window.setTimeout(leave, STEP_MS * 3 + TITLE_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [leave]);

  // Remove the overlay after the fade finishes.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onGone, FADE_MS + 50);
    return () => window.clearTimeout(timer);
  }, [leaving, onGone]);

  // Any real key press skips.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!MODIFIER_KEYS.has(event.key)) leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leave]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="intro" data-leaving={leaving} onClick={leave}>
      <p className="sr-only" role="status">
        Intro playing. Press any key or use the skip button to continue.
      </p>

      <div aria-hidden className="grid place-items-center">
        {step === "title" ? (
          <div className="title-card">
            <p className="text-grad-warm font-title text-5xl italic sm:text-7xl">Ashish Raj</p>
            <p className="mx-auto mt-5 max-w-md text-[11px] tracking-[0.35em] text-m-amber sm:text-xs">
              A DEVELOPER. A DEADLINE. AN UNREASONABLE NUMBER OF BROWSER TABS.
            </p>
          </div>
        ) : (
          <div className="leader" key={step}>
            <span className="leader-sweep" />
            <span className="leader-number">{step}</span>
          </div>
        )}
      </div>

      <span aria-hidden className="letterbox letterbox-top" />
      <span aria-hidden className="letterbox letterbox-bottom" />

      <button
        ref={skipRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          leave();
        }}
        className="absolute bottom-[14vh] right-5 rounded border border-white/25 px-3 py-1.5 text-xs text-m-dim transition-colors hover:border-m-amber hover:text-m-amber sm:right-8 sm:text-sm"
      >
        Skip intro
      </button>
    </div>
  );
}
