"use client";
import { useEffect } from "react";

export default function SentryInit() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        // Her sayfa açılışını, her hatayı logla
        tracesSampleRate: 1.0,
        // Replay yok (memory sorununa yol açıyordu)
        replaysOnErrorSampleRate: 0,
        replaysSessionSampleRate: 0,
        // Hangi sayfalarda ne kadar sürede render olduğunu göster
        tracePropagationTargets: ["hektapi.com.tr"],
        debug: false,
        // Her event'e cihaz bilgisi ekle
        beforeSend(event) {
          return event;
        },
      });

      // Sayfa açılışını manuel logla — cihaz + URL bilgisiyle
      Sentry.addBreadcrumb({
        category: "navigation",
        message: `Page loaded: ${window.location.pathname}`,
        level: "info",
        data: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          devicePixelRatio: window.devicePixelRatio,
        },
      });

      // Hafıza durumunu logla (destekleyen cihazlarda)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const memory = (performance as any).memory;
      if (memory) {
        Sentry.addBreadcrumb({
          category: "memory",
          message: "Memory usage at page load",
          level: "info",
          data: {
            usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
            totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
            jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + "MB",
          },
        });
      }

      // Genel JS hatalarını yakala
      window.addEventListener("error", (e) => {
        Sentry.captureException(e.error || new Error(e.message), {
          extra: { filename: e.filename, lineno: e.lineno, colno: e.colno },
        });
      });

      // Promise hatalarını yakala
      window.addEventListener("unhandledrejection", (e) => {
        Sentry.captureException(e.reason instanceof Error ? e.reason : new Error(String(e.reason)));
      });
    });
  }, []);

  return null;
}
