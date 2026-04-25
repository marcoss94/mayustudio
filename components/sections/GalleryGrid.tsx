'use client';

/**
 * GalleryGrid.tsx — Grid masonry con filtros + infinite scroll progresivo.
 *
 * - Render inicial: BATCH_SIZE imágenes
 * - Sentinel observado con IntersectionObserver carga el siguiente batch
 * - Animación fade+slide-up con stagger al aparecer
 * - Reset al cambiar filtro
 */

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { GalleryItem } from '@/components/ui/GalleryItem';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  styleSlug: string | null;
}

export interface GalleryService {
  slug: string;
  name: string;
}

export interface GalleryGridProps {
  images: GalleryImage[];
  services: GalleryService[];
  /** Cantidad de imágenes por batch. Default 12. */
  batchSize?: number;
}

const GALLERY_SIZES = '(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw';
const ALL_FILTER = '__all__';

export function GalleryGrid({ images, services, batchSize = 12 }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filteredImages = useMemo(
    () =>
      activeFilter === ALL_FILTER
        ? images
        : images.filter((img) => img.styleSlug === activeFilter),
    [images, activeFilter],
  );

  const visibleImages = useMemo(
    () => filteredImages.slice(0, visibleCount),
    [filteredImages, visibleCount],
  );

  const hasMore = visibleCount < filteredImages.length;

  // IntersectionObserver — carga siguiente batch cuando sentinel visible
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((c) => Math.min(c + batchSize, filteredImages.length));
        }
      },
      { rootMargin: '600px 0px' }, // pre-carga 600px antes
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, batchSize, filteredImages.length]);

  function handleFilterChange(slug: string) {
    startTransition(() => {
      setActiveFilter(slug);
      setVisibleCount(batchSize);
    });
  }

  const showFilters = services.length > 1;

  return (
    <div>
      {/* Filtros pills */}
      {showFilters && (
        <div
          role="tablist"
          aria-label="Filtrar galería por sesión"
          className={[
            'flex gap-2.5 overflow-x-auto pb-2',
            'snap-x snap-mandatory',
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          ].join(' ')}
        >
          <button
            role="tab"
            aria-selected={activeFilter === ALL_FILTER}
            onClick={() => handleFilterChange(ALL_FILTER)}
            className={cn(
              'snap-start shrink-0 rounded-full px-4 py-2.5 font-sans text-sm font-medium transition-all duration-200',
              'min-h-[40px] border',
              activeFilter === ALL_FILTER
                ? 'border-primary bg-primary text-on-primary'
                : 'border-[var(--color-outline)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-primary hover:text-primary',
            )}
          >
            Todas
          </button>

          {services.map((service) => (
            <button
              key={service.slug}
              role="tab"
              aria-selected={activeFilter === service.slug}
              onClick={() => handleFilterChange(service.slug)}
              className={cn(
                'snap-start shrink-0 rounded-full px-4 py-2.5 font-sans text-sm font-medium transition-all duration-200',
                'min-h-[40px] border',
                activeFilter === service.slug
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-[var(--color-outline)] bg-transparent text-[var(--color-on-surface-variant)] hover:border-primary hover:text-primary',
              )}
            >
              {service.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid uniforme — aspect-square, sin reflow al append */}
      <div
        className={cn(
          'mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6',
          isPending ? 'opacity-60' : 'opacity-100',
          'transition-opacity duration-200',
        )}
        aria-live="polite"
        aria-busy={isPending}
      >
        {visibleImages.length === 0 ? (
          <p className="col-span-full py-16 text-center font-sans text-base text-[var(--color-on-surface-variant)]">
            No hay imágenes en esta categoría todavía.
          </p>
        ) : (
          visibleImages.map((image, index) => {
            const inBatchIndex = index % batchSize;
            const isInitialBatch = index < batchSize;
            return (
              <div
                key={`${activeFilter}-${image.id}`}
                className="motion-safe:animate-gallery-in"
                style={{
                  animationDelay: `${inBatchIndex * 50}ms`,
                  animationFillMode: 'both',
                }}
              >
                <GalleryItem
                  image={{
                    url: image.url,
                    alt: image.alt,
                    caption: image.caption,
                  }}
                  sizes={GALLERY_SIZES}
                  priority={isInitialBatch && index < 4}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Sentinel + indicador loading */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-10 flex justify-center"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
            <span className="inline-block h-3 w-3 rounded-full bg-primary motion-safe:animate-pulse" />
            Cargando más fotos…
          </div>
        </div>
      )}

      {/* Counter footer cuando se ven todas */}
      {!hasMore && filteredImages.length > batchSize && (
        <p className="mt-10 text-center font-sans text-xs text-[var(--color-on-surface-variant)]">
          {filteredImages.length} fotos
        </p>
      )}
    </div>
  );
}

export default GalleryGrid;
