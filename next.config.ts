import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Замени на актуальный хост своего бакета Timeweb
        hostname: "s3.twcstorage.ru", 
        pathname: "/**",
      },
      // Если у тебя остались старые картинки на Cloudflare, 
      // можно оставить оба объекта в массиве
      {
        protocol: "https",
        hostname: "0610dc9ab2ecf940e23df4b2e07ff45a.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
