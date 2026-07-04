"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Standard {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  pdf_url: string | null;
  order: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  "ISO": "bg-blue-100 text-blue-800",
  "ASTM": "bg-green-100 text-green-800",
  "TS EN": "bg-purple-100 text-purple-800",
  "BS": "bg-orange-100 text-orange-800",
  "DIN": "bg-red-100 text-red-800",
};

export default function StandartlarPage() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from("standards")
      .select("*")
      .eq("is_active", true)
      .order("order")
      .then(({ data }) => { setStandards(data || []); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );

  return (
    <div>
      {/* Hero */}


      {/* Standart kartları */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {standards.length === 0 ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <span className="text-5xl">📋</span>
              <p className="mt-4 text-zinc-500">Henüz standart eklenmemiş.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {standards.map((std) => (
                <div key={std.id}
                  className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Üst kısım - ikon ve kategori */}
                  <div className="bg-gradient-to-br from-navy-950 to-navy-800 p-6 flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                      📄
                    </div>
                    {std.category && (
                      <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${CATEGORY_COLORS[std.category] || "bg-zinc-100 text-zinc-700"}`}>
                        {std.category}
                      </span>
                    )}
                  </div>

                  {/* Alt kısım - içerik */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-black text-navy-950 text-sm leading-tight">{std.title}</h3>
                    {std.description && (
                      <p className="mt-2 text-xs text-zinc-500 leading-relaxed flex-1">{std.description}</p>
                    )}

                    {std.pdf_url && (
                      <div className="mt-4 flex gap-2">
                        <a href={std.pdf_url} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-navy-950 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-navy-800">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round"/>
                            <path d="M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Görüntüle
                        </a>
                        <a href={std.pdf_url} download
                          className="flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-zinc-600 transition-all hover:border-accent hover:text-accent">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 15V3M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 20h18" strokeLinecap="round"/>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
