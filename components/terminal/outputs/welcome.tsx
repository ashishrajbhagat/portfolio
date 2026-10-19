"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { bannerLines } from "@/lib/terminal/ascii";
import { site } from "@/content/site";

/** Types `text` out character by character. Renders instantly under reduced motion. */
export function Typewriter({ text, speed = 22, startDelay = 250 }: { text: string; speed?: number; startDelay?: number }) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            window.clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [reduced, text, speed, startDelay]);

  // The full sentence is available to screen readers at once; the typed-out copy is purely visual.
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{text.slice(0, count)}</span>
    </>
  );
}

export function WelcomeBanner() {
  return (
    <div className="space-y-3">
      <h1 className="sr-only">{site.name}: terminal portfolio</h1>
      <pre aria-hidden className="t-gradient overflow-x-auto text-[7px] leading-[1.1] min-[400px]:text-[9px] sm:text-[12px]">
        {bannerLines.join("\n")}
      </pre>
      <p className="t-dim">
        <Typewriter text="Welcome to AshishOS 1.0. Type `help` to see what this machine can do." />
      </p>
    </div>
  );
}
