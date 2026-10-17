import { CanvasTexture, SRGBColorSpace } from "three";
import { createRng } from "./rng";

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas is not available");
  return [canvas, ctx];
}

function finish(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Banded, blotchy planet surface painted onto a canvas. Deterministic for a given seed. */
export function makePlanetTexture(seed: number, palette: string[]): CanvasTexture {
  const rng = createRng(seed);
  const [canvas, ctx] = makeCanvas(512, 256);

  ctx.fillStyle = palette[palette.length - 1];
  ctx.fillRect(0, 0, 512, 256);

  // Horizontal bands.
  let y = 0;
  while (y < 256) {
    const height = 6 + rng() * 26;
    ctx.globalAlpha = 0.35 + rng() * 0.5;
    ctx.fillStyle = palette[Math.floor(rng() * (palette.length - 1))];
    ctx.fillRect(0, y, 512, height);
    y += height * (0.5 + rng() * 0.6);
  }

  // Soft blotches (continents, storms).
  for (let i = 0; i < 46; i++) {
    const x = rng() * 512;
    const cy = rng() * 256;
    const radius = 8 + rng() * 38;
    const gradient = ctx.createRadialGradient(x, cy, 0, x, cy, radius);
    const color = palette[Math.floor(rng() * (palette.length - 1))];
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.25 + rng() * 0.35;
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, cy - radius, radius * 2, radius * 2);
  }

  // Fine grain.
  ctx.globalAlpha = 0.07;
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = rng() > 0.5 ? "#ffffff" : "#000000";
    ctx.fillRect(rng() * 512, rng() * 256, 1 + rng() * 2, 1);
  }

  ctx.globalAlpha = 1;
  return finish(canvas);
}

/** Soft round sprite used for stars and nebula clouds. */
export function makeGlowTexture(inner = "rgba(255,255,255,1)", size = 128): CanvasTexture {
  const [canvas, ctx] = makeCanvas(size, size);
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.35, inner.replace(/[\d.]+\)$/, "0.35)"));
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return finish(canvas);
}
