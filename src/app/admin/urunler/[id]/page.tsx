"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import ProductForm from "@/components/ProductForm";

export default function UrunDuzenlePage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    createClient().from("products").select("*").eq("id", id).single()
      .then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <div className="flex h-64 items-center justify-center text-zinc-400">Yükleniyor...</div>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-950">Ürün Düzenle</h1>
      <ProductForm product={product} />
    </div>
  );
}
