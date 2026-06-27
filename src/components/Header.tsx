"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [kurumOpen, setKurumOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("order")
      .then(({ data }) => setCategories(data || []));
  }, []);

  const navLink = "hover:text-accent transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-navy-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-widest">
          HEKTAPİ
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <Link href="/" className={navLink}>Anasayfa</Link>

          {/* Kurumsal dropdown */}
          <div className="relative"
            onMouseEnter={() => setKurumOpen(true)}
            onMouseLeave={() => setKurumOpen(false)}>
            <button className={navLink + " flex items-center gap-1"}>
              Kurumsal
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z"/>
              </svg>
            </button>
            {kurumOpen && (
              <div className="absolute left-0 top-full w-52 rounded-b-lg bg-navy-900 py-2 shadow-xl">
                <Link href="/kurumsal/hakkimizda" className="block px-4 py-2.5 text-sm font-normal hover:bg-navy-800 hover:text-accent">Hakkımızda</Link>
                <Link href="/kurumsal/vizyon-misyon" className="block px-4 py-2.5 text-sm font-normal hover:bg-navy-800 hover:text-accent">Vizyon & Misyon</Link>
              </div>
            )}
          </div>

          {/* Ürünler dropdown */}
          <div className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}>
            <Link href="/urunler" className={navLink + " flex items-center gap-1"}>
              Ürünler
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L1 3h10z"/>
              </svg>
            </Link>
            {productsOpen && (
              <div className="absolute left-0 top-full w-64 rounded-b-lg bg-navy-900 py-2 shadow-xl">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/urunler/${cat.slug}`}
                    className="block px-4 py-2.5 text-sm font-normal hover:bg-navy-800 hover:text-accent">
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/hizmetlerimiz" className={navLink}>Hizmetlerimiz</Link>
          <Link href="/cozumlerimiz" className={navLink}>Çözümlerimiz</Link>
          <Link href="/iletisim" className={navLink}>İletişim</Link>
        </nav>

        {/* Mobile button */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-navy-800 bg-navy-900 px-4 py-3 text-sm font-semibold md:hidden">
          {[
            { href: "/", label: "Anasayfa" },
            { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
            { href: "/kurumsal/vizyon-misyon", label: "Vizyon & Misyon" },
            { href: "/urunler", label: "Ürünler" },
            { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
            { href: "/cozumlerimiz", label: "Çözümlerimiz" },
            { href: "/iletisim", label: "İletişim" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block py-2.5 border-b border-navy-800 last:border-0"
              onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="pt-2">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/urunler/${cat.slug}`}
                className="block py-2 pl-4 text-xs font-normal text-zinc-400"
                onClick={() => setMobileOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
