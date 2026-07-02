"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  media_type: "image" | "youtube" | "none";
  media_url: string | null;
  youtube_url: string | null;
  order: number;
  is_active: boolean;
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function AdminHizmetlerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await createClient().from("services").select("*").order("order");
    setServices(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("slides").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("slides").getPublicUrl(path);
      setEditing(v => ({ ...v!, media_url: data.publicUrl, media_type: "image" }));
    } catch {
      alert("Görsel yüklenemedi.");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!editing?.title) { alert("Başlık zorunludur."); return; }
    setSaving(true);
    const sb = createClient();
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      description: editing.description || null,
      media_type: editing.media_type || "none",
      media_url: editing.media_type === "image" ? (editing.media_url || null) : null,
      youtube_url: editing.media_type === "youtube" ? (editing.youtube_url || null) : null,
      order: editing.order ?? services.length,
      is_active: editing.is_active ?? true,
    };
    if (editing.id) {
      await sb.from("services").update(payload).eq("id", editing.id);
    } else {
      await sb.from("services").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    await createClient().from("services").delete().eq("id", id);
    load();
  }

  async function toggleActive(s: Service) {
    await createClient().from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Hizmetlerimiz</h1>
          <p className="text-sm text-zinc-500 mt-1">Hizmetler sayfasındaki içerikleri yönetin.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", subtitle: "", description: "", media_type: "none", order: services.length, is_active: true })}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Hizmet
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="mb-6 rounded-xl bg-white border border-zinc-200 p-6">
          <h2 className="mb-4 font-bold text-navy-950">{editing.id ? "Hizmet Düzenle" : "Yeni Hizmet"}</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Başlık *</label>
                <input value={editing.title || ""} onChange={e => setEditing(v => ({ ...v!, title: e.target.value }))}
                  placeholder="3D Yazıcı Hizmeti"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Alt Başlık</label>
                <input value={editing.subtitle || ""} onChange={e => setEditing(v => ({ ...v!, subtitle: e.target.value }))}
                  placeholder="Hızlı prototipleme çözümleri"
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Açıklama</label>
              <textarea value={editing.description || ""} onChange={e => setEditing(v => ({ ...v!, description: e.target.value }))} rows={4}
                placeholder="Hizmet hakkında detaylı açıklama..."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>

            {/* Medya tipi seçimi */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Medya Türü</label>
              <div className="flex gap-3">
                {[
                  { value: "none", label: "Yok" },
                  { value: "image", label: "Görsel" },
                  { value: "youtube", label: "YouTube Video" },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mediaType" value={opt.value}
                      checked={editing.media_type === opt.value}
                      onChange={() => setEditing(v => ({ ...v!, media_type: opt.value as Service["media_type"] }))}
                      className="h-4 w-4 text-navy-700" />
                    <span className="text-sm text-zinc-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Görsel yükleme */}
            {editing.media_type === "image" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Görsel</label>
                {editing.media_url && (
                  <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg border border-zinc-200">
                    <Image src={editing.media_url} alt="Hizmet görseli" fill className="object-cover" sizes="600px" />
                    <button onClick={() => setEditing(v => ({ ...v!, media_url: "" }))}
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">Kaldır</button>
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="rounded-lg border-2 border-dashed border-zinc-300 px-6 py-3 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 disabled:opacity-60 transition-colors">
                  {uploading ? "Yükleniyor..." : "Görsel Seç"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            )}

            {/* YouTube linki */}
            {editing.media_type === "youtube" && (
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">YouTube Video Linki</label>
                <input value={editing.youtube_url || ""} onChange={e => setEditing(v => ({ ...v!, youtube_url: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                {editing.youtube_url && getYoutubeId(editing.youtube_url) && (
                  <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-lg bg-zinc-900">
                    <iframe width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${getYoutubeId(editing.youtube_url!)}`}
                      title="Video önizleme" allowFullScreen />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Sıra</label>
                <input type="number" value={editing.order ?? 0} onChange={e => setEditing(v => ({ ...v!, order: +e.target.value }))}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="svcActive" checked={editing.is_active ?? true}
                  onChange={e => setEditing(v => ({ ...v!, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300" />
                <label htmlFor="svcActive" className="text-sm font-medium text-zinc-700">Aktif (sitede görünsün)</label>
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
      {services.length === 0 ? (
        <div className="rounded-xl bg-white border border-zinc-200 py-16 text-center text-zinc-400">
          Henüz hizmet eklenmemiş.
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="flex items-center gap-4 rounded-xl bg-white border border-zinc-200 p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 flex items-center justify-center">
                {s.media_type === "image" && s.media_url
                  ? <Image src={s.media_url} alt={s.title} fill className="object-cover" sizes="96px" />
                  : s.media_type === "youtube"
                  ? <span className="text-2xl">▶️</span>
                  : <span className="text-2xl">📄</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-950">{s.title}</p>
                {s.subtitle && <p className="text-sm text-zinc-500">{s.subtitle}</p>}
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sıra: {s.order} · Medya: {s.media_type === "youtube" ? "YouTube" : s.media_type === "image" ? "Görsel" : "Yok"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${s.is_active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"}`}>
                  {s.is_active ? "Aktif" : "Pasif"}
                </button>
                <button onClick={() => setEditing(s)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition-colors">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(s.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}