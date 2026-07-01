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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/urunler/${cat.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative flex h-44 items-center justify-center bg-zinc-50">
                {cat.image_url
  ? <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="300px" />
  : <span className="text-4xl">🔬</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-navy-950 group-hover:text-accent-dark">{cat.name}</h3>
                {cat.description && <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{cat.description}</p>}
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
