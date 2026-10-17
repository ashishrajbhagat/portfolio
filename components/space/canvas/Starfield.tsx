"use client";

import { useEffect, useMemo } from "react";
import { AdditiveBlending } from "three";
import { createRng } from "@/lib/space/rng";
import { makeGlowTexture } from "@/lib/space/textures";
import { LAST_INDEX, SCENE_SPACING } from "@/lib/space/waypoints";

/** A long tube of stars around the whole route. Camera movement alone creates the parallax. */
export default function Starfield({ count }: { count: number }) {
  const { positions, colors } = useMemo(() => {
    const rng = createRng(1337);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const zFar = -(LAST_INDEX * SCENE_SPACING) - 360;
    const zNear = 170;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 340;
      positions[i * 3 + 1] = (rng() - 0.5) * 230;
      positions[i * 3 + 2] = zFar + rng() * (zNear - zFar);

      const brightness = 0.45 + rng() * 0.55;
      const tint = rng();
      // Mostly cool white, some warm, a few violet.
      const [r, g, b] = tint < 0.7 ? [0.82, 0.88, 1] : tint < 0.9 ? [1, 0.88, 0.7] : [0.7, 0.6, 1];
      colors[i * 3] = r * brightness;
      colors[i * 3 + 1] = g * brightness;
      colors[i * 3 + 2] = b * brightness;
    }
    return { positions, colors };
  }, [count]);

  const sprite = useMemo(() => makeGlowTexture("rgba(255,255,255,1)", 64), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.15}
        sizeAttenuation
        vertexColors
        map={sprite}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
