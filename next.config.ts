import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "0610dc9ab2ecf940e23df4b2e07ff45a.r2.cloudflarestorage.com",
        pathname: "/**",
       },
      ],
    },
};

export default nextConfig;
