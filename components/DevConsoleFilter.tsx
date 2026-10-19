"use client";

import { installWarnFilter } from "@/lib/dev-console";

// Installed while this module loads (before any component renders), in development only.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const flag = "__devConsoleFilterInstalled";
  const scope = window as unknown as Record<string, unknown>;
  if (!scope[flag]) {
    scope[flag] = true;
    installWarnFilter(console);
  }
}

/** Renders nothing: it exists so the filter above is part of the client bundle. */
export default function DevConsoleFilter() {
  return null;
}
