/**
 * GalleryPreview.tsx — Preview de galería para la home (6–8 imágenes)
 *
 * Server Component. Fetch directo desde Prisma via query helper.
 *
 * Layout masonry con CSS columns:
 * - Mobile: 2 columnas
 * - Desktop: 3–4 columnas
 */

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GalleryItem } from '@/components/ui/GalleryItem';
import { getGalleryImages } from '@/lib/queries/gallery';

const GALLERY_SIZES =
  '(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw';

export async function GalleryPreview() {
  const allImages = await getGalleryImages();
  // Limitar a 8 para el preview
  const images = allImages.slice(0, 8);

  return (
    <section
      className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-label="Preview de galería"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Momentos Capturados"
          subtitle="Una muestra del trabajo del estudio. Cada foto cuenta una historia única."
        />

        {images.length === 0 ? (
          <p className="mt-12 text-center font-sans text-base text-[var(--color-on-surface-variant)]">
            La galería estará disponible pronto.
          </p>
        ) : (
          <div className="mt-12 columns-2 gap-4 sm:gap-5 lg:columns-3 xl:columns-4 lg:gap-6">
            {images.map((image, index) => (
              <div key={image.id} className="mb-4 sm:mb-5 lg:mb-6">
                <GalleryItem
                  image={{
                    url: image.url,
                    alt: image.alt,
                    caption: image.caption,
                  }}
                  sizes={GALLERY_SIZES}
                  priority={index < 2}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/galeria"
            className="btn-primary inline-flex min-h-[44px] items-center justify-center px-8 py-3 text-base font-medium text-on-primary"
          >
            Ver galería completa
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;
