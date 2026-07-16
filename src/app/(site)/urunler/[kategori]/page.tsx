import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("name, description").eq("slug", kategori).single();

  if (!data) {
    return pageMetadata({
      title: "Kategori",
      description: "Hektapi ürün kategorisi.",
      path: `/urunler/${kategori}`,
    });
  }

  return pageMetadata({
    title: data.name,
    description: data.description || `${data.name} test ekipmanları ve cihazları.`,
    path: `/urunler/${kategori}`,
  });
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori } = await params;
  const supabase = await createClient();

  const { data: catData } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", kategori)
    .single();

  if (!catData) return notFound();
  const cat: Category = catData;

  const { data: productsData } = await supabase
    .from("products")
    .select("*")
    .contains("category_ids", [cat.id])
    .eq("is_active", true)
    .order("created_at");

  const products: Product[] = productsData || [];

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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <Link key={p.id} href={`/urunler/${cat.slug}/${p.slug}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-50">
                      {p.image_url
                        ? <Image src={p.image_url} alt={p.name} fill
                            className="object-contain p-4"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            loading="lazy" />
                        : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-5xl opacity-20">⚗️</span>
                          </div>
                        )}
                    </div>
                    <div className="border-t border-gray-100 p-3">
                      <h2 className="text-sm font-bold text-navy-950 line-clamp-2">{p.name}</h2>
                      {p.short_description && (
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{p.short_description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent">
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
