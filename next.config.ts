import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // vinext generates .next/types; keep Next's build and route validators separate.
  distDir: ".next/nextjs",
};

export default nextConfig;
