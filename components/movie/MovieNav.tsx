"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SectionKey } from "@/content/types";
import { scenes } from "@/lib/movie/scenes";
import { useMovie } from "./MovieContext";

/** Top bar plus a right-edge scene index that tracks which scene is on screen. */
export default function MovieNav() {
  const { scrollTo } = useMovie();
  const [active, setActive] = useState<SectionKey>("hero");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionKey);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    scenes.forEach((scene) => {
      const el = document.getElementById(scene.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-5 py-4 sm:px-10">
        <a
          href="#hero"
          onClick={(event) => {
            event.preventDefault();
            scrollTo("hero");
          }}
          className="text-grad-warm font-title text-xl italic tracking-wide"
        >
          Ashish Raj
        </a>
        <Link
          href="/"
          className="rounded border border-m-line px-3 py-1.5 text-sm text-m-fg transition-colors hover:border-m-amber hover:text-m-amber"
        >
          Switch Profile
        </Link>
      </header>

      <nav aria-label="Scenes" className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
        <ol className="flex flex-col items-end gap-2.5">
          {scenes.map((scene) => (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(scene.id);
                }}
                aria-label={scene.label}
                aria-current={active === scene.id ? "true" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span className="pointer-events-none translate-x-1 text-xs text-m-fg opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                  {scene.label}
                </span>
                <span
                  className={`block rounded-full transition-all ${
                    active === scene.id ? "h-2.5 w-2.5 bg-m-amber shadow-[0_0_10px_var(--m-amber)]" : "h-1.5 w-1.5 bg-m-fg/40 group-hover:bg-m-fg"
                  }`}
                />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
