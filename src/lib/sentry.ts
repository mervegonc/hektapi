import * as Sentry from "@sentry/nextjs";

// Client-side Sentry initialization
// Bu dosya layout.tsx üzerinden yüklenerek her sayfada Sentry'nin
// aktif olmasını sağlar.

if (typeof window !== "undefined") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    debug: false,
  });
}

export default Sentry;
