export interface FrameVerdict {
  embeddable: boolean;
  /** Plain-English reason, e.g. "X-Frame-Options: deny". Present when embeddable is false. */
  reason?: string;
}

interface HeaderReader {
  get(name: string): string | null;
}

const normalise = (origin: string) => origin.replace(/\/+$/, "").toLowerCase();

/** Does one CSP source expression (from `frame-ancestors`) allow a page on `parentOrigin` to frame the site? */
function sourceAllows(source: string, parentOrigin: string): boolean {
  const token = source.trim().toLowerCase();
  if (!token || token === "'none'") return false;
  if (token === "*") return true;
  if (token === "'self'") return false; // "self" is the framed site's own origin, never the parent's

  const parent = new URL(parentOrigin);
  if (/^[a-z][a-z0-9+.-]*:$/.test(token)) return token === parent.protocol; // scheme-only, e.g. https:

  // Host source: optional scheme, host (maybe *.wildcard), optional port, ignore any path.
  const match = token.match(/^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:*]+)(?::(\*|\d+))?(?:\/.*)?$/);
  if (!match) return false;
  const [, scheme, wildcard, host, port] = match;
  if (scheme && `${scheme}:` !== parent.protocol) return false;
  if (port && port !== "*" && port !== (parent.port || (parent.protocol === "https:" ? "443" : "80"))) return false;
  if (wildcard) return parent.hostname.endsWith(`.${host}`);
  return parent.hostname === host;
}

/**
 * Decides whether a page that sent these response headers may be shown in an <iframe> on one of `parentOrigins`.
 * Browsers refuse to frame a page that sets `X-Frame-Options: DENY|SAMEORIGIN` or a CSP `frame-ancestors` list that
 * does not include the parent. A page that sets neither can be framed by anyone.
 */
export function frameVerdict(headers: HeaderReader, parentOrigins: string[]): FrameVerdict {
  const parents = parentOrigins.map(normalise);

  const xfo = headers.get("x-frame-options")?.trim().toLowerCase();
  if (xfo) {
    if (xfo.startsWith("allow-from")) {
      const allowed = normalise(xfo.slice("allow-from".length).trim());
      if (!parents.includes(allowed)) return { embeddable: false, reason: `X-Frame-Options: ${xfo}` };
    } else if (xfo.includes("deny") || xfo.includes("sameorigin")) {
      return { embeddable: false, reason: `X-Frame-Options: ${xfo}` };
    }
  }

  const csp = headers.get("content-security-policy");
  if (csp) {
    // Several policies can be combined with commas; the page must satisfy every one of them.
    for (const policy of csp.split(",")) {
      const directive = policy
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.toLowerCase().startsWith("frame-ancestors"));
      if (!directive) continue;
      const sources = directive.split(/\s+/).slice(1);
      const allowed = parents.some((parent) => sources.some((source) => sourceAllows(source, parent)));
      if (!allowed) return { embeddable: false, reason: `Content-Security-Policy: ${directive}` };
    }
  }

  return { embeddable: true };
}
