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
        supabase.from("products").select("*").eq("category_id", catData.id).eq("is_active", true).order("created_at")
          .then(({ data }) => { setProducts(data || []); setLoading(false); });
      });
  }, [kategori]);

  if (loading) return <div className="flex h-64 items-center justify-center text-zinc-400">Yükleniyor...</div>;
  if (!cat) return notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/urunler" className="hover:text-accent-dark">Ürünler</Link>
        {" / "}<span className="text-navy-950">{cat.name}</span>
      </nav>
      <h1 className="mb-2 text-3xl font-bold text-navy-950">{cat.name}</h1>
      {cat.description && <p className="mb-10 max-w-2xl text-zinc-500">{cat.description}</p>}

      {products.length === 0
        ? <p className="text-zinc-500">Bu kategoride henüz ürün bulunmuyor.</p>
        : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Link key={p.id} href={`/urunler/${cat.slug}/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition-all">
                <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
                  {p.image_url
                    ? <Image src={p.image_url} alt={p.name} fill className="object-contain p-3" sizes="300px" />
                    : <span className="text-4xl">🔬</span>}
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-bold text-navy-950 group-hover:text-accent-dark">{p.name}</h2>
                  {p.short_description && <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{p.short_description}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}
