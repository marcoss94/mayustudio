/**
 * lib/queries/gallery.ts — Query helpers para imágenes de galería
 *
 * Server-only. NO importar en Client Components.
 * Usa React cache() para deduplicar queries dentro del mismo render tree.
 */

import { cache } from 'react';
import { prisma } from '@/lib/db/client';

export interface GalleryImageSummary {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  styleSlug: string | null;
  order: number;
}

/**
 * Imágenes de galería visibles.
 * Si se pasa styleSlug, filtra por ese servicio.
 * Ordenadas por el campo `order` ascendente.
 */
export const getGalleryImages = cache(async (styleSlug?: string): Promise<GalleryImageSummary[]> => {
  try {
    return await prisma.galleryImage.findMany({
      where: {
        isVisible: true,
        ...(styleSlug ? { styleSlug } : {}),
      },
      select: {
        id: true,
        url: true,
        alt: true,
        caption: true,
        styleSlug: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });
  } catch {
    console.warn('[getGalleryImages] DB not available, returning empty');
    return [];
  }
});

/**
 * Slugs únicos de servicios que tienen al menos una imagen visible.
 * Usado para los filtros de la galería.
 */
export const getGalleryCategories = cache(async (): Promise<string[]> => {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        isVisible: true,
        styleSlug: { not: null },
      },
      select: { styleSlug: true },
      distinct: ['styleSlug'],
      orderBy: { styleSlug: 'asc' },
    });

    return images
      .map((img) => img.styleSlug)
      .filter((slug): slug is string => slug !== null);
  } catch {
    console.warn('[getGalleryCategories] DB not available, returning empty');
    return [];
  }
});
