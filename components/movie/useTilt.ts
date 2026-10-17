"use client";

import { useEffect, type RefObject } from "react";

/** Subtle 3D tilt toward the pointer. Only on devices with a fine pointer and when motion is allowed. */
export function useTilt(ref: RefObject<HTMLElement | null>, enabled: boolean, max = 7) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--ry", `${(x * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--rx", `${(-y * max * 2).toFixed(2)}deg`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [ref, enabled, max]);
}
