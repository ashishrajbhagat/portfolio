import { funFacts } from "@/content/fun";
import SceneHeading from "../SceneHeading";

export default function BehindScenes() {
  return (
    <section id="funFacts" aria-labelledby="funFacts-title" data-aurora="rose" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="funFacts" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {funFacts.items.map((fact, index) => (
            <li key={fact.text} data-reveal="" className="overflow-hidden rounded-md border border-m-line bg-white/[0.03]">
              <div
                aria-hidden
                className="flex items-center justify-between border-b border-m-line bg-[repeating-linear-gradient(115deg,#ff9f1c_0_14px,#0a141a_14px_28px)] bg-[length:100%_10px] bg-top bg-no-repeat px-4 pb-2 pt-4 text-[10px] tracking-[0.3em] text-m-dim"
              >
                <span className="text-m-amber">TAKE {index + 1}</span>
                <span>SCENE ∞</span>
              </div>
              <p className="p-6 text-base leading-relaxed">
                <span aria-hidden className="mr-2 text-xl">
                  {fact.emoji}
                </span>
                {fact.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
