import { describe, expect, it } from "vitest";
import { contentSecurityPolicy, headerRules, securityHeaders } from "../config/security-headers.mjs";

const find = (headers: Array<{ key: string; value: string }>, key: string) => headers.find((h) => h.key === key)?.value;

describe("Content-Security-Policy", () => {
  const csp = contentSecurityPolicy({ production: true });

  it("locks everything to the site's own origin by default", () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });

  it("allows no third-party hosts unless they are listed for framing", () => {
    expect(csp).not.toMatch(/https?:\/\//);
    expect(csp).not.toContain("*");
  });

  it("does not allow eval or websockets in production", () => {
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("ws:");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("allows what `next dev` needs only in development", () => {
    const dev = contentSecurityPolicy({ production: false });
    expect(dev).toContain("'unsafe-eval'");
    expect(dev).toContain("ws:");
    expect(dev).not.toContain("upgrade-insecure-requests");
  });

  it("still permits the things this site uses (inline hydration scripts, data/blob images, blob workers)", () => {
    expect(csp).toMatch(/script-src [^;]*'unsafe-inline'/);
    expect(csp).toMatch(/img-src [^;]*data:[^;]*blob:/);
    expect(csp).toMatch(/worker-src [^;]*blob:/);
  });
});

describe("frame-src (live project previews)", () => {
  it("blocks all framing unless origins are explicitly listed", () => {
    expect(contentSecurityPolicy({ production: true })).toContain("frame-src 'none'");
  });

  it("allows only the listed origins", () => {
    const csp = contentSecurityPolicy({ production: true, frameSources: ["https://aem-tutorial.vercel.app"] });
    expect(csp).toContain("frame-src https://aem-tutorial.vercel.app");
    expect(csp).not.toContain("frame-src 'none'");
    expect(csp).not.toContain("*");
  });

  it("passes the origins through the header rules", () => {
    const rules = headerRules({ production: true, frameSources: ["https://example.vercel.app"] });
    expect(find(rules[0].headers, "Content-Security-Policy")).toContain("frame-src https://example.vercel.app");
  });
});

describe("securityHeaders", () => {
  it("includes the standard hardening headers", () => {
    const headers = securityHeaders({ production: true });
    expect(find(headers, "X-Content-Type-Options")).toBe("nosniff");
    expect(find(headers, "X-Frame-Options")).toBe("DENY");
    expect(find(headers, "Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(find(headers, "Permissions-Policy")).toContain("camera=()");
    expect(find(headers, "Cross-Origin-Opener-Policy")).toBe("same-origin");
  });

  it("sends HSTS only in production", () => {
    expect(find(securityHeaders({ production: true }), "Strict-Transport-Security")).toContain("max-age=");
    expect(find(securityHeaders({ production: false }), "Strict-Transport-Security")).toBeUndefined();
  });
});

describe("headerRules", () => {
  it("applies security headers to every route and caches static media", () => {
    const rules = headerRules({ production: true });
    expect(rules[0].source).toBe("/:path*");
    const sources = rules.map((r) => r.source);
    for (const source of ["/images/:path*", "/textures/:path*", "/resume.pdf"]) expect(sources).toContain(source);
    for (const rule of rules.slice(1)) expect(find(rule.headers, "Cache-Control")).toContain("max-age=");
  });
});
