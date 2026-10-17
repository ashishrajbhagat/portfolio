"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import { detectQuality, hasWebGL, qualitySettings, type QualitySettings } from "@/lib/space/quality";

// three.js is only loaded in the browser, after the page is interactive.
const SpaceCanvas = dynamic(() => import("./canvas/SpaceCanvas"), { ssr: false, loading: () => null });

class CanvasBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("space: WebGL scene failed, falling back to the CSS sky", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Mode = "checking" | "webgl" | "css";

interface SpaceBackdropProps {
  reduced: boolean;
  onOpenProject: (id: string) => void;
}

/**
 * Fixed full-screen sky. A pure CSS gradient is always there as the base (no black flash while three.js loads,
 * and the whole experience still works without WebGL); the 3D scene renders on top when it can.
 */
export default function SpaceBackdrop({ reduced, onOpenProject }: SpaceBackdropProps) {
  const [mode, setMode] = useState<Mode>("checking");
  const [quality, setQuality] = useState<QualitySettings>(() => qualitySettings("high"));

  useEffect(() => {
    if (hasWebGL()) {
      setQuality(qualitySettings(detectQuality()));
      setMode("webgl");
    } else {
      setMode("css");
    }
  }, []);

  return (
    <div aria-hidden className="space-backdrop fixed inset-0 z-0" data-mode={mode}>
      {mode === "webgl" && (
        <CanvasBoundary onError={() => setMode("css")}>
          <SpaceCanvas quality={quality} reduced={reduced} onOpenProject={onOpenProject} />
        </CanvasBoundary>
      )}
    </div>
  );
}
