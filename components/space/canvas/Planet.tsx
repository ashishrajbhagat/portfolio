"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Color, DoubleSide, MathUtils, ShaderMaterial, type Group, type Mesh, type Vector3 } from "three";
import { space } from "@/lib/space/store";
import { makePlanetTexture } from "@/lib/space/textures";

export interface PlanetRing {
  inner: number;
  outer: number;
  color: string;
  tilt?: number;
}

interface PlanetProps {
  /** Project id: when it matches `space.focusId` the planet swells and brightens. */
  id?: string;
  position: Vector3;
  radius: number;
  palette: string[];
  seed: number;
  segments: number;
  atmosphere?: string;
  ring?: PlanetRing;
  /** Radians per second. */
  spin?: number;
  animate?: boolean;
  onSelect?: () => void;
}

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 glow;
  uniform float strength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - abs(dot(vNormal, vView)), 3.0);
    gl_FragColor = vec4(glow, rim * strength);
  }
`;

/** A procedurally painted planet with a rim-lit atmosphere, an optional ring, and optional click handling. */
export default function Planet({
  id, position, radius, palette, seed, segments, atmosphere, ring, spin = 0.05, animate = true, onSelect,
}: PlanetProps) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);

  const texture = useMemo(() => makePlanetTexture(seed, palette), [seed, palette]);
  const glowMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { glow: { value: new Color(atmosphere ?? palette[1]) }, strength: { value: 0.95 } },
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        transparent: true,
        blending: AdditiveBlending,
        side: BackSide,
        depthWrite: false,
      }),
    [atmosphere, palette]
  );

  useEffect(
    () => () => {
      texture.dispose();
      glowMaterial.dispose();
    },
    [texture, glowMaterial]
  );

  useFrame((_, delta) => {
    if (!animate) return;
    if (body.current) body.current.rotation.y += delta * spin;
    if (group.current && id) {
      const target = space.focusId === id ? 1.14 : 1;
      group.current.scale.setScalar(MathUtils.damp(group.current.scale.x, target, 6, delta));
      glowMaterial.uniforms.strength.value = MathUtils.damp(
        glowMaterial.uniforms.strength.value,
        space.focusId === id ? 1.8 : 0.95,
        6,
        delta
      );
    }
  });

  const interactive = Boolean(onSelect);

  return (
    <group ref={group} position={position}>
      <mesh
        ref={body}
        onClick={
          interactive
            ? (event) => {
                event.stopPropagation();
                onSelect?.();
              }
            : undefined
        }
        onPointerOver={
          interactive
            ? (event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
                if (id) space.focusId = id;
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                document.body.style.cursor = "";
                if (id && space.focusId === id) space.focusId = null;
              }
            : undefined
        }
      >
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial map={texture} roughness={0.92} metalness={0} />
      </mesh>

      <mesh scale={1.14} material={glowMaterial}>
        <sphereGeometry args={[radius, Math.max(24, segments / 2), Math.max(24, segments / 2)]} />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2 + (ring.tilt ?? 0.35), 0, 0.2]}>
          <ringGeometry args={[ring.inner, ring.outer, 96]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.5} side={DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
