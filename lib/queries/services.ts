/**
 * lib/queries/services.ts — Query helpers para servicios
 *
 * Server-only. NO importar en Client Components.
 * Usa React cache() para deduplicar queries dentro del mismo render tree.
 */

import { cache } from 'react';
import { prisma } from '@/lib/db/client';

/**
 * Todos los servicios activos y visibles, ordenados por categoría + creación.
 * Incluye categoría completa para agrupar en la página de servicios.
 * El precio se convierte de Decimal a number aquí para evitar problemas de serialización.
 */
export const getActiveServices = cache(async () => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true, isVisible: true },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        duration: true,
        coverImage: true,
        badge: true,
        highlights: true,
        minChildAge: true,
        maxChildAge: true,
        category: {
          select: { id: true, name: true, slug: true, order: true },
        },
      },
      orderBy: [{ category: { order: 'asc' } }, { createdAt: 'asc' }],
    });

    return services.map((s) => ({
      ...s,
      price: s.price.toNumber(),
    }));
  } catch {
    console.warn('[getActiveServices] DB not available, returning empty');
    return [];
  }
});

/**
 * Servicios destacados para la home.
 * Prioriza servicios con badge; si hay menos de `limit`, completa con los primeros visibles.
 */
export const getFeaturedServices = cache(async (limit = 3) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true, isVisible: true },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        duration: true,
        coverImage: true,
        badge: true,
        category: {
          select: { id: true, name: true, slug: true, order: true },
        },
      },
      orderBy: [{ category: { order: 'asc' } }, { createdAt: 'asc' }],
    });

    const withBadge = services.filter((s) => s.badge);
    const withoutBadge = services.filter((s) => !s.badge);
    const ordered = [...withBadge, ...withoutBadge].slice(0, limit);

    return ordered.map((s) => ({
      ...s,
      price: s.price.toNumber(),
    }));
  } catch {
    console.warn('[getFeaturedServices] DB not available, returning empty');
    return [];
  }
});

/**
 * Servicio individual por slug.
 * Retorna null si no existe o no está activo/visible.
 */
export const getServiceBySlug = cache(async (slug: string) => {
  try {
    const service = await prisma.service.findFirst({
      where: { slug, isActive: true, isVisible: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        duration: true,
        coverImage: true,
        images: true,
        badge: true,
        highlights: true,
        minChildAge: true,
        maxChildAge: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!service) return null;

    return {
      ...service,
      price: service.price.toNumber(),
    };
  } catch {
    console.warn('[getServiceBySlug] DB not available');
    return null;
  }
});

/**
 * Slugs y nombres de todos los servicios activos.
 * Usado en generateStaticParams y en selects de ContactForm.
 */
export const getServiceSlugs = cache(async () => {
  try {
    return await prisma.service.findMany({
      where: { isActive: true, isVisible: true },
      select: { slug: true, name: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch {
    console.warn('[getServiceSlugs] DB not available, returning empty');
    return [];
  }
});
