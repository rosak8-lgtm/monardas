import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // vinext generates .next/types; keep Next's build and route validators separate.
  distDir: ".next/nextjs",
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^cloudflare:workers$/,
        path.resolve("src/lib/cloudflare-workers-next-stub.ts"),
      ),
    );
    return config;
  },
};

export default nextConfig;
