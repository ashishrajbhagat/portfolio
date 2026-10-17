/**
 * HTTP security headers for next.config.mjs.
 *
 * The Content-Security-Policy keeps 'unsafe-inline' for scripts and styles because Next.js injects small inline
 * scripts for hydration and this site is statically generated (a nonce-based policy would force every page to be
 * rendered per request). Everything else is locked to the site's own origin: no third-party scripts, frames,
 * forms, plugins or connections are allowed.
 */

/**
 * @param {{ production?: boolean, frameSources?: string[] }} [options]
 * `frameSources` are the only origins this site may embed in an <iframe> (the live project previews).
 */
export function contentSecurityPolicy({ production = true, frameSources = [] } = {}) {
  const directives = {
    "default-src": ["'self'"],
    // `next dev` needs eval for React refresh and a websocket for hot reload.
    "script-src": ["'self'", "'unsafe-inline'", ...(production ? [] : ["'unsafe-eval'"])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", ...(production ? [] : ["ws:", "wss:"])],
    "media-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
    "frame-src": frameSources.length ? frameSources : ["'none'"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    ...(production ? { "upgrade-insecure-requests": [] } : {}),
  };

  return Object.entries(directives)
    .map(([name, values]) => (values.length ? `${name} ${values.join(" ")}` : name))
    .join("; ");
}

/** @param {{ production?: boolean, frameSources?: string[] }} [options] */
export function securityHeaders({ production = true, frameSources = [] } = {}) {
  const headers = [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ production, frameSources }) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  if (production) headers.push({ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" });
  return headers;
}

/**
 * Next.js `headers()` rules: security headers everywhere, plus sensible caching for static media.
 * @param {{ production?: boolean, frameSources?: string[] }} [options]
 */
export function headerRules({ production = true, frameSources = [] } = {}) {
  const media = (source, value) => ({ source, headers: [{ key: "Cache-Control", value }] });
  return [
    { source: "/:path*", headers: securityHeaders({ production, frameSources }) },
    // File names are not hashed, so keep the cache short enough that replacing a photo shows up within a day.
    media("/images/:path*", "public, max-age=86400, stale-while-revalidate=604800"),
    media("/textures/:path*", "public, max-age=86400, stale-while-revalidate=604800"),
    media("/resume.pdf", "public, max-age=3600, stale-while-revalidate=86400"),
  ];
}
