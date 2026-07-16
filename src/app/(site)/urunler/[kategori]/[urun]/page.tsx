import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, ProductSpec } from "@/types";
import QuoteButton from "@/components/QuoteButton";

export default async function UrunDetayPage({
  params,
}: {
  params: Promise<{ kategori: string; urun: string }>;
}) {
  const { kategori, urun } = await params;
  const supabase = await createClient();

  const [{ data: catData }, { data: prodData }] = await Promise.all([
    supabase.from("categories").select("*").eq("slug", kategori).single(),
    supabase.from("products").select("*").eq("slug", urun).single(),
  ]);

  if (!catData || !prodData) return notFound();

  const cat: Category = catData;
  const product: Product = prodData;

  const { data: relatedData } = await supabase
    .from("products")
    .select("id, name, slug, image_url")
    .contains("category_ids", [cat.id])
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4);

  const related = relatedData || [];
  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];
  const specs: ProductSpec[] = product.specs || [];
  const highlights: string[] = product.highlights || [];
  const useCases: string[] = product.use_cases || [];

  return (
    <div className="bg-white">
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
          {/* Resimler */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-50 border border-gray-100" style={{ aspectRatio: "1/1" }}>
              {allImages.length > 0
                ? <Image src={allImages[0]} alt={product.name} fill className="object-contain p-8"
                    sizes="(max-width: 1024px) 100vw, 50vw" priority />
                : <div className="flex h-full items-center justify-center"><span className="text-8xl opacity-10">⚗️</span></div>}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.slice(1).map((img) => (
                  <div key={img} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-gray-200">
                    <Image src={img} alt="" fill className="object-contain bg-white p-1" sizes="64px" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div>
            <h1 className="text-2xl font-black text-navy-950 sm:text-3xl leading-tight">{product.name}</h1>
            <div className="mt-6"><QuoteButton productName={product.name} /></div>

            {highlights.length > 0 && (
              <div className="mt-8 rounded-2xl bg-navy-950 p-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Öne Çıkan Özellikler</p>
                <ul className="space-y-2">
                  {highlights.map((h: string) => (
                    <li key={h} className="flex gap-2 text-sm text-zinc-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tabs — client component olarak ayrı tutuyoruz */}
            <ProductTabs
              description={product.description}
              specs={specs}
              standards={product.standards}
              useCases={useCases}
            />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black text-navy-950">{cat.name} — Diğer Ürünler</h2>
              <Link href={`/urunler/${cat.slug}`} className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors">Tümünü Gör →</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((r) => (
                <Link key={r.id} href={`/urunler/${cat.slug}/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
                    {r.image_url
                      ? <Image src={r.image_url} alt={r.name} fill className="object-contain p-3" sizes="200px" loading="lazy" />
                      : <span className="text-3xl opacity-20">⚗️</span>}
                  </div>
                  <div className="border-t border-gray-100 p-3">
                    <h3 className="text-xs font-bold text-navy-950 line-clamp-2">{r.name}</h3>
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

// Tab içeriği için inline client component
import ProductTabs from "@/components/ProductTabs";
