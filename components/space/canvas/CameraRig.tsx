"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { space } from "@/lib/space/store";
import { pointAt, tangentAt } from "@/lib/space/waypoints";

const BASE_FOV = 60;
const WARP_SECONDS = 2.6;
const WARP_DISTANCE = 90;
const WARP_FOV = 45;
const UP = new Vector3(0, 1, 0);

/**
 * Flies the camera along the route according to the page's scroll position.
 * - Smooths scroll with exponential damping.
 * - Opens with a short hyperspace "jump" (camera rushes in from far behind with a wide field of view).
 * - Adds a gentle pointer parallax and a field-of-view kick while scrolling fast.
 * With reduced motion the camera simply holds the launch-pad view.
 */
export default function CameraRig({ reduced }: { reduced: boolean }) {
  const smoothT = useRef(0);
  const startedAt = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 });

  const scratch = useMemo(
    () => ({ position: new Vector3(), tangent: new Vector3(), side: new Vector3(), target: new Vector3() }),
    []
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame(({ camera, clock }, delta) => {
    const cam = camera as PerspectiveCamera;
    const { position, tangent, side, target } = scratch;

    if (reduced) {
      pointAt(0, position);
      tangentAt(0, tangent);
      cam.position.copy(position);
      target.copy(position).addScaledVector(tangent, 10);
      cam.lookAt(target);
      return;
    }

    smoothT.current = MathUtils.damp(smoothT.current, space.t, 3.2, delta);
    pointAt(smoothT.current, position);
    tangentAt(smoothT.current, tangent);

    // Hyperspace jump on arrival.
    if (startedAt.current === null) startedAt.current = clock.elapsedTime;
    const k = MathUtils.clamp((clock.elapsedTime - startedAt.current) / WARP_SECONDS, 0, 1);
    const warp = Math.pow(1 - k, 3); // ease-out: 1 at the start, 0 when settled
    position.addScaledVector(tangent, -WARP_DISTANCE * warp);

    // Pointer parallax.
    const p = pointer.current;
    p.smoothX = MathUtils.damp(p.smoothX, p.x, 2.5, delta);
    p.smoothY = MathUtils.damp(p.smoothY, p.y, 2.5, delta);
    side.crossVectors(tangent, UP).normalize();
    position.addScaledVector(side, p.smoothX * 1.4).addScaledVector(UP, -p.smoothY * 0.9);

    cam.position.copy(position);
    target.copy(position).addScaledVector(tangent, 10);
    cam.lookAt(target);

    // Speed kick.
    const targetFov = BASE_FOV + MathUtils.clamp(Math.abs(space.velocity) * 6, 0, 10) + WARP_FOV * warp;
    const nextFov = MathUtils.damp(cam.fov, targetFov, 6, delta);
    if (Math.abs(nextFov - cam.fov) > 0.01) {
      cam.fov = nextFov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
