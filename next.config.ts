import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  experimental: {
    typedEnv: true,
    authInterrupts: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  devIndicators: false,

  // If deploying as a Docker/container application:
  // output: "standalone",
};

export default nextConfig;
