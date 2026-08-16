import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Increase body size limit to 20MB for base64 image uploads to AI API
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
