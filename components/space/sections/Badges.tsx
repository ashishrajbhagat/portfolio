import { certificationDates, certifications } from "@/content/education";
import Reveal from "../Reveal";
import AdobeMark from "@/components/AdobeMark";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Badges() {
  return (
    <SectorSection id="certifications">
      <SectorHeading id="certifications" />
      <ul className="grid gap-6 md:grid-cols-3">
        {certifications.map((cert, index) => (
          <li key={cert.id}>
            <Reveal>
              <article className="space-panel badge-float p-7 text-center" style={{ animationDelay: `${index * 0.8}s` }}>
                <AdobeMark className="mx-auto h-16 w-16" />
                <h3 className="mt-4 font-space text-lg font-semibold leading-snug">{cert.title}</h3>
                <p className="font-hud mt-2 text-[11px] tracking-[0.25em] text-s-cyan">{cert.issuer.toUpperCase()}</p>
                <p className="font-hud mt-1 text-[11px] text-s-warm">{certificationDates(cert)}</p>
                <p className="mt-4 text-sm text-s-dim">{cert.note}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectorSection>
  );
}
