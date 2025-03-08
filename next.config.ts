import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disables ESLint in Next.js builds
  },
  images: {
    domains: ["v0.blob.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
