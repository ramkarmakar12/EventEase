import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Ignore build-time linting errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore build-time type checking errors
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      // These are required for Firebase Admin SDK in edge runtime
      "fs": false,
      "path": false,
      "os": false,
      "net": false,
      "tls": false,
      "crypto": false,
    };
    return config;
  },
}

export default nextConfig;
