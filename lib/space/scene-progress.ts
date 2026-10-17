export interface SectionRect {
  top: number;
  height: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Converts where the sections sit in the viewport into a continuous scene position:
 * 2.5 means "halfway through the third section". The reference line sits at `referenceY` (viewport pixels).
 * Gaps between sections count as the end of the previous section.
 */
export function computeSceneT(rects: SectionRect[], referenceY: number): number {
  if (rects.length === 0) return 0;

  let index = 0;
  for (let i = 0; i < rects.length; i++) {
    if (rects[i].top <= referenceY) index = i;
    else break;
  }

  const { top, height } = rects[index];
  const fraction = height > 0 ? clamp((referenceY - top) / height, 0, 1) : 0;
  return clamp(index + fraction, 0, rects.length - 1);
}

/**
 * Where the reference line sits for a given page scroll progress (0 to 1).
 * It drifts from 30% to 70% of the viewport so the last scene can still be reached at the bottom of the page.
 */
export function referenceLine(viewportHeight: number, pageProgress: number): number {
  return viewportHeight * (0.3 + 0.4 * clamp(pageProgress, 0, 1));
}

/** Blends the final stretch of the page toward the last scene so the journey always ends where it should. */
export function applyEndBlend(t: number, lastIndex: number, pageProgress: number): number {
  const blend = clamp((pageProgress - 0.97) / 0.03, 0, 1);
  return t + (lastIndex - t) * blend;
}
