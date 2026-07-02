"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [kurumOpen, setKurumOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    createClient().from("categories").select("*").order("order")
      .then(({ data }) => setCategories(data || []));

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-navy-950/95 backdrop-blur-md shadow-lg shadow-black/20"
        : "bg-navy-950"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
            <Image src="/logo.png" alt="Hektapi Logo" fill className="object-contain" sizes="40px" />
          </div>
          <span className="text-xl font-black tracking-wider text-white">
            HEKT<span className="text-accent">APİ</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
            Anasayfa
          </Link>

          {/* Kurumsal */}
          <div className="relative"
            onMouseEnter={() => setKurumOpen(true)}
            onMouseLeave={() => setKurumOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
              Kurumsal
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${kurumOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
            </button>
            {kurumOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 overflow-hidden rounded-xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40">
                <div className="p-1">
                  <Link href="/kurumsal/hakkimizda"
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span>🏢</span> Hakkımızda
                  </Link>
                  <Link href="/kurumsal/vizyon-misyon"
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                    <span>🎯</span> Vizyon & Misyon
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Ürünler */}
          <div className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}>
            <Link href="/urunler"
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
              Ürünler
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
            </Link>
            {productsOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 overflow-hidden rounded-xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40">
                <div className="p-1">
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/urunler/${cat.slug}`}
                      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/hizmetlerimiz"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
            Hizmetlerimiz
          </Link>

          <Link href="/cozumlerimiz"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
            Çözümlerimiz
          </Link>

          <Link href="/iletisim"
            className="ml-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-navy-950 transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/20">
            İletişim
          </Link>
        </nav>

        {/* Mobile button */}
        <button className="md:hidden rounded-lg p-2 text-white hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy-950 md:hidden">
          <nav className="px-4 py-4 space-y-1">
            {[
              { href: "/", label: "Anasayfa" },
              { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
              { href: "/kurumsal/vizyon-misyon", label: "Vizyon & Misyon" },
              { href: "/urunler", label: "Tüm Ürünler" },
              { href: "/hizmetlerimiz", label: "Hizmetlerimiz" },
              { href: "/cozumlerimiz", label: "Çözümlerimiz" },
              { href: "/iletisim", label: "İletişim" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Kategoriler</p>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/urunler/${cat.slug}`}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-zinc-400 hover:bg-white/10 hover:text-white"
                    onClick={() => setMobileOpen(false)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
