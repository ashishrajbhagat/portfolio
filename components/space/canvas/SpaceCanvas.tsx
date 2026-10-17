"use client";

import { Canvas } from "@react-three/fiber";
import type { QualitySettings } from "@/lib/space/quality";
import CameraRig from "./CameraRig";
import SceneObjects from "./SceneObjects";

interface SpaceCanvasProps {
  quality: QualitySettings;
  reduced: boolean;
  onOpenProject: (id: string) => void;
}

/** The WebGL scene. Loaded lazily (client only) from SpaceBackdrop. */
export default function SpaceCanvas({ quality, reduced, onOpenProject }: SpaceCanvasProps) {
  return (
    <Canvas
      dpr={[1, quality.maxDpr]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: quality.quality === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 60, near: 0.1, far: 2600, position: [0, 0, 0] }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Let the browser restore the context after a GPU reset instead of leaving a dead canvas.
        gl.domElement.addEventListener("webglcontextlost", (event) => event.preventDefault());
      }}
    >
      <fog attach="fog" args={["#04050d", 110, 800]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[40, 30, 25]} intensity={2.6} color="#fff1dd" />
      <CameraRig reduced={reduced} />
      <SceneObjects quality={quality} animate={!reduced} onOpenProject={onOpenProject} />
    </Canvas>
  );
}
