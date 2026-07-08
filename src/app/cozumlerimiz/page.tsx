import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

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
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?\s]+)/);
  return match ? match[1] : null;
}

export default async function CozumlerimizPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("solutions").select("*").eq("is_active", true).order("order");
  const solutions: Solution[] = data || [];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {solutions.length === 0 ? (
          <p className="text-center text-zinc-500">Henüz çözüm eklenmemiş.</p>
        ) : (
          solutions.map((s, i) => (
            <div key={s.id} className={`grid grid-cols-1 gap-10 items-center ${s.media_type !== "none" ? "lg:grid-cols-2" : ""} ${i % 2 === 1 && s.media_type !== "none" ? "lg:grid-flow-dense" : ""}`}>
              <div className={i % 2 === 1 && s.media_type !== "none" ? "lg:col-start-2" : ""}>
                <h2 className="text-2xl font-black text-navy-950 sm:text-3xl">{s.title}</h2>
                {s.subtitle && <p className="mt-2 font-semibold text-accent-dark">{s.subtitle}</p>}
                {s.description && <p className="mt-4 leading-relaxed text-zinc-600">{s.description}</p>}
              </div>
              {s.media_type === "image" && s.media_url && (
                <div className="relative overflow-hidden rounded-2xl aspect-video">
                  <Image src={s.media_url} alt={s.title} fill className="object-cover" sizes="600px" loading="lazy" />
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
