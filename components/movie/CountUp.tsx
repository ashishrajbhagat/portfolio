"use client";

import { useRef } from "react";
import { formatStat, parseStat } from "@/lib/movie/format";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/movie/gsap";
import { useMovie } from "./MovieContext";

/** Counts up to `value` (e.g. "6+", "3") when scrolled into view. Shows the final value without motion. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { ready, reduced } = useMovie();

  useGSAP(
    () => {
      const el = ref.current;
      const parsed = parseStat(value);
      if (!ready || reduced || !el || !parsed) return;

      const state = { n: 0 };
      el.textContent = formatStat(parsed, 0);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(state, {
            n: parsed.value,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatStat(parsed, state.n);
            },
            onComplete: () => {
              el.textContent = value;
            },
          });
        },
      });

      return () => {
        trigger.kill();
        el.textContent = value;
      };
    },
    { scope: ref, dependencies: [ready, reduced, value] }
  );

  return (
    <span ref={ref} suppressHydrationWarning className="tabular-nums">
      {value}
    </span>
  );
}
