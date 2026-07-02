"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Solution {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  media_type: "image" | "youtube" | "none";
  media_url: string | null;
  youtube_url: string | null;
  order: number;
}

function getYoutubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function CozumlerimizPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from("solutions")
      .select("*")
      .eq("is_active", true)
      .order("order")
      .then(({ data }) => { setSolutions(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex h-64 items-center justify-center text-zinc-400">Yükleniyor...</div>;

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-950 px-4 py-16 text-white text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Çözümlerimiz</h1>
        <p className="mt-3 text-zinc-300 max-w-xl mx-auto">
          Hektapi'nin geliştirdiği özel makine ve teknoloji çözümleri.
        </p>
      </section>

      {/* Çözümler */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {solutions.length === 0 ? (
          <p className="text-center text-zinc-400">Henüz çözüm eklenmemiş.</p>
        ) : (
          solutions.map((s, i) => (
            <div key={s.id} className={`grid grid-cols-1 gap-10 items-center ${s.media_type !== "none" ? "lg:grid-cols-2" : ""} ${i % 2 === 1 && s.media_type !== "none" ? "lg:grid-flow-dense" : ""}`}>
              {/* Metin */}
              <div className={i % 2 === 1 && s.media_type !== "none" ? "lg:col-start-2" : ""}>
                <h2 className="text-2xl font-bold text-navy-950 sm:text-3xl">{s.title}</h2>
                {s.subtitle && <p className="mt-2 text-accent-dark font-semibold">{s.subtitle}</p>}
                {s.description && <p className="mt-4 leading-relaxed text-zinc-600">{s.description}</p>}
              </div>

              {/* Görsel */}
              {s.media_type === "image" && s.media_url && (
                <div className="relative overflow-hidden rounded-xl aspect-video">
                  <Image src={s.media_url} alt={s.title} fill className="object-cover" sizes="600px" />
                </div>
              )}

              {/* YouTube */}
              {s.media_type === "youtube" && s.youtube_url && getYoutubeId(s.youtube_url) && (
               <div className="relative w-full overflow-hidden rounded-xl bg-zinc-900" style={{ paddingBottom: "56.25%" }}>
  <iframe
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    src={`https://www.youtube.com/embed/${getYoutubeId(s.youtube_url)}`}
                    title={s.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}