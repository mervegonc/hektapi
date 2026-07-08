import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  // Replay kapalı — iPhone memory crash'ini tetikliyordu
  replaysOnErrorSampleRate: 0,
  replaysSessionSampleRate: 0,
  debug: false,
});
