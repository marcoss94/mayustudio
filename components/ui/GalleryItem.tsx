/**
 * GalleryItem.tsx — Ítem de galería para layouts masonry y grid
 *
 * Server Component. Sin interactividad en este componente.
 * El overlay hover (desktop) lo maneja CSS. El tap mobile lo maneja GalleryGrid.
 *
 * Design system "The Timeless Curator":
 * - rounded-lg (no borders, tonal layering)
 * - Sombra ambient: shadow-tonal-sm
 * - Overlay semi-transparente con caption
 * - break-inside: avoid para columnas CSS masonry
 */

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface GalleryItemImage {
  url: string;
  /** Alt text — OBLIGATORIO para accesibilidad. */
  alt: string;
  caption: string | null;
}

export interface GalleryItemProps {
  image: GalleryItemImage;
  /**
   * Sizes para next/image responsive.
   * @example "(max-width: 639px) 100vw, (max-width: 767px) 50vw, 33vw"
   */
  sizes: string;
  /** true para imágenes above-the-fold (loading="eager"). */
  priority?: boolean;
  className?: string;
}

export function GalleryItem({
  image,
  sizes,
  priority = false,
  className,
}: GalleryItemProps) {
  const { url, alt, caption } = image;

  return (
    /*
     * break-inside-avoid: evita que la imagen se corte entre columnas
     * en el layout masonry CSS columns.
     * display: inline-block necesario para que break-inside funcione en columnas.
     */
    <figure
      className={cn(
        'group relative aspect-square w-full',
        'rounded-lg overflow-hidden',
        'shadow-[var(--shadow-tonal-sm)]',
        'transition-shadow duration-300 hover:shadow-[var(--shadow-tonal-md)]',
        className,
      )}
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        priority={priority}
      />

      {/*
        Overlay con caption:
        - Desktop: visible solo en hover (opacity-0 group-hover:opacity-100)
        - Mobile: visible siempre cuando hay caption (usamos md: para mostrar solo en hover)
        La lógica "tap para mostrar" en mobile real la maneja GalleryGrid (Client Component).
      */}
      {caption && (
        <figcaption
          className={cn(
            // Posición: absoluto sobre la imagen, fondo en la mitad inferior
            'absolute bottom-0 inset-x-0 p-3',
            'bg-gradient-to-t from-[rgba(27,28,20,0.7)] to-transparent',
            // Mobile: siempre visible (pequeño, discreto)
            'opacity-100',
            // Desktop: solo en hover, más prominente
            'md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300',
          )}
        >
          <p className="font-sans text-xs text-[var(--color-inverse-on-surface)] leading-tight">
            {caption}
          </p>
        </figcaption>
      )}
    </figure>
  );
}

export default GalleryItem;
