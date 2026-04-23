import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wapjdlwahvunzdvgvvjb.supabase.co",
      },
    ],
  },
};

export default nextConfig;
