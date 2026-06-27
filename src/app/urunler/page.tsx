"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

export default function UrunlerPage() {
  const [cats, setCats] = useState<Category[]>([]);
  useEffect(() => {
    createClient().from("categories").select("*").order("order")
      .then(({ data }) => setCats(data || []));
  }, []);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-navy-950">Ürün Kategorileri</h1>
      <p className="mb-10 text-zinc-500">Kategoriye tıklayarak ilgili ürünleri görüntüleyebilirsiniz.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((cat) => (
          <Link key={cat.id} href={`/urunler/${cat.slug}`}
            className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-lg transition-all">
            <div className="relative flex h-48 items-center justify-center bg-zinc-50">
              {cat.image_url
                ? <Image src={cat.image_url} alt={cat.name} fill className="object-contain p-4" sizes="400px" />
                : <span className="text-5xl">🔬</span>}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-navy-950 group-hover:text-accent-dark">{cat.name}</h2>
              {cat.description && <p className="mt-2 text-sm text-zinc-500">{cat.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
