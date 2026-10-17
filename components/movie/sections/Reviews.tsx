import { testimonials } from "@/content/fun";
import { accentAt } from "@/lib/movie/accents";
import SceneHeading from "../SceneHeading";

export default function Reviews() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" data-aurora="amber" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SceneHeading id="testimonials" />
        <ul className="grid gap-6 md:grid-cols-2">
          {testimonials.items.map((review, index) => (
            <li key={review.name} data-reveal="">
              <figure className="h-full rounded-md border border-m-line border-l-4 bg-white/[0.03] p-8" style={{ borderLeftColor: accentAt(index) }}>
                <p role="img" aria-label="5 out of 5 stars" className="text-lg tracking-[0.2em] text-m-gold">
                  ★★★★★
                </p>
                <blockquote className="mt-4 font-title text-xl leading-snug sm:text-2xl">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold" style={{ color: accentAt(index) }}>{review.name}</span>
                  <span className="text-m-dim">, {review.title}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
