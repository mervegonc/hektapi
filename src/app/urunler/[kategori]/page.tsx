"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/types";

export default function KategoriPage() {
  const { kategori } = useParams<{ kategori: string }>();
  const [cat, setCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categories").select("*").eq("slug", kategori).single()
      .then(({ data: catData }) => {
        if (!catData) { setLoading(false); return; }
        setCat(catData);
        supabase.from("products").select("*").contains("category_ids", [catData.id]).eq("is_active", true).order("created_at")
          .then(({ data }) => { setProducts(data || []); setLoading(false); });
      });
  }, [kategori]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
  if (!cat) return notFound();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-950 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
            <span>/</span>
            <span className="text-zinc-300">{cat.name}</span>
          </nav>
          <h1 className="text-3xl font-black text-white sm:text-4xl">{cat.name}</h1>
          <div className="section-divider mt-4" />
          {cat.description && (
            <p className="mt-4 max-w-xl text-zinc-400">{cat.description}</p>
          )}
        </div>
      </section>

      {/* Ürünler */}
      <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {products.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <span className="text-5xl">🔬</span>
              <p className="mt-4 text-zinc-500">Bu kategoride henüz ürün bulunmuyor.</p>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-zinc-500">{products.length} ürün listeleniyor</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <Link key={p.id} href={`/urunler/${cat.slug}/${p.slug}`}
                    className="premium-card group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
                      {p.image_url
                        ? <Image src={p.image_url} alt={p.name} fill
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                        : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-5xl opacity-20">⚗️</span>
                          </div>
                        )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="border-t border-gray-100 p-4">
                      <h2 className="text-sm font-bold text-navy-950 group-hover:text-accent transition-colors line-clamp-2">{p.name}</h2>
                      {p.short_description && (
                        <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">{p.short_description}</p>
                      )}
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent">
                        İncele
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
