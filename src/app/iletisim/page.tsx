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
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-navy-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Bize Ulaşın</p>
          <h1 className="text-4xl font-black text-white sm:text-5xl">İletişim</h1>
          <div className="section-divider mt-4" />
          <p className="mt-4 max-w-xl text-zinc-400">
            Sorularınız ve teklif talepleriniz için bizimle iletişime geçin.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">

        {/* Sol — bilgiler */}
        <div>
          <h2 className="mb-8 text-2xl font-black text-navy-950">Bizimle iletişime geçin</h2>

          <div className="space-y-6">
            {/* Adres */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Adres</p>
                <p className="text-sm text-zinc-700 leading-relaxed">İvedik OSB 1462. Cadde No:24,<br />Yenimahalle / ANKARA</p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Telefon</p>
                <a href="tel:+905346111271" className="text-sm font-semibold text-navy-950 hover:text-accent transition-colors">
                  0534 611 12 71
                </a>
              </div>
            </div>

            {/* E-posta */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">E-posta</p>
                <a href="mailto:info@hektapi.com.tr" className="text-sm font-semibold text-navy-950 hover:text-accent transition-colors">
                  info@hektapi.com.tr
                </a>
              </div>
            </div>

            {/* Sosyal medya — LinkedIn ve Instagram alt alta */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Sosyal Medya</p>
                <a href="https://www.linkedin.com/company/hektapi̇-mühendi̇sli̇k-san-ve-ti̇c-ltd-şti̇/"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-accent transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/hektapi.muhendislik/"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-accent transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Harita */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=İvedik+OSB+1462+Cadde+No+24+Yenimahalle+Ankara&output=embed"
              width="100%" height="240" style={{ border: 0 }} allowFullScreen loading="lazy"
              title="Hektapi Konum" />
          </div>
          <a href="https://maps.google.com/?q=İvedik+OSB+1462.+Cadde+No:24+Yenimahalle+Ankara"
            target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Google Maps'te Aç →
          </a>
        </div>

        {/* Sağ — form */}
        <div>
          {status === "sent" ? (
            <div className="rounded-2xl bg-navy-950 p-10 text-center">
              <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-accent/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-white">Mesajınız alındı!</h2>
              <p className="mt-2 text-sm text-zinc-400">En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-black text-navy-950">Mesaj Gönderin</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "İsim *", required: true },
                  { name: "lastName", label: "Soyisim", required: false },
                  { name: "email", label: "E-posta *", required: true, type: "email" },
                  { name: "phone", label: "Telefon", required: false, type: "tel" },
                ].map(({ name, label, required, type }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">{label}</label>
                    <input name={name} type={type || "text"} required={required}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-navy-700 focus:bg-white focus:outline-none transition-colors" />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Mesajınız</label>
                  <textarea name="message" rows={5}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-zinc-900 focus:border-navy-700 focus:bg-white focus:outline-none transition-colors resize-none" />
                </div>
              </div>
              {status === "error" && (
                <p className="mt-3 text-sm text-red-600">Bir hata oluştu, lütfen tekrar deneyin.</p>
              )}
              <button type="submit" disabled={status === "sending"}
                className="mt-5 w-full rounded-xl bg-navy-950 py-3.5 font-bold text-white hover:bg-navy-800 disabled:opacity-60 transition-colors">
                {status === "sending" ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
