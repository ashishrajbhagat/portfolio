import type { ReactNode } from "react";

export const terminalThemes = ["neon", "green", "amber", "ice"] as const;
export type TerminalThemeName = (typeof terminalThemes)[number];

export interface TerminalSettings {
  theme: TerminalThemeName;
  crt: boolean;
}

export interface CommandContext {
  /** Current directory as path segments below the home directory. */
  cwd: string[];
  /** Previously executed lines, oldest first (includes the line being run). */
  history: string[];
  settings: TerminalSettings;
}

/** Side effects a command asks the UI to perform. Commands stay pure; the session applies these. */
export type Effect =
  | { type: "clear" }
  | { type: "exit" }
  | { type: "reboot" }
  | { type: "plain" }
  | { type: "cd"; path: string[] }
  | { type: "theme"; value: TerminalThemeName }
  | { type: "crt"; value: boolean }
  | { type: "open"; url: string };

export interface CommandResult {
  output?: ReactNode;
  effects?: Effect[];
  error?: boolean;
}

export interface Command {
  name: string;
  aliases?: string[];
  summary: string;
  usage?: string;
  /** Hidden commands work but are left out of `help` and tab completion (easter eggs). */
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => CommandResult;
}
