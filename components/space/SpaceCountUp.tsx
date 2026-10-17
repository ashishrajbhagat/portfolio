"use client";

import { useEffect, useRef, useState } from "react";
import { formatStat, parseStat } from "@/lib/movie/format";
import { useSpace } from "./SpaceContext";

/** Counts up to `value` when scrolled into view. Shows the final value straight away without motion. */
export default function SpaceCountUp({ value }: { value: string }) {
  const { reduced } = useSpace();
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseStat(value);
    if (!el || !parsed || reduced || typeof IntersectionObserver === "undefined") {
      setText(value);
      return;
    }

    let frame = 0;
    setText(formatStat(parsed, 0));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1500;
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setText(progress < 1 ? formatStat(parsed, parsed.value * eased) : value);
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
    </span>
  );
}
