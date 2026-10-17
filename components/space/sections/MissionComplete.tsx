"use client";

import Link from "next/link";
import { credits } from "@/content/credits";
import { site } from "@/content/site";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";
import { useSpace } from "../SpaceContext";

export default function MissionComplete() {
  const { scrollTo } = useSpace();

  return (
    <SectorSection id="credits" className="min-h-[120vh] pb-16">
      <SectorHeading id="credits" className="mx-auto text-center" />
      <Reveal>
        <div className="space-panel mx-auto max-w-3xl p-6 text-center sm:p-10">
          <dl className="space-y-5">
            {credits.items.map((item) => (
              <div key={item.role}>
                <dt className="font-hud text-[11px] tracking-[0.3em] text-s-dim">{item.role.toUpperCase()}</dt>
                <dd className="mt-1 font-space text-xl sm:text-2xl">{item.name}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 font-space text-xl italic leading-snug text-s-warm">{credits.postCredits}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollTo("hero")}
              className="rounded bg-s-accent px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              Replay mission
            </button>
            <Link href="/" className="rounded border border-s-line px-6 py-3 transition-colors hover:border-s-cyan hover:text-s-cyan">
              Switch Profile
            </Link>
          </div>
        </div>
      </Reveal>
      <p className="pointer-events-auto mt-12 text-center text-sm text-s-dim">
        © {new Date().getFullYear()} {site.name}. Re-entry successful. Thanks for flying with us.
      </p>
    </SectorSection>
  );
}
