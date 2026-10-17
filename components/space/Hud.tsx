"use client";

import { useEffect, useRef } from "react";
import { flavor } from "@/content/flavor";
import { sectionOrder } from "@/content/types";
import { useActiveSection } from "@/lib/use-active-section";
import { distanceLy, sectorLabel, velocityLabel } from "@/lib/space/format";
import { space } from "@/lib/space/store";
import { useSpace } from "./SpaceContext";

/** Bottom-left telemetry. Sector comes from React; distance and velocity are written straight to the DOM each frame. */
export default function Hud() {
  const { reduced } = useSpace();
  const active = useActiveSection(sectionOrder, "hero");
  const distance = useRef<HTMLSpanElement>(null);
  const velocity = useRef<HTMLSpanElement>(null);
  const index = sectionOrder.indexOf(active);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let lastDistance = "";
    let lastVelocity = "";

    const tick = () => {
      const nextDistance = distanceLy(space.t, sectionOrder.length - 1);
      const nextVelocity = velocityLabel(space.velocity);
      if (distance.current && nextDistance !== lastDistance) distance.current.textContent = lastDistance = nextDistance;
      if (velocity.current && nextVelocity !== lastVelocity) velocity.current.textContent = lastVelocity = nextVelocity;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return (
    <aside
      aria-label="Flight telemetry"
      className="font-hud pointer-events-none fixed bottom-3 left-3 z-40 text-[10px] leading-relaxed tracking-[0.18em] text-s-dim sm:bottom-5 sm:left-5 sm:text-xs"
    >
      <p className="text-s-cyan">{sectorLabel(index, sectionOrder.length)}</p>
      <p className="text-s-fg">{flavor.space[active].title.toUpperCase()}</p>
      {!reduced && (
        <p className="mt-1">
          DIST <span ref={distance}>0.00 ly</span> · VEL <span ref={velocity}>0.0c</span>
        </p>
      )}
    </aside>
  );
}
