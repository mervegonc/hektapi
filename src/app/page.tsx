"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";
import HeroSlider from "@/components/HeroSlider";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    createClient().from("categories").select("*").order("order")
      .then(({ data }) => setCategories(data || []));
  }, []);

  return (
    <div>
      <HeroSlider />

      {/* Kategoriler */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-2 text-center text-3xl font-bold text-navy-950">Ürün Kategorileri</h2>
        <p className="mb-10 text-center text-zinc-500">İhtiyacınıza uygun test cihazını kategoriye göre inceleyin.</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {categories.map((cat) => (
    <Link key={cat.id} href={`/urunler/${cat.slug}`}
      className="premium-card group relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        {cat.image_url
          ? <Image src={cat.image_url} alt={cat.name} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-800">
              <span className="text-5xl opacity-30">⚗️</span>
            </div>
          )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-black text-white text-sm leading-tight">{cat.name}</h3>
          {cat.description && (
            <p className="mt-1 line-clamp-1 text-xs text-zinc-300">{cat.description}</p>
          )}
        </div>
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  ))}
</div>
      </section>

      {/* Vizyon/Misyon */}
      <section className="bg-navy-950 px-4 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-navy-800 p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Vizyonumuz</p>
            <p className="leading-relaxed text-zinc-300 text-sm">
              Mühendislik, danışmanlık ve Ar-Ge alanlarında öncü bir marka olarak, test cihazları sektöründe yenilikçi ve güvenilir çözümler sunmak. Teknolojik gelişmeleri yakından takip ederek, kalite ve hassasiyet konusunda sektörde referans noktası olmak.
            </p>
          </div>
          <div className="rounded-xl bg-navy-700 p-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Misyonumuz</p>
            <p className="leading-relaxed text-zinc-300 text-sm">
              Müşterilerimize mühendislik, danışmanlık ve Ar-Ge destekli, hassas ve güvenilir test cihazları sunarak kalite kontrol süreçlerini optimize etmek. Yenilikçi çözümler ve sürdürülebilir teknolojiler geliştirerek sektöre değer katmak.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-navy-950">Aradığınız ürünü bulamadınız mı?</h2>
        <p className="mt-3 text-zinc-500">Bizimle iletişime geçin, ihtiyacınıza en uygun çözümü birlikte belirleyelim.</p>
        <Link href="/iletisim"
          className="mt-6 inline-block rounded-md bg-navy-900 px-7 py-3 font-semibold text-white hover:bg-navy-800 transition-colors">
          İletişime Geçin
        </Link>
      </section>
    </div>
  );
}
