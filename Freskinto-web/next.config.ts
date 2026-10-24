import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> + browser View Transitions on route changes (product photo morphs, page fades)
    viewTransition: true,
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: ["@base-ui/react", "lucide-react", "recharts"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.freshes.leogravity.com",
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
