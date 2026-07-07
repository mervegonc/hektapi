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
  const [activeTab, setActiveTab] = useState<"aciklama" | "specs" | "standartlar" | "kullanim">("aciklama");
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
            supabase.from("products").select("*").contains("category_ids", [catData.id])
              .eq("is_active", true).neq("id", prodData.id).limit(4)
              .then(({ data }) => { setRelated(data || []); setLoading(false); });
          });
      });
  }, [kategori, urun]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
  if (!cat || !product) return notFound();

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-navy-950 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
            <span>/</span>
            <Link href={`/urunler/${cat.slug}`} className="hover:text-accent transition-colors">{cat.name}</Link>
            <span>/</span>
            <span className="text-zinc-300 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Görsel galeri */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100" style={{ aspectRatio: "1/1" }}>
              {allImages.length > 0
                ? <Image src={allImages[activeImg]} alt={product.name} fill
                    className="object-contain p-8" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-8xl opacity-10">⚗️</span>
                  </div>
                )}
              {product.standards && (
                <div className="absolute left-4 top-4 rounded-full bg-navy-950/90 px-3 py-1 text-xs font-semibold text-accent backdrop-blur-sm">
                  {product.standards.split(";")[0].trim()}
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={img} onClick={() => setActiveImg(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === activeImg ? "border-accent shadow-md shadow-accent/20" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <Image src={img} alt="" fill className="object-contain bg-white p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div>
            {product.standards && (
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
                {product.standards}
              </p>
            )}
            <h1 className="text-2xl font-black text-navy-950 sm:text-3xl leading-tight">{product.name}</h1>

            <div className="mt-6">
              <QuoteButton productName={product.name} />
            </div>

            {/* Öne çıkan özellikler */}
            {product.highlights?.length > 0 && (
              <div className="mt-8 rounded-2xl bg-navy-950 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Öne Çıkan Özellikler</p>
                <ul className="space-y-2">
                  {product.highlights.map((h: string) => (
                    <li key={h} className="flex gap-2 text-sm text-zinc-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tabs */}

{activeTab === "standartlar" && product.standards && (
  <div className="space-y-2">
    {product.standards.split(";").map((s: string) => s.trim()).filter(Boolean).map((std: string) => (
      <div key={std} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
        <span className="text-sm font-medium text-navy-950">{std}</span>
      </div>
    ))}
  </div>
)}
            <div className="mt-6">
              <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                {[
                  { key: "aciklama", label: "Açıklama" },
                  { key: "specs", label: "Teknik Özellikler" },
...(product.standards ? [{ key: "standartlar", label: "Standartlar" }] : []),
...(product.use_cases?.length > 0 ? [{ key: "kullanim", label: "Kullanım" }] : []),
                ].map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                      activeTab === tab.key
                        ? "bg-white text-navy-950 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {activeTab === "aciklama" && product.description && (
                  <div className="prose text-sm text-zinc-600"
                    dangerouslySetInnerHTML={{ __html: product.description }} />
                )}
                {activeTab === "specs" && product.specs?.length > 0 && (
                  <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specs.map((spec: ProductSpec, i: number) => (
                          <tr key={spec.label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="w-2/5 border-b border-gray-100 px-4 py-3 font-semibold text-navy-950">{spec.label}</td>
                            <td className="border-b border-gray-100 px-4 py-3 text-zinc-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {activeTab === "kullanim" && product.use_cases?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.use_cases.map((u: string) => (
                      <span key={u} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm">
                        {u}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* İlgili ürünler */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-navy-950">{cat.name} — Diğer Ürünler</h2>
              <Link href={`/urunler/${cat.slug}`} className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors">
                Tümünü Gör →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((r) => (
                <Link key={r.id} href={`/urunler/${cat.slug}/${r.slug}`}
                  className="premium-card group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
                    {r.image_url
                      ? <Image src={r.image_url} alt={r.name} fill className="object-contain p-3 transition-transform duration-500 group-hover:scale-105" sizes="200px" />
                      : <span className="text-3xl opacity-20">⚗️</span>}
                  </div>
                  <div className="border-t border-gray-100 p-3">
                    <h3 className="text-xs font-bold text-navy-950 group-hover:text-accent transition-colors line-clamp-2">{r.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
