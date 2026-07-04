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
    <div>
      {/* Hero */}


      {/* Grid */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => (
              <Link key={cat.id} href={`/urunler/${cat.slug}`}
                className="premium-card group relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  {cat.image_url
                    ? <Image src={cat.image_url} alt={cat.name} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
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
                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
