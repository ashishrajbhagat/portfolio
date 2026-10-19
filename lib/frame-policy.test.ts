import { describe, expect, it } from "vitest";
import { frameVerdict } from "./frame-policy";

const parents = ["https://ashishrajbhagat.dev", "https://www.ashishrajbhagat.dev"];
const headers = (init: Record<string, string>) => ({ get: (name: string) => init[name.toLowerCase()] ?? null });

describe("frameVerdict", () => {
  it("allows a page that sets no framing headers", () => {
    expect(frameVerdict(headers({}), parents)).toEqual({ embeddable: true });
  });

  it("blocks X-Frame-Options DENY and SAMEORIGIN", () => {
    expect(frameVerdict(headers({ "x-frame-options": "DENY" }), parents)).toEqual({ embeddable: false, reason: "X-Frame-Options: deny" });
    expect(frameVerdict(headers({ "x-frame-options": "SAMEORIGIN" }), parents).embeddable).toBe(false);
  });

  it("honours the old ALLOW-FROM form only for this site", () => {
    expect(frameVerdict(headers({ "x-frame-options": "ALLOW-FROM https://ashishrajbhagat.dev" }), parents).embeddable).toBe(true);
    expect(frameVerdict(headers({ "x-frame-options": "ALLOW-FROM https://other.example" }), parents).embeddable).toBe(false);
  });

  it("blocks CSP frame-ancestors 'none' and 'self'", () => {
    expect(frameVerdict(headers({ "content-security-policy": "default-src 'self'; frame-ancestors 'none'" }), parents).embeddable).toBe(false);
    expect(frameVerdict(headers({ "content-security-policy": "frame-ancestors 'self'" }), parents).embeddable).toBe(false);
  });

  it("allows frame-ancestors that list this site, a wildcard host, a scheme, or *", () => {
    for (const value of [
      "frame-ancestors https://ashishrajbhagat.dev",
      "frame-ancestors 'self' https://www.ashishrajbhagat.dev",
      "frame-ancestors https://*.ashishrajbhagat.dev",
      "frame-ancestors ashishrajbhagat.dev",
      "frame-ancestors https:",
      "frame-ancestors *",
    ]) {
      expect(frameVerdict(headers({ "content-security-policy": value }), parents).embeddable, value).toBe(true);
    }
  });

  it("blocks frame-ancestors lists that do not include this site", () => {
    const verdict = frameVerdict(headers({ "content-security-policy": "frame-ancestors https://someone-else.com" }), parents);
    expect(verdict.embeddable).toBe(false);
    expect(verdict.reason).toContain("frame-ancestors https://someone-else.com");
  });

  it("ignores a CSP without frame-ancestors, and still checks X-Frame-Options", () => {
    expect(frameVerdict(headers({ "content-security-policy": "default-src 'self'" }), parents).embeddable).toBe(true);
    expect(frameVerdict(headers({ "content-security-policy": "default-src 'self'", "x-frame-options": "deny" }), parents).embeddable).toBe(false);
  });

  it("requires every comma-separated policy to allow the site", () => {
    const csp = "frame-ancestors https://ashishrajbhagat.dev, frame-ancestors 'none'";
    expect(frameVerdict(headers({ "content-security-policy": csp }), parents).embeddable).toBe(false);
  });

  it("does not let a look-alike host match", () => {
    expect(frameVerdict(headers({ "content-security-policy": "frame-ancestors https://evil-ashishrajbhagat.dev" }), parents).embeddable).toBe(false);
  });
});
