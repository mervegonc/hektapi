"use client";
import { useState, useRef, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product, ProductSpec } from "@/types";

interface Props {
  product?: Product;
}

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const extraFilesRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form alanları
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [shortDesc, setShortDesc] = useState(product?.short_description || "");
  const [desc, setDesc] = useState(product?.description || "");
  const [standards, setStandards] = useState(product?.standards || "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  // Görsel
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [extraImages, setExtraImages] = useState<string[]>(product?.images || []);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  // Dinamik alanlar
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs || []);
  const [highlights, setHighlights] = useState<string[]>(product?.highlights || []);
  const [useCases, setUseCases] = useState<string[]>(product?.use_cases || []);

  useEffect(() => {
    createClient().from("categories").select("*").order("order")
      .then(({ data }) => setCategories(data || []));
  }, []);

  // Slug otomatik üretimi
  useEffect(() => {
    if (!product) setSlug(slugify(name));
  }, [name, product]);

  async function uploadImage(file: File, bucket: string): Promise<string> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleMainImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadImage(file, "products");
      setImageUrl(url);
    } catch { setError("Görsel yüklenemedi."); }
    setUploadingMain(false);
  }

  async function handleExtraImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingExtra(true);
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f, "products")));
      setExtraImages(prev => [...prev, ...urls]);
    } catch { setError("Ek görseller yüklenemedi."); }
    setUploadingExtra(false);
  }

  async function handleSave() {
    if (!name || !categoryId || !slug) { setError("İsim, kategori ve slug zorunludur."); return; }
    setSaving(true);
    setError("");
    const supabase = createClient();

    const payload = {
      name, slug, category_id: categoryId,
      short_description: shortDesc || null,
      description: desc || null,
      standards: standards || null,
      image_url: imageUrl || null,
      images: extraImages,
      specs, highlights, use_cases: useCases,
      is_active: isActive,
    };

    const { error: err } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);

    if (err) { setError(err.message); setSaving(false); return; }
    router.push("/admin/urunler");
    router.refresh();
  }

  // Spec helpers
  const addSpec = () => setSpecs(s => [...s, { label: "", value: "" }]);
  const updateSpec = (i: number, field: "label"|"value", val: string) =>
    setSpecs(s => s.map((sp, idx) => idx === i ? { ...sp, [field]: val } : sp));
  const removeSpec = (i: number) => setSpecs(s => s.filter((_, idx) => idx !== i));

  // Highlight/UseCase helpers
  const addItem = (setter: typeof setHighlights) => setter(a => [...a, ""]);
  const updateItem = (setter: typeof setHighlights, i: number, val: string) =>
    setter(a => a.map((x, idx) => idx === i ? val : x));
  const removeItem = (setter: typeof setHighlights, i: number) =>
    setter(a => a.filter((_, idx) => idx !== i));

  return (
    <div className="max-w-3xl">
      {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Temel Bilgiler */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 mb-5">
        <h2 className="mb-4 font-bold text-navy-950">Temel Bilgiler</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Ürün Adı *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Slug (URL) *</label>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-mono focus:border-navy-700 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Kategori *</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none">
                <option value="">Seçin...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Standartlar</label>
            <input value={standards} onChange={e => setStandards(e.target.value)} placeholder="TS EN 12390-3; ASTM C39..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Kısa Açıklama</label>
            <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Detaylı Açıklama</label>
            <RichTextEditor value={desc} onChange={setDesc} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-navy-700" />
            <label htmlFor="isActive" className="text-sm font-medium text-zinc-700">Aktif (sitede görünsün)</label>
          </div>
        </div>
      </div>

      {/* Görseller */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 mb-5">
        <h2 className="mb-4 font-bold text-navy-950">Görseller</h2>
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700">Ana Görsel</p>
          {imageUrl && (
            <div className="relative mb-2 h-40 w-40 overflow-hidden rounded-lg border border-zinc-200">
              <Image src={imageUrl} alt="Ana görsel" fill className="object-contain bg-zinc-50 p-2" sizes="160px" />
              <button onClick={() => setImageUrl("")}
                className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white text-xs leading-none w-5 h-5 flex items-center justify-center">✕</button>
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploadingMain}
            className="rounded-lg border-2 border-dashed border-zinc-300 px-6 py-3 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 disabled:opacity-60 transition-colors">
            {uploadingMain ? "Yükleniyor..." : "Görsel Seç / Değiştir"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-zinc-700">Ek Görseller (galeri)</p>
          {extraImages.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {extraImages.map((img, i) => (
                <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200">
                  <Image src={img} alt="" fill className="object-contain bg-zinc-50 p-1" sizes="80px" />
                  <button onClick={() => setExtraImages(a => a.filter((_, idx) => idx !== i))}
                    className="absolute right-0.5 top-0.5 rounded-full bg-red-500 p-0.5 text-white text-xs w-4 h-4 flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => extraFilesRef.current?.click()} disabled={uploadingExtra}
            className="rounded-lg border-2 border-dashed border-zinc-300 px-6 py-3 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 disabled:opacity-60 transition-colors">
            {uploadingExtra ? "Yükleniyor..." : "+ Ek Görsel Ekle"}
          </button>
          <input ref={extraFilesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleExtraImages} />
        </div>
      </div>

      {/* Öne Çıkan Özellikler */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 mb-5">
        <h2 className="mb-4 font-bold text-navy-950">Öne Çıkan Özellikler</h2>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input value={h} onChange={e => updateItem(setHighlights, i, e.target.value)}
                placeholder={`Özellik ${i+1}`}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none" />
              <button onClick={() => removeItem(setHighlights, i)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50">Sil</button>
            </div>
          ))}
          <button onClick={() => addItem(setHighlights)}
            className="rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 transition-colors">
            + Özellik Ekle
          </button>
        </div>
      </div>

      {/* Teknik Özellikler */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 mb-5">
        <h2 className="mb-4 font-bold text-navy-950">Teknik Özellikler Tablosu</h2>
        <div className="space-y-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input value={spec.label} onChange={e => updateSpec(i, "label", e.target.value)}
                placeholder="Özellik adı (ör: Kapasite)"
                className="w-2/5 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none" />
              <input value={spec.value} onChange={e => updateSpec(i, "value", e.target.value)}
                placeholder="Değer (ör: 2000 kN)"
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none" />
              <button onClick={() => removeSpec(i)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50">Sil</button>
            </div>
          ))}
          <button onClick={addSpec}
            className="rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 transition-colors">
            + Satır Ekle
          </button>
        </div>
      </div>

      {/* Kullanım Alanları */}
      <div className="rounded-xl bg-white border border-zinc-200 p-6 mb-6">
        <h2 className="mb-4 font-bold text-navy-950">Kullanım Alanları</h2>
        <div className="space-y-2">
          {useCases.map((u, i) => (
            <div key={i} className="flex gap-2">
              <input value={u} onChange={e => updateItem(setUseCases, i, e.target.value)}
                placeholder={`Kullanım alanı ${i+1}`}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-navy-700 focus:outline-none" />
              <button onClick={() => removeItem(setUseCases, i)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 hover:bg-red-50">Sil</button>
            </div>
          ))}
          <button onClick={() => addItem(setUseCases)}
            className="rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 hover:border-navy-500 hover:text-navy-700 transition-colors">
            + Kullanım Alanı Ekle
          </button>
        </div>
      </div>

      {/* Kaydet */}
      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="rounded-lg bg-navy-900 px-8 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
          {saving ? "Kaydediliyor..." : product ? "Güncelle" : "Ürün Ekle"}
        </button>
        <button onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          İptal
        </button>
      </div>
    </div>
  );
}
