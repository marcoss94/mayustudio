/**
 * lib/queries/gallery.ts — Query helpers para imágenes de galería
 *
 * Server-only. NO importar en Client Components.
 * Usa React cache() para deduplicar queries dentro del mismo render tree.
 */

import { cache } from 'react';
import { prisma } from '@/lib/db/client';

/**
 * Imágenes de galería visibles.
 * Si se pasa serviceSlug, filtra por ese servicio.
 * Ordenadas por el campo `order` ascendente.
 */
export const getGalleryImages = cache(async (serviceSlug?: string) => {
  try {
    return await prisma.galleryImage.findMany({
      where: {
        isVisible: true,
        ...(serviceSlug ? { serviceSlug } : {}),
      },
      select: {
        id: true,
        url: true,
        alt: true,
        caption: true,
        serviceSlug: true,
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
export const getGalleryCategories = cache(async () => {
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        isVisible: true,
        serviceSlug: { not: null },
      },
      select: { serviceSlug: true },
      distinct: ['serviceSlug'],
      orderBy: { serviceSlug: 'asc' },
    });

    return images
      .map((img) => img.serviceSlug)
      .filter((slug): slug is string => slug !== null);
  } catch {
    console.warn('[getGalleryCategories] DB not available, returning empty');
    return [];
  }
});
