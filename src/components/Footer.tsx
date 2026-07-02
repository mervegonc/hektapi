import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-zinc-400">
      {/* Ana footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-400 transition-all hover:bg-accent hover:text-navy-950">
                in
              </a>
              <a href="https://www.instagram.com/hektapi.muhendislik/"
                target="_blank" rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-400 transition-all hover:bg-accent hover:text-navy-950">
                ig
              </a>
            </div>
          </div>

          {/* Hızlı linkler */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Kurumsal</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["/kurumsal/hakkimizda", "Hakkımızda"],
                ["/kurumsal/vizyon-misyon", "Vizyon & Misyon"],
                ["/hizmetlerimiz", "Hizmetlerimiz"],
                ["/cozumlerimiz", "Çözümlerimiz"],
                ["/iletisim", "İletişim"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}
                    className="flex items-center gap-2 transition-colors hover:text-accent">
                    <span className="h-1 w-3 rounded bg-accent/50" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ürünler */}
          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white">Ürün Kategorileri</h3>
            <ul className="space-y-3 text-sm">
              {[
                ["/urunler/asfalt", "Asfalt"],
                ["/urunler/beton", "Beton"],
                ["/urunler/cimento", "Çimento"],
                ["/urunler/zemin", "Zemin"],
                ["/urunler/tekstil", "Tekstil"],
                ["/urunler/universal-testing-machine", "Universal Testing Machine"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}
                    className="flex items-center gap-2 transition-colors hover:text-accent">
                    <span className="h-1 w-3 rounded bg-accent/50" />
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
                <span className="mt-0.5 shrink-0 text-accent">📍</span>
                <span className="text-zinc-500">İvedik OSB 1462. Cadde No:24, Yenimahalle / ANKARA</span>
              </li>
              <li>
                <a href="tel:+905346111271"
                  className="flex items-center gap-3 transition-colors hover:text-accent">
                  <span className="text-accent">📞</span>
                  0534 611 12 71
                </a>
              </li>
              <li>
                <a href="mailto:info@hektapi.com.tr"
                  className="flex items-center gap-3 transition-colors hover:text-accent">
                  <span className="text-accent">✉️</span>
                  info@hektapi.com.tr
                </a>
              </li>
            </ul>

            <Link href="/iletisim"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-navy-950 transition-all hover:bg-accent-light">
              Teklif Al
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Alt bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Hektapi Mühendislik. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-zinc-700">
            Endüstriyel Test Cihazları | Ankara, Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
