/** Fixed film grain and vignette. Purely decorative and ignored by assistive tech. */
export default function FilmGrain() {
  return (
    <>
      <div aria-hidden className="film-vignette" />
      <div aria-hidden className="film-grain" />
    </>
  );
}
