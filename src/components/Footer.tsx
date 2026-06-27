import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">HEKTAPİ</h3>
          <p className="text-sm leading-relaxed">Endüstriyel test cihazları alanında güvenilir çözümler.</p>
          <div className="mt-4 flex gap-4">
            <a href="https://www.linkedin.com/company/hektapi̇-mühendi̇sli̇k-san-ve-ti̇c-ltd-şti̇/" target="_blank" rel="noreferrer"
              className="text-zinc-400 hover:text-accent text-sm font-semibold">LinkedIn</a>
            <a href="https://www.instagram.com/hektapi.muhendislik/" target="_blank" rel="noreferrer"
              className="text-zinc-400 hover:text-accent text-sm font-semibold">Instagram</a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">Hızlı Erişim</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Anasayfa"],
              ["/kurumsal/hakkimizda", "Hakkımızda"],
              ["/urunler", "Ürünler"],
              ["/hizmetlerimiz", "Hizmetlerimiz"],
              ["/cozumlerimiz", "Çözümlerimiz"],
              ["/iletisim", "İletişim"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-accent">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">İletişim</h3>
          <ul className="space-y-2 text-sm">
            <li>İvedik OSB 1462. Cadde No:24, Yenimahalle / ANKARA</li>
            <li><a href="tel:+905346111271" className="hover:text-accent">0534 611 12 71</a></li>
            <li><a href="mailto:info@hektapi.com.tr" className="hover:text-accent">info@hektapi.com.tr</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 py-4 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Hektapi. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
