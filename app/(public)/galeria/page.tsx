/**
 * app/(public)/galeria/page.tsx — Página de galería completa
 *
 * Server Component: queries paralelas → pasa datos a GalleryGrid (Client Component).
 */

import type { Metadata } from 'next';
import { getGalleryImages } from '@/lib/queries/gallery';
import { getServiceSlugs } from '@/lib/queries/services';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GalleryGrid } from '@/components/sections/GalleryGrid';

export const metadata: Metadata = {
  title: 'Galería',
  description:
    'Explorá nuestro portfolio de fotografía infantil boutique. Sesiones Cake Smash, Fine Art, Minimalista y más.',
  openGraph: {
    title: 'Galería — MayuStudio',
    description:
      'Explorá nuestro portfolio de fotografía infantil boutique. Sesiones Cake Smash, Fine Art, Minimalista y más.',
    type: 'website',
  },
};

export default async function GaleriaPage() {
  // Queries paralelas
  const [images, services] = await Promise.all([
    getGalleryImages(),
    getServiceSlugs(),
  ]);

  return (
    <main className="min-h-[100dvh]">
      {/* Hero / Header */}
      <section className="px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Galería"
            subtitle="Cada imagen es un momento irrepetible. Explorá nuestras sesiones y dejate inspirar."
            align="center"
          />
        </div>
      </section>

      {/* Galería con filtros */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {images.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-sans text-base text-[color:var(--color-on-surface-variant)]">
                La galería se está preparando. Volvé pronto.
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} services={services} />
          )}
        </div>
      </section>
    </main>
  );
}
