"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Standard {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  pdf_url: string | null;
  order: number;
  is_active: boolean;
}

const CATEGORIES = ["ISO", "ASTM", "TS EN", "BS", "DIN", "Diğer"];

export default function AdminStandartlarPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [editing, setEditing] = useState<Partial<Standard> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await createClient().from("standards").select("*").order("order");
    setStandards(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error } = await supabase.storage.from("standards").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("standards").getPublicUrl(path);
      setEditing(v => ({ ...v!, pdf_url: data.publicUrl }));
    } catch {
      alert("PDF yüklenemedi.");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!editing?.title) { alert("Başlık zorunludur."); return; }
    setSaving(true);
    const sb = createClient();
    const payload = {
      title: editing.title,
      description: editing.description || null,
      category: editing.category || null,
      pdf_url: editing.pdf_url || null,
      order: editing.order ?? standards.length,
      is_active: editing.is_active ?? true,
    };
    if (editing.id) {
      await sb.from("standards").update(payload).eq("id", editing.id);
    } else {
      await sb.from("standards").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu standardı silmek istediğinize emin misiniz?")) return;
    await createClient().from("standards").delete().eq("id", id);
    load();
  }

  async function toggleActive(s: Standard) {
    await createClient().from("standards").update({ is_active: !s.is_active }).eq("id", s.id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Standartlar</h1>
          <p className="text-sm text-zinc-500 mt-1">PDF standart belgelerini yönetin.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", description: "", category: "ISO", order: standards.length, is_active: true })}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Standart
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="mb-6 rounded-xl bg-white border border-zinc-200 p-6">
          <h2 className="mb-4 font-bold text-navy-950">{editing.id ? "Standart Düzenle" : "Yeni Standart"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Başlık *</label>
                <input value={editing.title || ""} onChange={e => setEditing(v => ({ ...v!, title: e.target.value }))}
                  placeholder="TS EN 12390-3"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Kategori</label>
                <select value={editing.category || ""} onChange={e => setEditing(v => ({ ...v!, category: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none">
                  <option value="">Seçin...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Açıklama</label>
              <textarea value={editing.description || ""} onChange={e => setEditing(v => ({ ...v!, description: e.target.value }))} rows={2}
                placeholder="Bu standart hakkında kısa açıklama..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>

            {/* PDF yükleme */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">PDF Dosyası</label>
              {editing.pdf_url && (
                <div className="mb-2 flex items-center gap-3 rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3">
                  <span className="text-xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 truncate">{editing.pdf_url.split("/").pop()}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={editing.pdf_url} target="_blank" rel="noreferrer"
                      className="text-xs text-navy-700 hover:text-accent font-medium">Görüntüle</a>
                    <button onClick={() => setEditing(v => ({ ...v!, pdf_url: "" }))}
                      className="text-xs text-red-500 hover:text-red-700 font-medium">Kaldır</button>
                  </div>
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="rounded-lg border-2 border-dashed border-zinc-300 px-6 py-3 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 disabled:opacity-60 transition-colors">
                {uploading ? "Yükleniyor..." : "📤 PDF Seç ve Yükle"}
              </button>
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Sıra</label>
                <input type="number" value={editing.order ?? 0} onChange={e => setEditing(v => ({ ...v!, order: +e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="stdActive" checked={editing.is_active ?? true}
                  onChange={e => setEditing(v => ({ ...v!, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300" />
                <label htmlFor="stdActive" className="text-sm font-medium text-zinc-700">Aktif</label>
              </div>
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
      {standards.length === 0 ? (
        <div className="rounded-xl bg-white border border-zinc-200 py-16 text-center text-zinc-400">
          Henüz standart eklenmemiş.
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Standart</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">PDF</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Durum</th>
                <th className="px-4 py-3 text-right font-semibold text-zinc-600">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {standards.map(s => (
                <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-950">{s.title}</p>
                    {s.description && <p className="text-xs text-zinc-400 truncate max-w-xs">{s.description}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {s.category && (
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {s.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {s.pdf_url
                      ? <a href={s.pdf_url} target="_blank" rel="noreferrer"
                          className="text-xs text-navy-700 hover:text-accent font-medium">📄 Görüntüle</a>
                      : <span className="text-xs text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(s)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"}`}>
                      {s.is_active ? "Aktif" : "Pasif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(s)}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition-colors">
                        Düzenle
                      </button>
                      <button onClick={() => handleDelete(s.id)}
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
      )}
    </div>
  );
}
