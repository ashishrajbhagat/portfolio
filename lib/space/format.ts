import { pad2 } from "@/lib/movie/format";

/** Total distance of the journey, in light years (purely for fun). */
export const JOURNEY_LIGHT_YEARS = 12.4;

export function distanceLy(t: number, lastIndex: number): string {
  const progress = lastIndex > 0 ? Math.min(1, Math.max(0, t / lastIndex)) : 0;
  return `${(progress * JOURNEY_LIGHT_YEARS).toFixed(2)} ly`;
}

/** Fraction of light speed, capped so the readout never claims to break physics for long. */
export function velocityLabel(scenesPerSecond: number): string {
  const speed = Math.min(9.9, Math.abs(scenesPerSecond) * 2.4);
  return `${speed.toFixed(1)}c`;
}

export function sectorLabel(index: number, total: number): string {
  return `SECTOR ${pad2(index + 1)} / ${pad2(total)}`;
}
