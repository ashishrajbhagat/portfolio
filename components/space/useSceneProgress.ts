"use client";

import { useEffect } from "react";
import { sectionOrder } from "@/content/types";
import { applyEndBlend, computeSceneT, referenceLine } from "@/lib/space/scene-progress";
import { space } from "@/lib/space/store";

/**
 * Turns page scroll into a continuous scene position (`space.t`) and a smoothed scroll velocity.
 * Layout is only measured when the scroll position or window size actually changed.
 */
export function useSceneProgress(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const lastIndex = sectionOrder.length - 1;
    let elements: HTMLElement[] = [];
    let frame = 0;
    let lastTime = performance.now();
    let lastScrollY = Number.NaN;
    let lastWidth = 0;
    let lastHeight = 0;
    let previousT = space.t;

    const collect = () => {
      elements = sectionOrder
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);
    };

    const tick = (now: number) => {
      const dt = Math.max(0.001, (now - lastTime) / 1000);
      lastTime = now;

      if (elements.length !== sectionOrder.length) collect();

      const { scrollY, innerWidth, innerHeight } = window;
      const changed = scrollY !== lastScrollY || innerWidth !== lastWidth || innerHeight !== lastHeight;

      if (changed && elements.length === sectionOrder.length) {
        lastScrollY = scrollY;
        lastWidth = innerWidth;
        lastHeight = innerHeight;

        const maxScroll = document.documentElement.scrollHeight - innerHeight;
        const pageProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
        const rects = elements.map((el) => {
          const rect = el.getBoundingClientRect();
          return { top: rect.top, height: rect.height };
        });

        const t = applyEndBlend(computeSceneT(rects, referenceLine(innerHeight, pageProgress)), lastIndex, pageProgress);
        const raw = (t - previousT) / dt;
        previousT = t;
        space.t = t;
        space.velocity += (raw - space.velocity) * 0.15;
      } else {
        space.velocity *= 0.9; // coast to a stop when the page is not moving
        if (Math.abs(space.velocity) < 0.001) space.velocity = 0;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);
}
