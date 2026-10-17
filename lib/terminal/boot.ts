export type BootStatus = "ok" | "warn" | "skip" | "info";

export interface BootLine {
  text: string;
  status: BootStatus;
  /** Milliseconds to wait before this line appears. */
  delay: number;
}

/** The boot log. Tone: funny, with a few AEM in-jokes (4502/4503 are AEM's default ports). */
export const bootLines: BootLine[] = [
  { text: "AshishOS 1.0 (kernel debug-6.0) starting up", status: "info", delay: 160 },
  { text: "Mounting /home/guest", status: "ok", delay: 150 },
  { text: "Loading focus.service", status: "ok", delay: 170 },
  { text: "Starting aem-author on port 4502", status: "ok", delay: 190 },
  { text: "Starting aem-publish on port 4503", status: "ok", delay: 150 },
  { text: "Syncing client projects", status: "ok", delay: 160 },
  { text: "Resolving tabs vs spaces", status: "warn", delay: 190 },
  { text: "Reading unread Jira notifications", status: "skip", delay: 150 },
  { text: "Verifying 'it works on my machine'", status: "warn", delay: 170 },
  { text: "Loading personality.module", status: "ok", delay: 170 },
  { text: "Starting portfolio.service", status: "ok", delay: 200 },
];

export const statusLabel: Record<BootStatus, string> = {
  ok: "  OK  ",
  warn: " WARN ",
  skip: " SKIP ",
  info: " INFO ",
};
