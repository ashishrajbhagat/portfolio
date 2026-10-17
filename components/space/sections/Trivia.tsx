import { funFacts } from "@/content/fun";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

export default function Trivia() {
  return (
    <SectorSection id="funFacts">
      <SectorHeading id="funFacts" />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {funFacts.items.map((fact, index) => (
          <li key={fact.text}>
            <Reveal className="h-full">
              <article className="space-panel h-full p-6">
                <p className="font-hud text-[11px] tracking-[0.3em] text-s-cyan">COSMIC FACT #{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-base leading-relaxed">
                  <span aria-hidden className="mr-2 text-xl">
                    {fact.emoji}
                  </span>
                  {fact.text}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectorSection>
  );
}
