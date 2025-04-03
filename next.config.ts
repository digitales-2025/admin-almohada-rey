import type { NextConfig } from "next";

const imageDomain = process.env.NEXT_PUBLIC_IMAGE_DOMAIN;
if (!imageDomain) {
  throw new Error("NEXT_PUBLIC_IMAGE_DOMAIN is not defined");
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [imageDomain],
  },
};

export default nextConfig;
