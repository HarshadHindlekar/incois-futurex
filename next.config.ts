import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/incois-futurex", // Replace with your repository name
  assetPrefix: "/incois-futurex", // Replace with your repository name
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "incois.gov.in",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  
};

export default withNextIntl(nextConfig);
