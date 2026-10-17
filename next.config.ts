import type { NextConfig } from "next";
import { headerRules } from "./config/security-headers.mjs";
import { embedOrigins } from "./lib/embed";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hides the small Next.js "N" badge shown in the corner during `npm run dev`. (It never appears in production builds.)
  devIndicators: false,
  // Removes the "X-Powered-By: Next.js" header.
  poweredByHeader: false,
  async headers() {
    return headerRules({ production: process.env.NODE_ENV === "production", frameSources: embedOrigins() });
  },
};

export default nextConfig;
