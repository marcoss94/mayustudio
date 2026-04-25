'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface BannerSpecial {
  slug: string;
  name: string;
  coverImage: string | null;
  badge: string | null;
}

export interface SpecialsBannerProps {
  specials: BannerSpecial[];
  autoplayMs?: number;
}

export function SpecialsBanner({ specials, autoplayMs = 6000 }: SpecialsBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (specials.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % specials.length);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [specials.length, paused, autoplayMs]);

  if (specials.length === 0) return null;

  const current = specials[index];
  if (!current) return null;

  const prev = () => setIndex((i) => (i - 1 + specials.length) % specials.length);
  const next = () => setIndex((i) => (i + 1) % specials.length);

  return (
    <section
      className="px-4 md:px-8 mb-8 max-w-screen-2xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[21/8] md:aspect-[35/7]">
        {specials.map((special, i) => (
          <Link
            key={special.slug}
            href={`/servicios/${special.slug}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={
                special.coverImage ||
                `https://picsum.photos/seed/${special.slug}/1600/400`
              }
              alt={special.name}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#3f2b22]/40 to-transparent" />
            <div className="absolute inset-0 flex items-center pl-16 pr-16 md:pl-20 md:pr-20">
              <div className="text-white">
                <p className="font-sans uppercase tracking-[0.3em] text-xs md:text-sm mb-2">
                  {special.badge || 'Especiales'}
                </p>
                <h3 className="font-serif text-3xl md:text-6xl mb-4">
                  {special.name}
                </h3>
                <div className="h-1 w-12 bg-white rounded-full" />
              </div>
            </div>
          </Link>
        ))}

        {/* Controles (solo si hay más de 1) */}
        {specials.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#3f2b22] hover:bg-white transition-all shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#3f2b22] hover:bg-white transition-all shadow-lg"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {specials.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a ${s.name}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? 'w-8 bg-white'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
