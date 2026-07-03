"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Service {
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

export default function HizmetlerimizPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient().from("services").select("*").eq("is_active", true).order("order")
      .then(({ data }) => { setServices(data || []); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );

  return (
    <div>
      <section className="bg-navy-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Hizmetler</p>
          <h1 className="text-4xl font-black text-white sm:text-5xl">Hizmetlerimiz</h1>
          <div className="section-divider mt-4" />
          <p className="mt-4 max-w-xl text-zinc-400">
            Hektapi olarak sunduğumuz mühendislik ve teknoloji hizmetleri.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {services.length === 0 ? (
          <p className="text-center text-zinc-400">Henüz hizmet eklenmemiş.</p>
        ) : (
          services.map((s, i) => (
            <div key={s.id} className={`grid grid-cols-1 gap-10 items-center ${s.media_type !== "none" ? "lg:grid-cols-2" : ""} ${i % 2 === 1 && s.media_type !== "none" ? "lg:grid-flow-dense" : ""}`}>
              <div className={i % 2 === 1 && s.media_type !== "none" ? "lg:col-start-2" : ""}>
                <h2 className="text-2xl font-black text-navy-950 sm:text-3xl">{s.title}</h2>
                {s.subtitle && <p className="mt-2 text-accent-dark font-semibold">{s.subtitle}</p>}
                {s.description && <p className="mt-4 leading-relaxed text-zinc-600">{s.description}</p>}
              </div>
              {s.media_type === "image" && s.media_url && (
                <div className="relative overflow-hidden rounded-2xl aspect-video">
                  <Image src={s.media_url} alt={s.title} fill className="object-cover" sizes="600px" />
                </div>
              )}
              {s.media_type === "youtube" && s.youtube_url && getYoutubeId(s.youtube_url) && (
                <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900" style={{ paddingBottom: "56.25%" }}>
                  <iframe style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(s.youtube_url)}?rel=0`}
                    title={s.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
