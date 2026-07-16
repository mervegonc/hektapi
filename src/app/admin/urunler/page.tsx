"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/types";
import { QUERY_LIMITS } from "@/lib/query-limits";

export default function AdminUrunlerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCat, setFilterCat] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    const sb = createClient();
    const [{ data: p }, { data: c }] = await Promise.all([
      sb.from("products").select("*").order("created_at", { ascending: false }).limit(QUERY_LIMITS.adminProducts),
      sb.from("categories").select("*").order("order"),
    ]);
    setProducts(p || []);
    setCategories(c || []);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await createClient().from("products").delete().eq("id", id);
    load();
  }

  function categoryNames(ids: string[] = []) {
    return ids
      .map(id => categories.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "-";
  }

  const filtered = products.filter(p =>
    (filterCat ? p.category_ids?.includes(filterCat) : true) &&
    (search ? p.name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-950">Ürünler</h1>
        <Link href="/admin/urunler/yeni"
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Ürün
        </Link>
      </div>

      <div className="mb-4 flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..."
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none">
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
        <th className="px-4 py-3 text-left font-semibold text-zinc-600">Ürün</th>
<th className="px-4 py-3 text-left font-semibold text-zinc-600">Kategoriler</th>
<th className="px-4 py-3 text-left font-semibold text-zinc-600">Durum</th>
<th className="px-4 py-3 text-left font-semibold text-zinc-600">Eklenme</th>
<th className="px-4 py-3 text-right font-semibold text-zinc-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                      {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-contain p-1" sizes="40px" />}
                    </div>
                    <span className="font-medium text-navy-950">{p.name}</span>
                  </div>
                </td>
<td className="px-4 py-3 text-xs text-zinc-400">
  {new Date(p.created_at).toLocaleDateString("tr-TR")}<br/>
  {new Date(p.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
</td>

                <td className="px-4 py-3 text-zinc-500">{categoryNames(p.category_ids)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    p.is_active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {p.is_active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/urunler/${p.id}`}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-navy-950 hover:bg-zinc-50 transition-colors">
                      Düzenle
                    </Link>
                    <button onClick={() => handleDelete(p.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-zinc-400">Ürün bulunamadı.</div>
        )}
      </div>
    </div>
  );
}