type Kind = "local" | "session";

function area(kind: Kind): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    // Storage can throw in private mode or when blocked by the browser.
    return null;
  }
}

export function readStorage(kind: Kind, key: string): string | null {
  try {
    return area(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(kind: Kind, key: string, value: string): void {
  try {
    area(kind)?.setItem(key, value);
  } catch {
    /* ignore: persistence is a nicety, never a requirement */
  }
}

export function removeStorage(kind: Kind, key: string): void {
  try {
    area(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}
