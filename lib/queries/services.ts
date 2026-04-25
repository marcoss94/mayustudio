/**
 * lib/queries/services.ts — Query helpers para estilos y sets
 *
 * Server-only. NO importar en Client Components.
 * Usa React cache() para deduplicar queries dentro del mismo render tree.
 */

import { cache } from 'react';
import { prisma } from '@/lib/db/client';
import type { StyleType } from '@prisma/client';

// ─── Tipos auxiliares ────────────────────────────────────────────────────────

export interface StyleSetDetail {
  id: string;
  styleId: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  standardPrice: number;
  premiumPrice: number;
  isCustom: boolean;
  customPrice: number | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StyleExtraDetail {
  id: string;
  styleId: string;
  name: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StyleDetail extends Omit<StyleSummary, 'type'> {
  type: StyleType;
  description: string | null;
  seasonStart: Date | null;
  seasonEnd: Date | null;
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
  tierStandardHighlights: string[];
  tierPremiumHighlights: string[];
  tierStandardDuration: number | null;
  tierPremiumDuration: number | null;
  tierStandardTagline: string | null;
  tierPremiumTagline: string | null;
  createdAt: Date;
  updatedAt: Date;
  sets: StyleSetDetail[];
  extras: StyleExtraDetail[];
}

// ─── Tipos de retorno ────────────────────────────────────────────────────────

export interface StyleSummary {
  id: string;
  name: string;
  slug: string;
  type: StyleType;
  shortDescription: string | null;
  price: number | null;
  duration: number | null;
  coverImage: string | null;
  badge: string | null;
  highlights: string[];
  label: string | null;
}

/**
 * Estilos activos y visibles (Cake Smash, Fine Art, Minimalista).
 * Excluye SEASONAL por defecto.
 */
export const getActiveStyles = cache(async (includeSeasonal = false): Promise<StyleSummary[]> => {
  try {
    const styles = await prisma.style.findMany({
      where: {
        isActive: true,
        isVisible: true,
        ...(includeSeasonal ? {} : { type: { not: 'SEASONAL' } }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        shortDescription: true,
        price: true,
        duration: true,
        coverImage: true,
        badge: true,
        highlights: true,
        label: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    const mapped = styles.map((s) => ({
      ...s,
      price: s.price?.toNumber() ?? null,
    }));
    return mapped;
  } catch {
    console.warn('[getActiveStyles] DB not available, returning empty');
    return [];
  }
});

/**
 * Estilos estacionales activos (dentro de su fecha).
 */
export const getSeasonalStyles = cache(async () => {
  try {
    const now = new Date();
    const styles = await prisma.style.findMany({
      where: {
        isActive: true,
        isVisible: true,
        type: 'SEASONAL',
        seasonStart: { lte: now },
        seasonEnd: { gte: now },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        coverImage: true,
        badge: true,
        seasonStart: true,
        seasonEnd: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    return styles.map((s) => ({
      ...s,
      price: s.price?.toNumber() ?? null,
    }));
  } catch {
    console.warn('[getSeasonalStyles] DB not available, returning empty');
    return [];
  }
});

/**
 * Estilo individual por slug con sets y extras.
 */
export const getStyleBySlug = cache(async (slug: string): Promise<StyleDetail | null> => {
  try {
    const style = await prisma.style.findFirst({
      where: { slug, isActive: true, isVisible: true },
      include: {
        sets: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        extras: {
          where: { isActive: true },
        },
      },
    });

    if (!style) return null;

    return {
      ...style,
      price: style.price?.toNumber() ?? null,
      sets: style.sets.map((s) => ({
        ...s,
        standardPrice: s.standardPrice.toNumber(),
        premiumPrice: s.premiumPrice.toNumber(),
        customPrice: s.customPrice?.toNumber() ?? null,
      })),
      extras: style.extras.map((e) => ({
        ...e,
        price: e.price.toNumber(),
      })),
    };
  } catch {
    console.warn('[getStyleBySlug] DB not available');
    return null;
  }
});

/**
 * Slugs de todos los estilos activos — para generateStaticParams.
 */
export const getStyleSlugs = cache(async (): Promise<{ slug: string; name: string }[]> => {
  try {
    return await prisma.style.findMany({
      where: { isActive: true, isVisible: true },
      select: { slug: true, name: true },
      orderBy: { displayOrder: 'asc' },
    });
  } catch {
    console.warn('[getStyleSlugs] DB not available, returning empty');
    return [];
  }
});

/**
 * Config de Experiencia Completa.
 */
export const getExperienciaCompletaConfig = cache(async () => {
  try {
    const config = await prisma.experienciaCompletaConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) return null;

    return {
      ...config,
      eventPrice3h: config.eventPrice3h.toNumber(),
      eventPrice4h: config.eventPrice4h.toNumber(),
      comboDiscount: config.comboDiscount.toNumber(),
    };
  } catch {
    console.warn('[getExperienciaCompletaConfig] DB not available');
    return null;
  }
});
