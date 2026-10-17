"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface LiveSitePreviewProps {
  url: string;
  title: string;
  /** Accent colour for the active toggle and the link (the calling theme's highlight). */
  accent?: string;
}

type Device = "desktop" | "mobile";

/**
 * A live, interactive preview of a real website inside a browser-style frame, with a desktop / mobile toggle.
 * The iframe is sandboxed, only loads once the dialog is opened, and always has an "Open in a new tab" link because
 * some sites refuse to be embedded (the browser then shows its own "refused to connect" page inside the frame).
 */
export default function LiveSitePreview({ url, title, accent = "#c9a45c" }: LiveSitePreviewProps) {
  const [device, setDevice] = useState<Device>("desktop");
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const host = new URL(url).hostname;

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  const toggle = (value: Device, label: string) => (
    <button
      type="button"
      onClick={() => setDevice(value)}
      aria-pressed={device === value}
      className="rounded px-2.5 py-1 text-xs transition-colors"
      style={device === value ? { background: accent, color: "#000" } : { color: "inherit", opacity: 0.75 }}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden border-b border-white/10 bg-black/40" style={{ "--accent": accent } as CSSProperties}>
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-xs">
          <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 shrink-0 opacity-70" fill="currentColor">
            <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Z" />
          </svg>
          <span className="truncate">{host}</span>
        </span>
        <span className="flex items-center gap-1" role="group" aria-label="Preview size">
          {toggle("desktop", "Desktop")}
          {toggle("mobile", "Mobile")}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden whitespace-nowrap text-xs underline-offset-4 hover:underline sm:inline"
          style={{ color: accent }}
        >
          Open ↗
        </a>
      </div>

      <div className="relative flex h-[52vh] min-h-[300px] justify-center overflow-auto bg-[#101013]">
        {!loaded && (
          <div aria-hidden className="absolute inset-0 grid place-items-center text-xs opacity-60">
            <span className="animate-pulse">Loading live preview…</span>
          </div>
        )}
        <div className={`relative h-full bg-white transition-[width] duration-300 ${device === "mobile" ? "w-[390px] max-w-full" : "w-full"}`}>
          <iframe
            src={url}
            title={`${title}: live preview`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
          />
        </div>
      </div>

      <p className="px-4 py-2 text-xs opacity-70" role={slow && !loaded ? "status" : undefined}>
        {slow && !loaded ? "Taking a while to load. " : "Preview not loading? "}
        Some sites block embedding.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: accent }}>
          Open {host} in a new tab ↗
        </a>
      </p>
    </div>
  );
}
