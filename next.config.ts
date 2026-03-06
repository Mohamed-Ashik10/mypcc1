import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance ────────────────────────────────────────────────────────────
  compress: true,                // Gzip/Brotli all responses

  // ─── Security ───────────────────────────────────────────────────────────────
  poweredByHeader: false,        // Remove X-Powered-By: Next.js header

  // ─── Image Optimisation ─────────────────────────────────────────────────────
  images: {
    minimumCacheTTL: 3600,       // Cache optimised images for 1 hour
    formats: ["image/avif", "image/webp"], // Modern formats for smaller sizes
  },

  // ─── HTTP Security Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Static assets — long cache
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2|woff|ttf)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
