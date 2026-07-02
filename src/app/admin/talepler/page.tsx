"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Inquiry {
  id: string;
  product_name: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  quantity: string | null;
  urgency: string | null;
  message: string | null;
  status: string;
  admin_note: string | null;
  replied_at: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  yeni: { label: "Yeni", color: "bg-blue-100 text-blue-800" },
  inceleniyor: { label: "İnceleniyor", color: "bg-yellow-100 text-yellow-800" },
  yanitlandi: { label: "Yanıtlandı", color: "bg-green-100 text-green-800" },
  kapatildi: { label: "Kapatıldı", color: "bg-zinc-100 text-zinc-600" },
};

const URGENCY_LABELS: Record<string, string> = {
  acil: "⚡ Acil",
  normal: "📅 Normal",
  planlama: "🔮 Planlama",
};

export default function TaleplerPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [note, setNote] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    let query = createClient().from("inquiries").select("*").order("created_at", { ascending: false });
    if (filterStatus) query = query.eq("status", filterStatus);
    const { data } = await query;
    setInquiries(data || []);
  }

  useEffect(() => { load(); }, [filterStatus]);

  function openDetail(inq: Inquiry) {
    setSelected(inq);
    setNote(inq.admin_note || "");
    setReplyText("");
  }

  async function handleStatusChange(id: string, status: string) {
    await createClient().from("inquiries").update({ status }).eq("id", id);
    setSelected(prev => prev ? { ...prev, status } : prev);
    load();
  }

  async function handleNoteSave() {
    if (!selected) return;
    setSaving(true);
    await createClient().from("inquiries").update({ admin_note: note }).eq("id", selected.id);
    setSaving(false);
    setSelected(prev => prev ? { ...prev, admin_note: note } : prev);
    load();
  }

  async function handleReply() {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/teklif-yanitla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryId: selected.id,
          toEmail: selected.email,
          toName: selected.name,
          productName: selected.product_name,
          replyText,
        }),
      });
      if (res.ok) {
        await createClient().from("inquiries").update({
          status: "yanitlandi",
          replied_at: new Date().toISOString(),
        }).eq("id", selected.id);
        setSelected(prev => prev ? { ...prev, status: "yanitlandi" } : prev);
        setReplyText("");
        load();
        alert("Yanıt başarıyla gönderildi!");
      } else {
        alert("Yanıt gönderilemedi.");
      }
    } catch {
      alert("Bir hata oluştu.");
    }
    setSending(false);
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Liste */}
      <div className="flex-1 min-w-0">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-navy-950">Teklif Talepleri</h1>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none">
            <option value="">Tümü</option>
            {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Özet kartlar */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {Object.entries(STATUS_LABELS).map(([val, { label, color }]) => (
            <button key={val} onClick={() => setFilterStatus(filterStatus === val ? "" : val)}
              className={`rounded-xl border p-3 text-center transition-all ${filterStatus === val ? "border-navy-700 shadow-md" : "border-zinc-200 bg-white"}`}>
              <p className="text-2xl font-bold text-navy-950">
                {inquiries.filter(i => i.status === val).length}
              </p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-white border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Tarih</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Müşteri</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Ürün</th>
                <th className="px-4 py-3 text-left font-semibold text-zinc-600">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {inquiries.map(inq => (
                <tr key={inq.id}
                  onClick={() => openDetail(inq)}
                  className={`cursor-pointer hover:bg-zinc-50 transition-colors ${selected?.id === inq.id ? "bg-blue-50" : ""}`}>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap text-xs">
                    {new Date(inq.created_at).toLocaleDateString("tr-TR")}
                    <br />
                    {new Date(inq.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-950">{inq.name}</p>
                    {inq.company && <p className="text-xs text-zinc-500">{inq.company}</p>}
                    <p className="text-xs text-zinc-400">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 max-w-[160px] truncate">
                    {inq.product_name}
                    {inq.urgency && <span className="block text-zinc-400">{URGENCY_LABELS[inq.urgency] || inq.urgency}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_LABELS[inq.status]?.color || "bg-zinc-100 text-zinc-600"}`}>
                      {STATUS_LABELS[inq.status]?.label || inq.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inquiries.length === 0 && (
            <div className="py-12 text-center text-zinc-400">Henüz teklif talebi yok.</div>
          )}
        </div>
      </div>

      {/* Detay paneli */}
      {selected && (
        <div className="w-96 shrink-0 rounded-xl bg-white border border-zinc-200 p-5 h-fit sticky top-6 space-y-5">
          <div className="flex items-start justify-between">
            <h2 className="font-bold text-navy-950">Talep Detayı</h2>
            <button onClick={() => setSelected(null)} className="text-zinc-400 hover:text-zinc-700">✕</button>
          </div>

          {/* Müşteri bilgileri */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Ad Soyad</span>
              <span className="font-medium">{selected.name}</span>
            </div>
            {selected.company && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Firma</span>
                <span className="font-medium">{selected.company}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">E-posta</span>
              <a href={`mailto:${selected.email}`} className="text-navy-700 hover:underline">{selected.email}</a>
            </div>
            {selected.phone && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Telefon</span>
                <a href={`tel:${selected.phone}`} className="font-medium">{selected.phone}</a>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500">Ürün</span>
              <span className="font-medium text-right max-w-[180px] text-xs">{selected.product_name}</span>
            </div>
            {selected.quantity && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Adet</span>
                <span className="font-medium">{selected.quantity}</span>
              </div>
            )}
            {selected.urgency && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Aciliyet</span>
                <span className="font-medium">{URGENCY_LABELS[selected.urgency] || selected.urgency}</span>
              </div>
            )}
            {selected.message && (
              <div className="pt-2 border-t border-zinc-100">
                <p className="text-zinc-500 mb-1">Mesaj</p>
                <p className="text-zinc-700 text-xs leading-relaxed">{selected.message}</p>
              </div>
            )}
          </div>

          {/* Durum değiştir */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">Durum</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(STATUS_LABELS).map(([val, { label, color }]) => (
                <button key={val} onClick={() => handleStatusChange(selected.id, val)}
                  className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${selected.status === val ? color + " ring-2 ring-offset-1 ring-navy-700" : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin notu */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">Admin Notu</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
              placeholder="İç notunuzu buraya yazın..."
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs focus:border-navy-700 focus:outline-none resize-none" />
            <button onClick={handleNoteSave} disabled={saving}
              className="mt-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-60">
              {saving ? "Kaydediliyor..." : "Notu Kaydet"}
            </button>
          </div>

          {/* Yanıt gönder */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Müşteriye Yanıt Gönder
            </label>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4}
              placeholder={`${selected.name} adlı müşteriye yanıtınızı yazın...`}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs focus:border-navy-700 focus:outline-none resize-none" />
            <button onClick={handleReply} disabled={sending || !replyText.trim()}
              className="mt-1.5 w-full rounded-lg bg-navy-900 px-3 py-2 text-xs font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
              {sending ? "Gönderiliyor..." : "✉️ Yanıt Gönder"}
            </button>
            {selected.replied_at && (
              <p className="mt-1 text-center text-xs text-zinc-400">
                Son yanıt: {new Date(selected.replied_at).toLocaleDateString("tr-TR")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}