import type { Metadata } from "next";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...defaultMetadata,
  verification: {
    google: "cHy-diB7S5zChNy9EUwD8XTTHEoP3gFRTc5mpnnra1Y",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="flex min-h-full flex-col bg-navy-950">
        {children}
      </body>
    </html>
  );
}
