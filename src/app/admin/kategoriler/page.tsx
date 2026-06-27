"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminKategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await createClient().from("categories").select("*").order("order");
    setCategories(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing?.name) return;
    setSaving(true);
    const sb = createClient();
    const payload = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description || null,
      image_url: editing.image_url || null,
      order: editing.order || 0,
    };
    if (editing.id) {
      await sb.from("categories").update(payload).eq("id", editing.id);
    } else {
      await sb.from("categories").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? İçindeki ürünler kategorisiz kalacak.")) return;
    await createClient().from("categories").delete().eq("id", id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-950">Kategoriler</h1>
        <button onClick={() => setEditing({ name: "", slug: "", description: "", order: categories.length + 1 })}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Kategori
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="mb-6 rounded-xl bg-white border border-zinc-200 p-6">
          <h2 className="mb-4 font-bold text-navy-950">{editing.id ? "Kategori Düzenle" : "Yeni Kategori"}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Kategori Adı *</label>
              <input value={editing.name || ""} onChange={e => setEditing(v => ({ ...v!, name: e.target.value, slug: slugify(e.target.value) }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Slug (URL)</label>
              <input value={editing.slug || ""} onChange={e => setEditing(v => ({ ...v!, slug: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-mono focus:border-navy-700 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Açıklama</label>
              <input value={editing.description || ""} onChange={e => setEditing(v => ({ ...v!, description: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Sıra</label>
              <input type="number" value={editing.order || 0} onChange={e => setEditing(v => ({ ...v!, order: +e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button onClick={() => setEditing(null)}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Kategori</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Slug</th>
              <th className="px-4 py-3 text-left font-semibold text-zinc-600">Sıra</th>
              <th className="px-4 py-3 text-right font-semibold text-zinc-600">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-zinc-100">
                      {cat.image_url && <Image src={cat.image_url} alt={cat.name} fill className="object-contain p-0.5" sizes="32px" />}
                    </div>
                    <span className="font-medium text-navy-950">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-zinc-500">{cat.slug}</td>
                <td className="px-4 py-3 text-zinc-500">{cat.order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(cat)}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition-colors">
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(cat.id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
