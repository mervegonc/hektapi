import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/HeroSlider";
import type { Category } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: slidesData }] = await Promise.all([
    supabase.from("categories").select("*").order("order"),
    supabase.from("hero_slides").select("*").eq("is_active", true).order("order"),
  ]);

  const cats: Category[] = categories || [];
  const slides = slidesData || [];

  return (
    <div>
      <HeroSlider slides={slides} />

      {/* Stats bar */}
      <section className="bg-navy-950 border-b border-navy-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-navy-800 md:grid-cols-4">
            {[
              { value: "10+", label: "Yıllık Deneyim" },
              { value: "50+", label: "Tamamlanan Proje" },
              { value: `${cats.length}`, label: "Ürün Kategorisi" },
              { value: "100%", label: "Müşteri Memnuniyeti" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center">
                <p className="text-2xl font-black text-gold sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Ürün Portföyü</p>
            <h2 className="text-3xl font-black text-navy-950 sm:text-4xl">Ürün Kategorileri</h2>
            <div className="section-divider mx-auto mt-4" />
            <p className="mt-4 text-zinc-500">İhtiyacınıza uygun test cihazını kategoriye göre inceleyin.</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((cat) => (
              <Link key={cat.id} href={`/urunler/${cat.slug}`}
                className="premium-card group relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  {cat.image_url
                    ? <Image src={cat.image_url} alt={cat.name} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                    : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy-900 to-navy-800">
                        <span className="text-6xl opacity-20">⚗️</span>
                      </div>
                    )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-black text-white text-sm leading-tight">{cat.name}</h3>
                    {cat.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-300">{cat.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/urunler"
              className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 px-8 py-3 text-sm font-bold text-navy-950 transition-all hover:bg-navy-950 hover:text-white">
              Tüm Ürünleri Gör
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Neden Hektapi */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Fark Yaratan Değerler</p>
            <h2 className="text-3xl font-black text-navy-950 sm:text-4xl">Neden Hektapi?</h2>
            <div className="section-divider mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { num: "01", title: "Yüksek Hassasiyet", desc: "Tüm ürünlerimiz uluslararası standartlara uygun olarak tasarlanmış ve hassas ölçüm sonuçları için optimize edilmiştir." },
              { num: "02", title: "Sektör Deneyimi", desc: "20 yılı aşkın deneyimimizle endüstriyel test cihazları alanında güvenilir çözümler sunuyoruz." },
              { num: "03", title: "Teknik Destek", desc: "Satış sonrası teknik destek ve bakım hizmetlerimizle yanınızdayız. Uzman ekibimiz her zaman erişilebilir." },
              { num: "04", title: "Uluslararası Standartlar", desc: "TS, EN, ASTM, BS ve ISO standartlarına tam uyumluluk. Her ürün sertifikalı ve onaylı." },
              { num: "05", title: "Hızlı Teslimat", desc: "Stok yönetimimiz ve lojistik ağımız sayesinde en kısa sürede teslimat sağlıyoruz." },
              { num: "06", title: "Ar-Ge Odaklı", desc: "Sürekli Ar-Ge yatırımlarımızla teknolojinin ön saflarında yer alıyor, yenilikçi çözümler geliştiriyoruz." },
            ].map((item) => (
              <div key={item.num}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:border-accent/30 hover:bg-white hover:shadow-lg">
                <p className="mb-3 text-4xl font-black text-navy-950/10 group-hover:text-accent/20 transition-colors">{item.num}</p>
                <h3 className="mb-2 font-bold text-navy-950">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vizyon/Misyon */}
      <section className="relative overflow-hidden bg-navy-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Biz Kimiz</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Vizyon & Misyon</h2>
            <div className="section-divider mx-auto mt-4" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                  <span className="text-accent text-lg">👁</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Vizyonumuz</p>
              </div>
              <p className="leading-relaxed text-zinc-300">
                Mühendislik, danışmanlık ve Ar-Ge alanlarında öncü bir marka olarak, test cihazları sektöründe yenilikçi ve güvenilir çözümler sunmak. Teknolojik gelişmeleri yakından takip ederek, kalite ve hassasiyet konusunda sektörde referans noktası olmak.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                  <span className="text-accent text-lg">🎯</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Misyonumuz</p>
              </div>
              <p className="leading-relaxed text-zinc-300">
                Müşterilerimize mühendislik, danışmanlık ve Ar-Ge destekli, hassas ve güvenilir test cihazları sunarak kalite kontrol süreçlerini optimize etmek. Yenilikçi çözümler ve sürdürülebilir teknolojiler geliştirerek sektöre değer katmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">İletişim</p>
          <h2 className="text-3xl font-black text-navy-950 sm:text-4xl">
            Aradığınız ürünü<br />bulamadınız mı?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-500">
            Uzman ekibimiz ihtiyacınıza en uygun test cihazını birlikte belirlemenize yardımcı olacak.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/iletisim"
              className="inline-flex items-center gap-2 rounded-full bg-navy-950 px-8 py-4 font-bold text-white transition-all hover:bg-navy-800 hover:shadow-lg">
              İletişime Geçin
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/urunler"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-8 py-4 font-bold text-navy-950 transition-all hover:border-navy-950">
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
