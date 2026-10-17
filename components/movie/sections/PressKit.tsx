import { resume } from "@/content/contact";
import SceneHeading from "../SceneHeading";

export default function PressKit() {
  return (
    <section id="resume" aria-labelledby="resume-title" data-aurora="teal" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="resume" />
        <div data-reveal="" className="flex flex-col items-start gap-6 rounded-md border border-m-line bg-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <p className="font-title text-2xl sm:text-3xl">{resume.headline}</p>
            <p className="mt-3 max-w-prose text-m-dim">{resume.description}</p>
          </div>
          <a
            href={resume.url}
            download
            className="shrink-0 rounded bg-m-amber hover:bg-m-gold px-6 py-3 font-semibold text-black shadow-[0_14px_34px_-18px_var(--m-amber)] transition-transform hover:-translate-y-0.5"
          >
            {resume.fileLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
