"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

export type CardState = "idle" | "selected" | "dimmed";

interface ProfileCardProps {
  name: string;
  caption: string;
  pitch: string;
  accent: string;
  avatar: ReactNode;
  state: CardState;
  editing: boolean;
  isLast: boolean;
  lastLabel: string;
  reduced: boolean;
  onActivate: () => void;
  /** Called with true while the card is hovered or focused, false otherwise. */
  onHover: (active: boolean) => void;
  variants: Variants;
  ariaLabel?: string;
  /** Visually quieter treatment for the "Add Profile" tile. */
  muted?: boolean;
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-1/4 w-1/4 text-white" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

export default function ProfileCard({
  name, caption, pitch, accent, avatar, state, editing, isLast, lastLabel, reduced, onActivate, onHover, variants, ariaLabel, muted = false,
}: ProfileCardProps) {
  const target =
    state === "selected"
      ? { scale: reduced ? 1 : 1.06, opacity: 1, y: 0 }
      : state === "dimmed"
        ? { scale: 1, opacity: 0, y: reduced ? 0 : 12 }
        : { scale: 1, opacity: 1, y: 0 };

  return (
    <motion.li variants={variants} className="min-w-0">
      <motion.div animate={target} transition={{ duration: reduced ? 0.01 : 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
        <button
          type="button"
          onClick={onActivate}
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
          onFocus={() => onHover(true)}
          onBlur={() => onHover(false)}
          aria-label={ariaLabel ?? (editing ? `Edit profile ${name}` : `Watch as ${name}`)}
          style={{ "--accent": accent } as CSSProperties}
          className="group block w-full text-left outline-none"
        >
          <span
            className={`relative block aspect-square overflow-hidden rounded-xl ring-1 transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-[color:var(--accent)] group-hover:shadow-[0_34px_60px_-34px_var(--accent)] group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-[color:var(--accent)] group-focus-visible:shadow-[0_34px_60px_-34px_var(--accent)] ${
              muted ? "ring-white/10" : "ring-white/15"
            }`}
          >
            {avatar}
            {editing && (
              <span className="absolute inset-0 grid place-items-center bg-black/60">
                <PencilIcon />
              </span>
            )}
          </span>

          <span className="mt-4 block font-title text-xl tracking-tight text-white sm:text-2xl">{name}</span>
          <span
            className="mt-1 block text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px]"
            style={{ color: muted ? "#8a8a93" : accent }}
          >
            {caption}
          </span>
          <span className="mt-2 line-clamp-3 block text-[13px] leading-relaxed text-neutral-400">{pitch}</span>

          <span className="mt-3 flex items-center gap-2 text-xs text-neutral-300">
            {isLast && (
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-neutral-300">{lastLabel}</span>
            )}
            {!muted && (
              <span className="translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                Enter →
              </span>
            )}
          </span>
        </button>
      </motion.div>
    </motion.li>
  );
}
