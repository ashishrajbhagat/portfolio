"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh, MeshBasicMaterial, Vector3 } from "three";

const RINGS = 3;

/** A signal beacon: rings of light that expand outward and fade. Static when motion is reduced. */
export default function Beacon({ position, animate = true }: { position: Vector3; animate?: boolean }) {
  const rings = useRef<Array<Mesh | null>>([]);

  useFrame(({ clock }) => {
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = animate ? (clock.elapsedTime * 0.45 + i / RINGS) % 1 : (i + 0.5) / RINGS;
      ring.scale.setScalar(1 + phase * 9);
      (ring.material as MeshBasicMaterial).opacity = (1 - phase) * 0.55;
    });
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#7fdbff" />
      </mesh>
      {Array.from({ length: RINGS }).map((_, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            rings.current[i] = mesh;
          }}
          rotation={[Math.PI / 2.6, 0.3, 0]}
        >
          <torusGeometry args={[1, 0.025, 8, 80]} />
          <meshBasicMaterial color="#7fdbff" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
