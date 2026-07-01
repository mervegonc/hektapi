"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Slide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  order: number;
  is_active: boolean;
}

export default function AdminSliderPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await createClient().from("hero_slides").select("*").order("order");
    setSlides(data || []);
  }

  useEffect(() => { load(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("slides").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("slides").getPublicUrl(path);
      setEditing(v => ({ ...v!, image_url: data.publicUrl }));
    } catch {
      alert("Görsel yüklenemedi. 'slides' bucket'ının public olduğundan emin olun.");
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!editing?.image_url) { alert("Görsel zorunludur."); return; }
    setSaving(true);
    const sb = createClient();
    const payload = {
      title: editing.title || null,
      subtitle: editing.subtitle || null,
      image_url: editing.image_url,
      button_text: editing.button_text || null,
      button_link: editing.button_link || "/urunler",
      order: editing.order ?? slides.length,
      is_active: editing.is_active ?? true,
    };
    if (editing.id) {
      await sb.from("hero_slides").update(payload).eq("id", editing.id);
    } else {
      await sb.from("hero_slides").insert(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu slaytı silmek istediğinize emin misiniz?")) return;
    await createClient().from("hero_slides").delete().eq("id", id);
    load();
  }

  async function toggleActive(slide: Slide) {
    await createClient().from("hero_slides").update({ is_active: !slide.is_active }).eq("id", slide.id);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Hero Slider</h1>
          <p className="text-sm text-zinc-500 mt-1">Anasayfadaki kayan görsel alanını yönetin.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", subtitle: "", image_url: "", button_text: "Ürünleri İncele", button_link: "/urunler", order: slides.length, is_active: true })}
          className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors">
          + Yeni Slayt
        </button>
      </div>

      {/* Form */}
      {editing && (
        <div className="mb-6 rounded-xl bg-white border border-zinc-200 p-6">
          <h2 className="mb-4 font-bold text-navy-950">{editing.id ? "Slayt Düzenle" : "Yeni Slayt"}</h2>

          {/* Görsel */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Görsel * <span className="text-zinc-400 font-normal">(Önerilen: 1920x560px, geniş yatay format)</span>
            </label>
            {editing.image_url && (
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg border border-zinc-200">
                <Image src={editing.image_url} alt="Slayt" fill className="object-cover" sizes="700px" />
                <button onClick={() => setEditing(v => ({ ...v!, image_url: "" }))}
                  className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  Kaldır
                </button>
              </div>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="rounded-lg border-2 border-dashed border-zinc-300 px-6 py-3 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 disabled:opacity-60 transition-colors">
              {uploading ? "Yükleniyor..." : "Görsel Seç"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Başlık</label>
              <input value={editing.title || ""} onChange={e => setEditing(v => ({ ...v!, title: e.target.value }))}
                placeholder="ÖNCE TEST ET, SONRA GÜVEN"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Alt Başlık</label>
              <input value={editing.subtitle || ""} onChange={e => setEditing(v => ({ ...v!, subtitle: e.target.value }))}
                placeholder="Hektapi ile en son test cihazlarını keşfedin."
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Buton Yazısı</label>
              <input value={editing.button_text || ""} onChange={e => setEditing(v => ({ ...v!, button_text: e.target.value }))}
                placeholder="Ürünleri İncele"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Buton Linki</label>
              <input value={editing.button_link || ""} onChange={e => setEditing(v => ({ ...v!, button_link: e.target.value }))}
                placeholder="/urunler"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Sıra</label>
              <input type="number" value={editing.order ?? 0} onChange={e => setEditing(v => ({ ...v!, order: +e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="slideActive" checked={editing.is_active ?? true}
                onChange={e => setEditing(v => ({ ...v!, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-zinc-300" />
              <label htmlFor="slideActive" className="text-sm font-medium text-zinc-700">Aktif (sitede görünsün)</label>
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
      {slides.length === 0 ? (
        <div className="rounded-xl bg-white border border-zinc-200 py-16 text-center text-zinc-400">
          Henüz slayt eklenmemiş. "+ Yeni Slayt" ile başlayın.
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map(slide => (
            <div key={slide.id} className="flex items-center gap-4 rounded-xl bg-white border border-zinc-200 p-4">
              <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <Image src={slide.image_url} alt={slide.title || ""} fill className="object-cover" sizes="144px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-950 truncate">{slide.title || "(Başlıksız)"}</p>
                <p className="text-sm text-zinc-500 truncate">{slide.subtitle || ""}</p>
                <p className="text-xs text-zinc-400 mt-1">Sıra: {slide.order} · Link: {slide.button_link || "/urunler"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(slide)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${slide.is_active ? "bg-green-100 text-green-800" : "bg-zinc-100 text-zinc-600"}`}>
                  {slide.is_active ? "Aktif" : "Pasif"}
                </button>
                <button onClick={() => setEditing(slide)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium hover:bg-zinc-50 transition-colors">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(slide.id)}
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