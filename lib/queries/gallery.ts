/**
 * lib/queries/gallery.ts — Query helpers para imágenes de galería
 *
 * Server-only. NO importar en Client Components.
 */

import { cache } from 'react';
import { prisma } from '@/lib/db/client';

export interface GalleryImageSummary {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  styleSlug: string | null;
  setSlug: string | null;
  order: number;
}

export interface GetGalleryImagesFilter {
  styleSlug?: string;
  setSlug?: string;
}

export const getGalleryImages = cache(
  async (filter: GetGalleryImagesFilter = {}): Promise<GalleryImageSummary[]> => {
    try {
      return await prisma.galleryImage.findMany({
        where: {
          isVisible: true,
          ...(filter.styleSlug ? { styleSlug: filter.styleSlug } : {}),
          ...(filter.setSlug ? { setSlug: filter.setSlug } : {}),
        },
        select: {
          id: true,
          url: true,
          alt: true,
          caption: true,
          styleSlug: true,
          setSlug: true,
          order: true,
        },
        orderBy: { order: 'asc' },
      });
    } catch {
      console.warn('[getGalleryImages] DB not available, returning empty');
      return [];
    }
  },
);

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
