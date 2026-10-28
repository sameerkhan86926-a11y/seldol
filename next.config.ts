import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/seldol",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
