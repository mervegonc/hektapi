import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vizyon & Misyon",
  description: "Hektapi vizyon ve misyonu. Test cihazları sektöründe yenilikçi ve güvenilir çözümler sunma hedefimiz.",
  path: "/kurumsal/vizyon-misyon",
});

export default function VizyonMisyonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-10 text-3xl font-bold text-navy-950">Vizyon & Misyon</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-navy-900 p-8 text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Vizyonumuz</p>
          <p className="leading-relaxed text-zinc-300">
            Mühendislik, danışmanlık ve Ar-Ge alanlarında öncü bir marka olarak, test cihazları sektöründe yenilikçi ve güvenilir çözümler sunmak. Teknolojik gelişmeleri yakından takip ederek, kalite ve hassasiyet konusunda sektörde referans noktası olmak.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent-dark">Misyonumuz</p>
          <p className="leading-relaxed text-zinc-600">
            Müşterilerimize mühendislik, danışmanlık ve Ar-Ge destekli, hassas ve güvenilir test cihazları sunarak kalite kontrol süreçlerini optimize etmek. Yenilikçi çözümler ve sürdürülebilir teknolojiler geliştirerek sektöre değer katmak. Müşteri memnuniyetini en üst seviyeye çıkaracak, çevreye duyarlı ve ileri teknolojiye sahip ürünler üretmek.
          </p>
        </div>
      </div>
    </div>
  );
}
