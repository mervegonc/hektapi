"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const [kurumOpen, setKurumOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    createClient().from("categories").select("*").order("order")
      .then(({ data }) => setCategories(data || []));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isProductsActive = pathname.startsWith("/urunler");
  const isKurumActive = pathname.startsWith("/kurumsal");

  const linkClass = (active: boolean) =>
    `relative flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap
    ${active ? "text-accent" : "text-zinc-300 hover:text-white hover:bg-white/10"}`;

  const activeLine = <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-accent" />;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-navy-950/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-navy-950"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-4">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-110">
            <Image src="/logo.png" alt="Hektapi Logo" fill className="object-contain" sizes="36px" />
          </div>
          <span className="text-lg font-black tracking-wider text-white">
            HEKTAP<span className="text-accent">İ</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex flex-1">
          <Link href="/" className={linkClass(isActive("/"))}>
            Anasayfa
            {isActive("/") && activeLine}
          </Link>

          {/* Kurumsal */}
          <div className="relative"
            onMouseEnter={() => setKurumOpen(true)}
            onMouseLeave={() => setKurumOpen(false)}
            style={{ paddingBottom: "8px" }}>
            <button className={linkClass(isKurumActive)}>
              Kurumsal
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${kurumOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
              {isKurumActive && activeLine}
            </button>
            {kurumOpen && (
              <div className="absolute left-0 top-full w-48 pt-2">
                <div className="rounded-xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40 p-1">
                  {[
                    { href: "/kurumsal/hakkimizda", label: "Hakkımızda" },
                    { href: "/kurumsal/vizyon-misyon", label: "Vizyon & Misyon" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors
                        ${pathname === href ? "bg-accent/10 text-accent" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}>
                      <span className="h-1 w-2 rounded bg-accent/60 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ürünler */}
          <div className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            style={{ paddingBottom: "8px" }}>
            <Link href="/urunler" className={linkClass(isProductsActive)}>
              Ürünler
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
              {isProductsActive && activeLine}
            </Link>
            {productsOpen && (
              <div className="absolute left-0 top-full w-60 pt-2">
                <div className="rounded-xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/40 p-1">
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/urunler/${cat.slug}`}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors
                        ${pathname === `/urunler/${cat.slug}` ? "bg-accent/10 text-accent" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/hizmetlerimiz" className={linkClass(isActive("/hizmetlerimiz"))}>
            Hizmetlerimiz
            {isActive("/hizmetlerimiz") && activeLine}
          </Link>

          <Link href="/cozumlerimiz" className={linkClass(isActive("/cozumlerimiz"))}>
            Çözümlerimiz
            {isActive("/cozumlerimiz") && activeLine}
          </Link>

          <Link href="/standartlar" className={linkClass(isActive("/standartlar"))}>
            Standartlar
            {isActive("/standartlar") && activeLine}
          </Link>

          <Link href="/iletisim"
            className="ml-auto rounded-full bg-accent px-5 py-2 text-sm font-bold text-navy-950 transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/30 whitespace-nowrap">
            İletişim
          </Link>
        </nav>

        {/* Mobile button */}
        <button className="md:hidden ml-auto rounded-lg p-2 text-white hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
          </svg>
        </button>
      </div>

      {/* Navbar alt gradient çizgi */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

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
              { href: "/standartlar", label: "Standartlar" },
              { href: "/iletisim", label: "İletişim" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={`block rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors
                  ${pathname === href ? "bg-accent/10 text-accent" : "text-zinc-300 hover:bg-white/10 hover:text-white"}`}
                onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Kategoriler</p>
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/urunler/${cat.slug}`}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors
                      ${pathname === `/urunler/${cat.slug}` ? "text-accent" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                    onClick={() => setMobileOpen(false)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
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
