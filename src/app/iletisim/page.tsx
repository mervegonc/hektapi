"use client";
import { useState, FormEvent } from "react";

export default function IletisimPage() {
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/teklif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: "Genel İletişim",
        name: `${fd.get("firstName")} ${fd.get("lastName")}`.trim(),
        email: fd.get("email"),
        phone: fd.get("phone"),
        message: fd.get("message"),
      }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  return (
    <div className="bg-navy-950 min-h-screen text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">Bizimle iletişime geçin</h1>
          <p className="mb-8 text-zinc-300">Sorularınız ve teklif talepleriniz için aşağıdaki bilgilerden bize ulaşabilirsiniz.</p>
          <div className="space-y-3 text-sm text-zinc-300">
            <p>📍 İvedik OSB 1462. Cadde No:24, Yenimahalle / ANKARA</p>
            <p><a href="tel:+905346111271" className="hover:text-accent">📞 0534 611 12 71</a></p>
            <p><a href="mailto:info@hektapi.com.tr" className="hover:text-accent">✉️ info@hektapi.com.tr</a></p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.linkedin.com/company/hektapi̇-mühendi̇sli̇k-san-ve-ti̇c-ltd-şti̇/" target="_blank" rel="noreferrer"
                className="font-semibold hover:text-accent">LinkedIn</a>
              <a href="https://www.instagram.com/hektapi.muhendislik/" target="_blank" rel="noreferrer"
                className="font-semibold hover:text-accent">Instagram</a>
            </div>
          </div>
          {/* Google Maps embed */}
          <div className="mt-8 overflow-hidden rounded-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.5!2d32.7!3d39.99!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU5JzI0LjAiTiAzMsKwNDInMDAuMCJF!5e0!3m2!1str!2str!4v1"
              width="100%" height="220" style={{ border: 0 }} allowFullScreen loading="lazy"
              title="Hektapi Konum" />
          </div>
        </div>

        <div>
          {status === "sent" ? (
            <div className="rounded-2xl bg-white p-10 text-center text-navy-950">
              <div className="mb-3 text-5xl">✅</div>
              <h2 className="text-xl font-bold">Mesajınız alındı!</h2>
              <p className="mt-2 text-sm text-zinc-500">En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 text-navy-950 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold italic" style={{ fontFamily: "Georgia, serif" }}>İletişim</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "İsim *", required: true },
                  { name: "lastName", label: "Soyisim", required: false },
                  { name: "email", label: "Email *", required: true, type: "email" },
                  { name: "phone", label: "Telefon", required: false, type: "tel" },
                ].map(({ name, label, required, type }) => (
                  <div key={name}>
                    <label className="block text-sm text-zinc-500 mb-1">{label}</label>
                    <input name={name} type={type || "text"} required={required}
                      className="w-full rounded-md bg-blue-50/50 border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy-700" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-sm text-zinc-500 mb-1">Mesajınız</label>
                  <textarea name="message" rows={5}
                    className="w-full rounded-md bg-blue-50/50 border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-navy-700" />
                </div>
              </div>
              {status === "error" && <p className="mt-3 text-sm text-red-600">Bir hata oluştu, lütfen tekrar deneyin.</p>}
              <button type="submit" disabled={status === "sending"}
                className="mt-6 w-full rounded-md bg-navy-900 py-3 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
                {status === "sending" ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
