export default function CozumlerimizPage() {
  const solutions = [
    {
      id: "hp-q1000",
      name: "HP-Q1000 Kutu Karekodlama Makinası",
      videoId: "Bocuv7H8Je4",
      description: "İçerik yakında eklenecek.",
    },
    {
      id: "hp-q2000",
      name: "HP-Q2000 Şişe Karekodlama Makinası",
      videoId: "TrnLCFsN5i8",
      description: "İçerik yakında eklenecek.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold text-navy-950">Çözümlerimiz</h1>
      <p className="mb-12 text-zinc-500">Hektapi'nin geliştirdiği özel makine çözümleri.</p>
      <div className="space-y-16">
        {solutions.map((s) => (
          <div key={s.id}>
            <h2 className="mb-4 text-2xl font-bold text-navy-950">{s.name}</h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-900">
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${s.videoId}`}
                title={s.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
            <p className="mt-4 text-zinc-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
