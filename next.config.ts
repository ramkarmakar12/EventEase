import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
