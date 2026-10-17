import { testimonials } from "@/content/fun";
import Reveal from "../Reveal";
import SectorHeading from "../SectorHeading";
import SectorSection from "../SectorSection";

const STRENGTH = [5, 4, 5, 3];

function SignalBars({ strength }: { strength: number }) {
  return (
    <span role="img" aria-label={`Signal strength ${strength} of 5`} className="inline-flex items-end gap-0.5">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span
          key={bar}
          aria-hidden
          className={`w-1 rounded-sm ${bar <= strength ? "bg-s-cyan" : "bg-s-line"}`}
          style={{ height: `${4 + bar * 3}px` }}
        />
      ))}
    </span>
  );
}

export default function Transmissions() {
  return (
    <SectorSection id="testimonials">
      <SectorHeading id="testimonials" />
      <ul className="grid gap-6 md:grid-cols-2">
        {testimonials.items.map((signal, index) => (
          <li key={signal.name}>
            <Reveal className="h-full">
              <figure className="space-panel h-full p-6 sm:p-7">
                <div className="font-hud flex items-center justify-between text-[11px] tracking-[0.25em] text-s-cyan">
                  <span>INCOMING SIGNAL</span>
                  <SignalBars strength={STRENGTH[index % STRENGTH.length]} />
                </div>
                <blockquote className="mt-4 font-space text-xl leading-snug sm:text-2xl">&ldquo;{signal.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{signal.name}</span>
                  <span className="text-s-dim">, {signal.title}</span>
                </figcaption>
                <p className="font-hud mt-3 text-[10px] tracking-[0.25em] text-s-warm">AUTHENTICITY: UNVERIFIED</p>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </SectorSection>
  );
}
