import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/seldol",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
