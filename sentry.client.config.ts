import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Hataların %100'ünü yakala (debug için)
  tracesSampleRate: 1.0,

  // Replay — crash anını kaydet (iPhone için kritik)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Geliştirme ortamında konsola da yaz
  debug: false,
});
