"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSpace } from "./SpaceContext";

type RevealState = "visible" | "hidden" | "shown";

/**
 * Fades content in as it scrolls into view. Content is visible by default (server render, no JavaScript,
 * reduced motion); it is only hidden if it starts below the fold.
 */
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useSpace();
  const [state, setState] = useState<RevealState>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div ref={ref} data-state={state} className={`space-reveal ${className}`}>
      {children}
    </div>
  );
}
