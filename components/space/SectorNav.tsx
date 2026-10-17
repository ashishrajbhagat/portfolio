"use client";

import { flavor } from "@/content/flavor";
import { sectionOrder } from "@/content/types";
import { useActiveSection } from "@/lib/use-active-section";
import { useSpace } from "./SpaceContext";

/** Right-edge index of sectors (large screens). */
export default function SectorNav() {
  const { scrollTo } = useSpace();
  const active = useActiveSection(sectionOrder, "hero");

  return (
    <nav aria-label="Sectors" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <ol className="flex flex-col items-end gap-2.5">
        {sectionOrder.map((id) => {
          const label = flavor.space[id].title;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(id);
                }}
                aria-label={label}
                aria-current={active === id ? "true" : undefined}
                className="group flex items-center justify-end gap-3"
              >
                <span className="pointer-events-none translate-x-1 text-xs text-s-fg opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                  {label}
                </span>
                <span
                  className={`block rounded-full transition-all ${
                    active === id ? "h-2.5 w-2.5 bg-s-cyan shadow-[0_0_10px_var(--s-cyan)]" : "h-1.5 w-1.5 bg-s-fg/40 group-hover:bg-s-fg"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
