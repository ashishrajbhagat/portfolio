/** Resolves `target` against `cwd` (segments below ~). `..` at the top stays at the top. */
export function resolvePath(cwd: string[], target: string): string[] {
  if (target === "~" || target === "/" || target === "") return [];

  let base = cwd.slice();
  let rest = target;
  if (rest.startsWith("~/")) {
    base = [];
    rest = rest.slice(2);
  } else if (rest.startsWith("/")) {
    base = [];
    rest = rest.slice(1);
  }

  for (const part of rest.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") base.pop();
    else base.push(part);
  }
  return base;
}

/** Display form used in the prompt: `~` or `~/projects`. */
export function formatPath(segments: string[]): string {
  return segments.length ? `~/${segments.join("/")}` : "~";
}

/** Absolute form used by `pwd`. */
export function absolutePath(segments: string[]): string {
  return ["/home/guest", ...segments].join("/");
}
