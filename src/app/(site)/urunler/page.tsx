import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ürünler",
  description: "Asfalt, beton, çimento, zemin, tekstil ve daha fazlası için endüstriyel test cihazı kategorilerini inceleyin.",
  path: "/urunler",
});

export default async function UrunlerPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("order");
  const cats: Category[] = data || [];

  return (
    <div>
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => (
              <Link key={cat.id} href={`/urunler/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  {cat.image_url
                    ? <Image src={cat.image_url} alt={cat.name} fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy" />
                    : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-800">
                        <span className="text-6xl opacity-20">⚗️</span>
                      </div>
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-lg font-black text-white">{cat.name}</h2>
                    {cat.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-300">{cat.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
