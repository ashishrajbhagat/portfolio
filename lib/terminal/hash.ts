function fnv1a(input: string, seed: number): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** Deterministic, git-looking 7 character hash so `git log` output is stable between renders. */
export function fakeCommitHash(seed: string): string {
  const a = fnv1a(seed, 0x811c9dc5).toString(16).padStart(8, "0");
  const b = fnv1a(`${seed}:salt`, 0x01000193).toString(16).padStart(8, "0");
  return (a + b).slice(0, 7);
}
