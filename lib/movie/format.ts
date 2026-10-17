import type { Project } from "@/content/projects";

export interface ParsedStat {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
}

/** Splits "6+" or "4.5 / 5" into a countable number plus the text around it. Returns null when there is no number. */
export function parseStat(raw: string): ParsedStat | null {
  const match = raw.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes(".") ? number.split(".")[1].length : 0;
  return { prefix, value: parseFloat(number), decimals, suffix };
}

export function formatStat(stat: ParsedStat, current: number): string {
  return `${stat.prefix}${current.toFixed(stat.decimals)}${stat.suffix}`;
}

export const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Movie-poster wording for a project's status. */
export function posterStatus(status: Project["status"]): string {
  switch (status) {
    case "Live":
      return "Now Playing";
    case "In progress":
      return "In Production";
    case "Prototype":
      return "Coming Soon";
  }
}
