export interface EmbedStatus {
  embeddable: boolean;
  reason?: string;
  /** True when the check itself could not run (network error, timeout): the preview is then attempted anyway. */
  unknown?: boolean;
}

export type EmbedStatusMap = Record<string, EmbedStatus>;

let cached: Promise<EmbedStatusMap> | null = null;

/** Asks the server which project sites allow framing. Fetched once per page load; failures resolve to "unknown". */
export function loadEmbedStatus(): Promise<EmbedStatusMap> {
  if (!cached) {
    cached = fetch("/api/embed-check")
      .then((response) => (response.ok ? (response.json() as Promise<EmbedStatusMap>) : {}))
      .catch(() => ({}));
  }
  return cached;
}

/** Test helper: forget the cached answer. */
export function resetEmbedStatus(): void {
  cached = null;
}
