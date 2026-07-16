import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id,name,slug").order("order");
  const categories: Category[] = (data || []) as Category[];

  return (
    <html lang="tr" className="h-full">
      <body className="flex min-h-full flex-col bg-navy-950">
    
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
