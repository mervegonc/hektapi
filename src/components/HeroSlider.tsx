"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Slide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  order: number;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    createClient()
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("order")
      .then(({ data }) => setSlides(data || []));
  }, []);

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = () => setCurrent(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-black px-4 py-28 text-center text-white">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold uppercase leading-tight tracking-wide sm:text-6xl">
          ÖNCE TEST ET,<br />SONRA GÜVEN,<br />
          <span className="text-accent">DAİMA KALİTEYİ SEÇ!</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-300">
          Hektapi ile en son test makinalarını ve teknik ürünleri keşfedin.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/urunler" className="rounded-md bg-accent px-7 py-3 font-bold text-navy-950 hover:bg-accent-dark transition-colors">
            Ürünleri İncele
          </Link>
          <Link href="/iletisim" className="rounded-md border border-white px-7 py-3 font-semibold hover:bg-white hover:text-navy-950 transition-colors">
            İletişime Geç
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "560px" }}>
      {/* Görseller */}
      {slides.map((s, i) => (
        <div key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={s.image_url}
            alt={s.title || "Slayt"}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          {/* Karartma katmanı */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* İçerik */}
      <div className="relative z-10 flex h-full items-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-xl text-white">
          {slide.title && (
            <h1 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl">
              {slide.title}
            </h1>
          )}
          {slide.subtitle && (
            <p className="mt-4 text-base text-zinc-200 sm:text-lg">{slide.subtitle}</p>
          )}
          {slide.button_text && slide.button_link && (
            <Link href={slide.button_link}
              className="mt-6 inline-block rounded-md bg-accent px-7 py-3 font-bold text-navy-950 hover:bg-accent-dark transition-colors">
              {slide.button_text}
            </Link>
          )}
        </div>
      </div>

      {/* Ok butonları */}
      {slides.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white hover:bg-black/60 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {/* Nokta indikatörleri */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-white/60"}`} />
          ))}
        </div>
      )}
    </section>
  );
}