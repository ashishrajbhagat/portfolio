import { resume } from "@/content/contact";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Dossier() {
  return (
    <SectorSection id="resume">
      <SectorHeading id="resume" />
      <Reveal>
        <div className="space-panel relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <span aria-hidden className="stamp font-hud absolute right-5 top-4 px-3 py-1 text-[10px] sm:right-8 sm:top-6">
            CLEARANCE GRANTED
          </span>
          <div className="pt-6 sm:pt-0">
            <p className="font-space text-2xl font-semibold sm:text-3xl">{resume.headline}</p>
            <p className="mt-3 max-w-prose text-s-dim">{resume.description}</p>
          </div>
          <a
            href={resume.url}
            download
            className="shrink-0 rounded bg-s-accent px-6 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            {resume.fileLabel}
          </a>
        </div>
      </Reveal>
    </SectorSection>
  );
}
