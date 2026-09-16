import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://api.mypets.lat/v1").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: "/causas/mypets-geral-brl",
        destination: "/apoiar/mypets",
        permanent: true,
      },
      {
        source: "/causas/mypets-vet-help-brl",
        destination: "/projetos/vet-help/apoiar",
        permanent: true,
      },
      {
        source: "/causas/mypets-rescue-brl",
        destination: "/projetos/rescue/apoiar",
        permanent: true,
      },
      {
        source: "/causas/mypets-shelter-brl",
        destination: "/projetos/shelter/apoiar",
        permanent: true,
      },
      {
        source: "/causas/mypets-emergency-brl",
        destination: "/projetos/emergency/apoiar",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${apiBase}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
