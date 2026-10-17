"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Vector3 } from "three";

/** A client outpost: a rotating habitat ring with solar wings and a beacon light. */
export default function Station({ position, animate = true }: { position: Vector3; animate?: boolean }) {
  const ringGroup = useRef<Group>(null);

  useFrame((_, delta) => {
    if (animate && ringGroup.current) ringGroup.current.rotation.z += delta * 0.18;
  });

  const metal = { color: "#aab2d6", metalness: 0.65, roughness: 0.35 } as const;

  return (
    <group position={position} rotation={[0.35, -0.5, 0.1]} scale={1.15}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 6, 20]} />
        <meshStandardMaterial {...metal} />
      </mesh>

      <group ref={ringGroup} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.38, 14, 64]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 7.2, 8]} />
            <meshStandardMaterial {...metal} />
          </mesh>
        ))}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0.4]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#ffd9a0" />
            </mesh>
          );
        })}
      </group>

      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 4.4, 0, 0]}>
          <boxGeometry args={[3.2, 0.06, 1.6]} />
          <meshStandardMaterial color="#2747a8" emissive="#1d3a8a" emissiveIntensity={0.6} metalness={0.4} roughness={0.35} />
        </mesh>
      ))}

      <mesh position={[0, 0, 3.1]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshBasicMaterial color="#7fdbff" />
      </mesh>
    </group>
  );
}
