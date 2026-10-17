export type Quality = "low" | "high";

export interface QualitySettings {
  quality: Quality;
  starCount: number;
  planetSegments: number;
  maxDpr: number;
}

export function qualitySettings(quality: Quality): QualitySettings {
  return quality === "low"
    ? { quality, starCount: 1800, planetSegments: 32, maxDpr: 1.25 }
    : { quality, starCount: 4500, planetSegments: 56, maxDpr: 2 };
}

/** Phones, small screens and low-core devices get the lighter scene. */
export function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const smallScreen = window.matchMedia("(max-width: 768px)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  return smallScreen || cores <= 4 ? "low" : "high";
}

/** True when the browser can create a WebGL context at all. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}
