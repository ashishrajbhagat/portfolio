"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type SpriteMaterial } from "three";
import { makeGlowTexture } from "@/lib/space/textures";
import { placeAt } from "@/lib/space/waypoints";

interface Cloud {
  t: number;
  right: number;
  up: number;
  ahead: number;
  scale: number;
  color: string;
  opacity: number;
  spin: number;
}

const clouds: Cloud[] = [
  { t: 0.6, right: -70, up: 12, ahead: 40, scale: 220, color: "#5b4bdb", opacity: 0.32, spin: 0.012 },
  { t: 2.2, right: 80, up: -18, ahead: 30, scale: 240, color: "#1fa2c4", opacity: 0.24, spin: -0.01 },
  { t: 3.8, right: -85, up: 20, ahead: 20, scale: 260, color: "#a23bd1", opacity: 0.26, spin: 0.008 },
  { t: 5.4, right: 90, up: 10, ahead: 40, scale: 230, color: "#3b5bdb", opacity: 0.3, spin: -0.012 },
  { t: 7, right: -75, up: -14, ahead: 30, scale: 250, color: "#d1478a", opacity: 0.22, spin: 0.01 },
  { t: 8.6, right: 85, up: 16, ahead: 20, scale: 240, color: "#1fa2c4", opacity: 0.26, spin: -0.009 },
  { t: 10.2, right: -80, up: 8, ahead: 40, scale: 260, color: "#6d4bdb", opacity: 0.28, spin: 0.011 },
  { t: 11.8, right: 70, up: -10, ahead: 30, scale: 230, color: "#e08a3b", opacity: 0.2, spin: -0.01 },
];

/** Big, faint, additive clouds of colour far off to the sides of the route. */
export default function Nebulae({ animate }: { animate: boolean }) {
  const map = useMemo(() => makeGlowTexture("rgba(255,255,255,0.9)", 256), []);
  const materials = useRef<Array<SpriteMaterial | null>>([]);
  const placed = useMemo(() => clouds.map((c) => ({ ...c, position: placeAt(c.t, c.right, c.up, c.ahead) })), []);

  useEffect(() => () => map.dispose(), [map]);

  useFrame((_, delta) => {
    if (!animate) return;
    placed.forEach((cloud, i) => {
      const material = materials.current[i];
      if (material) material.rotation += cloud.spin * delta;
    });
  });

  return (
    <group>
      {placed.map((cloud, i) => (
        <sprite key={i} position={cloud.position} scale={[cloud.scale, cloud.scale, 1]}>
          <spriteMaterial
            ref={(material) => {
              materials.current[i] = material;
            }}
            map={map}
            color={cloud.color}
            opacity={cloud.opacity}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}
