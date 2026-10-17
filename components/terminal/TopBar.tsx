"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className="t-dim hidden tabular-nums sm:inline" suppressHydrationWarning>
      {time}
    </time>
  );
}

interface TopBarProps {
  plain: boolean;
  onTogglePlain: () => void;
}

export default function TopBar({ plain, onTogglePlain }: TopBarProps) {
  return (
    <header className="term-bar flex shrink-0 items-center justify-between gap-3 px-4 py-2 text-xs sm:text-sm">
      <span className="t-gradient font-bold">AshishOS 1.0</span>
      <nav aria-label="Terminal controls" className="flex items-center gap-2 sm:gap-4">
        <Clock />
        <button type="button" onClick={onTogglePlain} className="t-btn" aria-pressed={plain}>
          {plain ? "Terminal view" : "Plain view"}
        </button>
        <Link href="/" className="t-btn">
          Switch Profile
        </Link>
      </nav>
    </header>
  );
}
