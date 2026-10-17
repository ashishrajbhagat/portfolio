import { CatmullRomCurve3, Vector3 } from "three";
import { sectionOrder, type SectionKey } from "@/content/types";

export const SECTION_COUNT = sectionOrder.length;
export const LAST_INDEX = SECTION_COUNT - 1;
/** Distance between consecutive scenes along the flight path, in world units. */
export const SCENE_SPACING = 70;

const UP = new Vector3(0, 1, 0);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** One waypoint per scene, snaking gently so the flight never feels like a straight tunnel. */
export function waypointPositions(): Vector3[] {
  return sectionOrder.map((_, i) => new Vector3(Math.sin(i * 1.1) * 14, Math.cos(i * 0.8) * 5, -i * SCENE_SPACING));
}

let curve: CatmullRomCurve3 | null = null;

/** The flight path. Scene position `t` maps to the curve so that integer values hit a waypoint exactly. */
export function getCurve(): CatmullRomCurve3 {
  if (!curve) curve = new CatmullRomCurve3(waypointPositions(), false, "catmullrom", 0.5);
  return curve;
}

const toCurveU = (t: number) => clamp(t / LAST_INDEX, 0, 1);

export function pointAt(t: number, target: Vector3 = new Vector3()): Vector3 {
  return getCurve().getPoint(toCurveU(t), target);
}

export function tangentAt(t: number, target: Vector3 = new Vector3()): Vector3 {
  return getCurve().getTangent(toCurveU(t), target);
}

/**
 * A point near the flight path: `right` units to the camera's right, `up` units above the path and `ahead` units
 * further along it, measured from scene position `t`. Used to hang planets and stations beside the route.
 */
export function placeAt(t: number, right = 0, up = 0, ahead = 0): Vector3 {
  const forward = tangentAt(t);
  const side = new Vector3().crossVectors(forward, UP).normalize();
  return pointAt(t).addScaledVector(side, right).addScaledVector(UP, up).addScaledVector(forward, ahead);
}

export function sceneIndex(id: SectionKey): number {
  return sectionOrder.indexOf(id);
}
