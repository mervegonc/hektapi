"use client";
import { useState, FormEvent } from "react";

export default function QuoteButton({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleClose() {
    setOpen(false);
    setStatus("idle");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/teklif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        company: fd.get("company"),
        quantity: fd.get("quantity"),
        urgency: fd.get("urgency"),
        message: fd.get("message"),
      }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="rounded-md bg-accent px-6 py-3 font-bold text-navy-950 hover:bg-accent-dark transition-colors">
        Teklif Al
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto"
          onClick={handleClose}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl my-4"
            onClick={e => e.stopPropagation()}>

            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-950">Teklif Talebi</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{productName}</p>
              </div>
              <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-700 text-xl">✕</button>
            </div>

            {status === "sent" ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-5xl">✅</div>
                <p className="font-bold text-navy-950 text-lg">Talebiniz alındı!</p>
                <p className="mt-2 text-sm text-zinc-500">
                  En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <button onClick={handleClose}
                  className="mt-5 rounded-md bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Ad Soyad *</label>
                    <input name="name" required
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Firma Adı</label>
                    <input name="company"
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">E-posta *</label>
                    <input name="email" type="email" required
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Telefon</label>
                    <input name="phone" type="tel"
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Adet / Miktar</label>
                    <input name="quantity" placeholder="ör: 2 adet"
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Aciliyet</label>
                    <select name="urgency"
                      className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none">
                      <option value="">Seçiniz</option>
                      <option value="acil">Acil (1 hafta içinde)</option>
                      <option value="normal">Normal (1 ay içinde)</option>
                      <option value="planlama">Planlama aşamasında</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Mesaj / Özel İstekler</label>
                  <textarea name="message" rows={3}
                    className="w-full rounded-lg border border-zinc-300 bg-blue-50/40 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-600">Bir hata oluştu, lütfen tekrar deneyin.</p>
                )}

                <button type="submit" disabled={status === "sending"}
                  className="w-full rounded-lg bg-navy-900 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
                  {status === "sending" ? "Gönderiliyor..." : "Teklif Talep Et"}
                </button>
                <p className="text-center text-xs text-zinc-400">
                  Bilgileriniz yalnızca teklif sürecinde kullanılır.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}