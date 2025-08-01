import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables ESLint blocking production builds
  },
};


export default nextConfig;
