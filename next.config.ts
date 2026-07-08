import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vcdwuwajhybttnozclpa.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "hektapi",           // sentry.io'daki organization slug'ın
  project: "hektapi-nextjs", // sentry.io'daki proje adın

  // Source map'leri Sentry'e yükle (hata satırlarını görmek için)
  silent: true,

  // Vercel üzerinde otomatik instrumentation
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
