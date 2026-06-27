"use client";
import { useState, FormEvent } from "react";

export default function QuoteButton({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-navy-950">Teklif Al</h3>
                <p className="text-sm text-zinc-500">{productName}</p>
              </div>
              <button onClick={() => { setOpen(false); setStatus("idle"); }} className="text-zinc-400 hover:text-zinc-700 text-xl">✕</button>
            </div>

            {status === "sent" ? (
              <div className="py-8 text-center">
                <div className="mb-3 text-4xl">✅</div>
                <p className="font-bold text-navy-950">Talebiniz alındı!</p>
                <p className="mt-2 text-sm text-zinc-500">En kısa sürede sizinle iletişime geçeceğiz.</p>
                <button onClick={() => { setOpen(false); setStatus("idle"); }}
                  className="mt-4 rounded-md bg-navy-900 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800">
                  Kapat
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  { name: "name", label: "Ad Soyad *", type: "text", required: true },
                  { name: "email", label: "E-posta *", type: "email", required: true },
                  { name: "phone", label: "Telefon", type: "tel", required: false },
                ].map(({ name, label, type, required }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-navy-950">{label}</label>
                    <input name={name} type={type} required={required}
                      className="mt-1 w-full rounded-md border border-zinc-300 bg-blue-50/50 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-navy-950">Mesajınız</label>
                  <textarea name="message" rows={3}
                    className="mt-1 w-full rounded-md border border-zinc-300 bg-blue-50/50 px-3 py-2.5 text-sm focus:border-navy-700 focus:outline-none" />
                </div>
                {status === "error" && <p className="text-sm text-red-600">Bir hata oluştu, lütfen tekrar deneyin.</p>}
                <button type="submit" disabled={status === "sending"}
                  className="w-full rounded-md bg-navy-900 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
                  {status === "sending" ? "Gönderiliyor..." : "Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
