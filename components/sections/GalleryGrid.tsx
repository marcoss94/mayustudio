'use client';

/**
 * GalleryGrid.tsx — Grid de galería con filtros por categoría
 *
 * Client Component — necesita estado para los filtros y animaciones.
 *
 * Layout masonry con CSS columns:
 * - Mobile: 2 columnas
 * - Tablet (sm): 2 columnas
 * - Desktop (lg): 3 columnas
 * - Desktop ancho (xl): 4 columnas
 *
 * Filtros: pills horizontales con scroll en mobile, sin re-fetch al filtrar.
 */

import { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { GalleryItem } from '@/components/ui/GalleryItem';

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  serviceSlug: string | null;
}

export interface GalleryService {
  slug: string;
  name: string;
}

export interface GalleryGridProps {
  images: GalleryImage[];
  services: GalleryService[];
}

const GALLERY_SIZES =
  '(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw';

const ALL_FILTER = '__all__';

export function GalleryGrid({ images, services }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);
  const [isPending, startTransition] = useTransition();

  const filteredImages =
    activeFilter === ALL_FILTER
      ? images
      : images.filter((img) => img.serviceSlug === activeFilter);

  function handleFilterChange(slug: string) {
    startTransition(() => {
      setActiveFilter(slug);
    });
  }

  // Solo mostrar filtros si hay más de una categoría
  const showFilters = services.length > 1;

  return (
    <div>
      {/* Filtros pills — scroll horizontal en mobile */}
      {showFilters && (
        <div
          role="tablist"
          aria-label="Filtrar galería por sesión"
          className={[
            'flex gap-2.5 overflow-x-auto pb-2',
            'snap-x snap-mandatory',
            // Ocultar scrollbar en webkit
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          ].join(' ')}
        >
          {/* Pill "Todas" */}
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

      {/* Grid masonry CSS columns */}
      <div
        className={cn(
          'mt-8 columns-2 gap-4 sm:gap-5 lg:columns-3 xl:columns-4 lg:gap-6',
          // Fade when transitioning
          isPending ? 'opacity-60' : 'opacity-100',
          'transition-opacity duration-200',
        )}
        aria-live="polite"
        aria-busy={isPending}
      >
        {filteredImages.length === 0 ? (
          <p className="col-span-full py-16 text-center font-sans text-base text-[var(--color-on-surface-variant)]">
            No hay imágenes en esta categoría todavía.
          </p>
        ) : (
          filteredImages.map((image, index) => (
            <div key={image.id} className="mb-4 sm:mb-5 lg:mb-6">
              <GalleryItem
                image={{
                  url: image.url,
                  alt: image.alt,
                  caption: image.caption,
                }}
                sizes={GALLERY_SIZES}
                priority={index < 4}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GalleryGrid;
