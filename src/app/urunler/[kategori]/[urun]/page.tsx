"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product, ProductSpec } from "@/types";
import QuoteButton from "@/components/QuoteButton";

export default function UrunDetayPage() {
  const { kategori, urun } = useParams<{ kategori: string; urun: string }>();
  const [cat, setCat] = useState<Category | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categories").select("*").eq("slug", kategori).single()
      .then(({ data: catData }) => {
        if (!catData) { setLoading(false); return; }
        setCat(catData);
        supabase.from("products").select("*").eq("slug", urun).single()
          .then(({ data: prodData }) => {
            if (!prodData) { setLoading(false); return; }
            setProduct(prodData);
            supabase.from("products").select("*").eq("category_id", catData.id)
              .eq("is_active", true).neq("id", prodData.id).limit(4)
              .then(({ data }) => { setRelated(data || []); setLoading(false); });
          });
      });
  }, [kategori, urun]);

  if (loading) return <div className="flex h-64 items-center justify-center text-zinc-400">Yükleniyor...</div>;
  if (!cat || !product) return notFound();

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/urunler" className="hover:text-accent-dark">Ürünler</Link>
        {" / "}
        <Link href={`/urunler/${cat.slug}`} className="hover:text-accent-dark">{cat.name}</Link>
        {" / "}<span className="text-navy-950">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Görsel galeri */}
        <div>
          <div className="relative flex aspect-square items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
            {allImages.length > 0
              ? <Image src={allImages[activeImg]} alt={product.name} fill className="object-contain p-6" sizes="50vw" priority />
              : <span className="text-7xl">🔬</span>}
          </div>
          {allImages.length > 1 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {allImages.map((img, i) => (
                <button key={img} onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${i === activeImg ? "border-navy-900" : "border-zinc-200"}`}>
                  <Image src={img} alt="" fill className="object-contain bg-zinc-50 p-1" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div>
          {product.standards && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-dark">
              {product.standards}
            </p>
          )}
          <h1 className="text-2xl font-bold text-navy-950 sm:text-3xl">{product.name}</h1>
          {product.description && (
  <div
    className="mt-4 prose prose-sm max-w-none text-zinc-600"
    dangerouslySetInnerHTML={{ __html: product.description }}
  />
)}

          <div className="mt-6">
            <QuoteButton productName={product.name} />
          </div>

          {/* Öne çıkan özellikler */}
          {product.highlights?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-navy-950">Öne Çıkan Özellikler</h2>
              <ul className="space-y-2">
                {product.highlights.map((h: string) => (
                  <li key={h} className="flex gap-2 text-sm text-zinc-600">
                    <span className="mt-0.5 text-accent-dark shrink-0">●</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Teknik özellikler */}
          {product.specs?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-navy-950">Teknik Özellikler</h2>
              <table className="w-full overflow-hidden rounded-lg border border-zinc-200 text-sm">
                <tbody>
                  {product.specs.map((spec: ProductSpec, i: number) => (
                    <tr key={spec.label} className={i % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                      <td className="w-2/5 border-b border-zinc-200 px-4 py-2.5 font-semibold text-navy-950">{spec.label}</td>
                      <td className="border-b border-zinc-200 px-4 py-2.5 text-zinc-600">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Kullanım alanları */}
          {product.use_cases?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 text-base font-bold text-navy-950">Kullanım Alanları</h2>
              <div className="flex flex-wrap gap-2">
                {product.use_cases.map((u: string) => (
                  <span key={u} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">{u}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* İlgili ürünler */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-navy-950">{cat.name} — Diğer Ürünler</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <Link key={r.id} href={`/urunler/${cat.slug}/${r.slug}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
                  {r.image_url
                    ? <Image src={r.image_url} alt={r.name} fill className="object-contain p-3" sizes="200px" />
                    : <span className="text-3xl">🔬</span>}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-navy-950 group-hover:text-accent-dark">{r.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
