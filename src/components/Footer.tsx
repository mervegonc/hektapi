"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10">
                <Image src="/logo.png" alt="Hektapi" fill className="object-contain" sizes="40px" />
              </div>
              <span className="text-xl font-black text-white">
                HEKTA<span className="text-accent">Pİ</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Endüstriyel test cihazları alanında 20+ yıllık deneyimle güvenilir çözümler sunuyoruz.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://www.linkedin.com/company/hektapi̇-mühendi̇sli̇k-san-ve-ti̇c-ltd-şti̇/"
                target="_blank" rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-all hover:bg-accent hover:text-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/hektapi.muhendislik/"
                target="_blank" rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-zinc-400 transition-all hover:bg-accent hover:text-navy-950">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Kurumsal</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["/kurumsal/hakkimizda", "Hakkımızda"],
                ["/kurumsal/vizyon-misyon", "Vizyon & Misyon"],
                ["/hizmetlerimiz", "Hizmetlerimiz"],
                ["/cozumlerimiz", "Çözümlerimiz"],
                ["/sertifikalar", "Sertifikalar"],
                ["/iletisim", "İletişim"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 transition-colors hover:text-accent">
                    <span className="h-px w-3 bg-accent/50 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Ürün Kategorileri</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["/urunler/asfalt", "Asfalt"],
                ["/urunler/beton", "Beton"],
                ["/urunler/cimento", "Çimento"],
                ["/urunler/zemin", "Zemin"],
                ["/urunler/tekstil", "Tekstil"],
                ["/urunler/tartma-kurutma-siniflandirma", "Tartma & Kurutma"],
                ["/urunler/universal-testing-machine", "Universal Testing Machine"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 transition-colors hover:text-accent">
                    <span className="h-px w-3 bg-accent/50 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">İletişim</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <svg className="mt-0.5 shrink-0 text-accent" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <a href="https://maps.google.com/?q=İvedik+OSB+1462.+Cadde+No:24+Yenimahalle+Ankara"
  target="_blank" rel="noreferrer"
  className="text-zinc-500 hover:text-accent transition-colors">
  İvedik OSB 1462. Cadde No:24, Yenimahalle / ANKARA
</a>
              </li>
              <li>
                <a href="https://wa.me/905346111271" className="flex items-center gap-3 transition-colors hover:text-accent">
                  <svg className="text-accent shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/>
                  </svg>
                  0534 611 12 71
                </a>
              </li>
              <li>
                <a href="mailto:info@hektapi.com.tr" className="flex items-center gap-3 transition-colors hover:text-accent">
                  <svg className="text-accent shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  info@hektapi.com.tr
                </a>
              </li>
            </ul>

            {/* Teklif Al — scroll fix */}
<Link href="/iletisim#iletisim-form"
  onClick={() => {
    setTimeout(() => {
      document.getElementById("iletisim-form")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }}
  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-navy-950 transition-all hover:bg-accent-light">
  Teklif Al
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Hektapi Mühendislik. Tüm hakları saklıdır.</p>
          <p className="text-xs text-zinc-700">Endüstriyel Test Cihazları | Ankara, Türkiye</p>
        </div>
      </div>
    </footer>
  );
}
