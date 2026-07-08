import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SentryInit from "@/components/SentryInit";
import { SiteProvider } from "@/context/SiteContext";


export const metadata: Metadata = {
  title: "Hektapi | Endüstriyel Test Cihazları",
  description: "Hektapi ile en son test makinalarını ve teknik ürünleri keşfedin.",
  verification: {
    google: "cHy-diB7S5zChNy9EUwD8XTTHEoP3gFRTc5mpnnra1Y",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full">
      <body className="flex min-h-full flex-col bg-navy-950">
        <SiteProvider>
          <SentryInit />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SiteProvider>
      </body>
    </html>
  );
}
