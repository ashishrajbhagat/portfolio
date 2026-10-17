"use client";

import { useEffect, useState } from "react";

/** Tracks which of the given section ids is crossing the middle of the viewport. */
export function useActiveSection<T extends string>(ids: readonly T[], initial: T): T {
  const [active, setActive] = useState<T>(initial);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as T);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
