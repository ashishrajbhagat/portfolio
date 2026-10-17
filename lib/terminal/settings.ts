import { readStorage, writeStorage } from "./storage";
import { terminalThemes, type TerminalSettings } from "./types";

const KEY = "ashish-os-settings";
export const BOOT_SESSION_KEY = "ashish-os-booted";

export const defaultSettings: TerminalSettings = { theme: "neon", crt: true };

/** Parses stored settings defensively: anything unexpected falls back to defaults. */
export function parseSettings(raw: string | null): TerminalSettings {
  if (!raw) return defaultSettings;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return defaultSettings;
    const { theme, crt } = value as Record<string, unknown>;
    return {
      theme: terminalThemes.includes(theme as TerminalSettings["theme"])
        ? (theme as TerminalSettings["theme"])
        : defaultSettings.theme,
      crt: typeof crt === "boolean" ? crt : defaultSettings.crt,
    };
  } catch {
    return defaultSettings;
  }
}

export function loadSettings(): TerminalSettings {
  return parseSettings(readStorage("local", KEY));
}

export function saveSettings(settings: TerminalSettings): void {
  writeStorage("local", KEY, JSON.stringify(settings));
}
