/**
 * Development-only noise we deliberately hide. framer-motion prints this notice in `next dev` whenever the operating
 * system has "reduce motion" switched on; it is informational (the site already respects the setting) and is never
 * shown in production builds.
 */
const SILENCED_PREFIXES = ["You have Reduced Motion enabled on your device. Animations may not appear as expected."];

export function isSilenced(args: unknown[]): boolean {
  const first = args[0];
  return typeof first === "string" && SILENCED_PREFIXES.some((prefix) => first.startsWith(prefix));
}

/** Wraps `console.warn` so exactly the silenced messages are dropped. Returns a function that undoes it. */
export function installWarnFilter(target: Pick<Console, "warn">): () => void {
  const original = target.warn;
  target.warn = (...args: unknown[]) => {
    if (isSilenced(args)) return;
    original.apply(target, args as []);
  };
  return () => {
    target.warn = original;
  };
}
