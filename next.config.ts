import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     remotePatterns: [
        {
          protocol: "https",
          hostname: "pbs.twimg.com",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "sports-phinf.pstatic.net",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "via.placeholder.com",
        },
        {
          protocol: "http",
          hostname: "125.132.216.190",
        },
        {
          protocol: "http",
          hostname: "master-of-prediction.shop",
        },
      ],
  },
  /* config options here */
};

export default nextConfig;
