"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  order: number;
}

interface HeroSliderProps {
  slides: Slide[];
}

function isExternalLink(url: string) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent(c => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent(c => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-black px-4 py-28 text-center text-white" style={{ minHeight: "480px" }}>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold uppercase leading-tight tracking-wide sm:text-6xl">
            ÖNCE TEST ET,<br />SONRA GÜVEN,<br />
            <span className="text-accent">DAİMA KALİTEYİ SEÇ!</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-300">
            Hektapi ile en son test makinalarını ve teknik ürünleri keşfedin.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/urunler" className="rounded-full bg-accent px-7 py-3 font-bold text-navy-950">
              Ürünleri İncele
            </Link>
            <Link href="/iletisim" className="rounded-full border border-white px-7 py-3 font-semibold">
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current] ?? slides[0];

  return (
    <section className="relative w-full overflow-hidden bg-navy-950" style={{ height: "480px" }}>
      {/* Sadece aktif slide'ın resmi — tek resim, bellek dostu */}
      <div className="absolute inset-0">
        <Image
          key={slide.id}
          src={slide.image_url}
          alt={slide.title || "Slayt"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

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
            isExternalLink(slide.button_link) ? (
              <a href={slide.button_link} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-bold text-navy-950">
                {slide.button_text}
              </a>
            ) : (
              <Link href={slide.button_link}
                className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-bold text-navy-950">
                {slide.button_text}
              </Link>
            )
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Önceki slayt"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={next} aria-label="Sonraki slayt"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} aria-label={`Slayt ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
