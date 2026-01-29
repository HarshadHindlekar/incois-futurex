import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
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
