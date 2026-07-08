"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

interface Product {
  id: string;
  name: string;
  slug: string;
  category_ids: string[];
  image_url: string | null;
}

export default function Header({ categories }: { categories: Category[] }) {
  const [productsOpen, setProductsOpen] = useState(false);
  const [kurumOpen, setKurumOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearching(true);
    const timer = setTimeout(async () => {
      const { data } = await createClient()
        .from("products")
        .select("id, name, slug, category_ids, image_url")
        .ilike("name", `%${searchQuery}%`)
        .eq("is_active", true)
        .limit(6);
      setSearchResults(data || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  function getCategorySlug(categoryIds: string[]) {
    const cat = categories.find(c => categoryIds.includes(c.id));
    return cat?.slug || "urunler";
  }

  const isActive = (href: string) => pathname === href;
  const isProductsActive = pathname.startsWith("/urunler");
  const isKurumActive = pathname.startsWith("/kurumsal");

  const linkClass = (active: boolean) =>
    `relative flex items-center gap-1 h-10 px-3 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap
    ${active ? "text-accent" : "text-zinc-300 hover:text-white hover:bg-white/10"}`;

  const activeLine = <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-accent" />;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-navy-950/95 shadow-lg shadow-black/20" : "bg-navy-950"
    }`}>
      <div className="mx-auto flex max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8 gap-1">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-3">
          <div className="relative h-9 w-9 shrink-0">
            <Image src="/logo.png" alt="Hektapi" fill className="object-contain" sizes="36px" priority />
          </div>
          <span className="text-lg font-black tracking-wider text-white">
            HEKTA<span className="text-accent">Pİ</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center flex-1 justify-end gap-0.5">
          <Link href="/" className={linkClass(isActive("/"))}>
            Anasayfa
            {isActive("/") && activeLine}
          </Link>

          <div className="relative flex items-center"
            onMouseEnter={() => setKurumOpen(true)}
            onMouseLeave={() => setKurumOpen(false)}>
            <button className={linkClass(isKurumActive)}>
              Kurumsal
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${kurumOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
              {isKurumActive && activeLine}
            </button>
            {kurumOpen && (
              <div className="absolute left-0 top-full pt-2 w-48 z-50">
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

          <div className="relative flex items-center"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}>
            <Link href="/urunler" className={linkClass(isProductsActive)}>
              Ürünler
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"
                className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}>
                <path d="M6 8L1 3h10z"/>
              </svg>
              {isProductsActive && activeLine}
            </Link>
            {productsOpen && (
              <div className="absolute left-0 top-full pt-2 w-60 z-50">
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
            Sertifikalar
            {isActive("/standartlar") && activeLine}
          </Link>

          {/* Arama ikonu */}
          <button onClick={() => setSearchOpen(true)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/10 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
          </button>

          <Link href="/iletisim"
            className="ml-1 rounded-full bg-accent h-10 px-5 flex items-center text-sm font-bold text-navy-950 transition-all hover:bg-accent-light hover:shadow-lg hover:shadow-accent/30 whitespace-nowrap">
            İletişim
          </Link>
        </nav>

        {/* Mobile buttons */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)}
            className="rounded-lg p-2 text-white hover:bg-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="rounded-lg p-2 text-white hover:bg-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
                : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Arama modalı */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 pt-20" onClick={() => setSearchOpen(false)}>
          <div className="mx-auto max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full rounded-2xl bg-white pl-11 pr-12 py-4 text-navy-950 text-lg focus:outline-none shadow-2xl" />
              <button onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Sonuçlar */}
            {searchQuery && (
              <div className="mt-2 rounded-2xl bg-white overflow-hidden shadow-2xl">
                {searching ? (
                  <div className="p-6 text-center text-zinc-400 text-sm">Aranıyor...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400 text-sm">Sonuç bulunamadı.</div>
                ) : (
                  <div>
                    {searchResults.map(p => (
                      <Link key={p.id}
                        href={`/urunler/${getCategorySlug(p.category_ids)}/${p.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {p.image_url && (
                            <Image src={p.image_url} alt={p.name} fill className="object-contain p-1" sizes="40px" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-navy-950">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
              { href: "/standartlar", label: "Sertifikalar" },
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