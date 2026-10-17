/**
 * Tiny mutable bridge between the scrolling HTML and the WebGL canvas.
 * The canvas runs its own render loop, so values are read every frame instead of flowing through React state.
 */
export interface SpaceState {
  /** Scene position along the journey, 0 (launch pad) to SECTION_COUNT - 1 (mission complete). */
  t: number;
  /** Rate of change of `t` in scenes per second, used for the speed-boost field of view. */
  velocity: number;
  /** Project id currently hovered or focused in the HTML, so its planet can light up. */
  focusId: string | null;
}

export const space: SpaceState = { t: 0, velocity: 0, focusId: null };

export function resetSpace(): void {
  space.t = 0;
  space.velocity = 0;
  space.focusId = null;
}
