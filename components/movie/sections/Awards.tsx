import { certificationDates, certifications } from "@/content/education";
import AdobeMark from "@/components/AdobeMark";
import SceneHeading from "../SceneHeading";

export default function Awards() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" data-aurora="amber" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="certifications" />
        <ul className="grid gap-6 md:grid-cols-3">
          {certifications.map((cert) => (
            <li key={cert.id} data-reveal="" className="rounded-md border border-m-gold/30 bg-gradient-to-b from-m-gold/[0.06] to-transparent p-8 text-center shadow-[0_20px_50px_-30px_var(--m-gold)]">
              <AdobeMark className="mx-auto h-16 w-16 shadow-[0_14px_30px_-14px_#fa0f00]" />
              <h3 className="mt-5 font-title text-xl leading-snug">{cert.title}</h3>
              <p className="mt-2 text-xs tracking-[0.25em] text-m-gold">{cert.issuer.toUpperCase()}</p>
              <p className="mt-1 text-xs text-m-dim">{certificationDates(cert)}</p>
              <p className="mt-4 text-sm text-m-dim">{cert.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
