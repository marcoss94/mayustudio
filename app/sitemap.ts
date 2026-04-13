/**
 * app/sitemap.ts — Sitemap dinámico de MayuStudio
 *
 * Next.js genera /sitemap.xml automáticamente a partir de este archivo.
 * Incluye rutas estáticas con prioridades y rutas dinámicas por servicio.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { getStyleSlugs } from '@/lib/queries/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const now = new Date();

  // ── Rutas estáticas ───────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  // ── Rutas dinámicas: /servicios/[slug] ────────────────────────────────────
  let servicioRoutes: MetadataRoute.Sitemap = [];

  try {
    const slugs = await getStyleSlugs();
    servicioRoutes = slugs.map(({ slug }) => ({
      url: `${baseUrl}/servicios/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }));
  } catch {
    // Si la DB no está disponible en build time, continuar sin rutas dinámicas
  }

  return [...staticRoutes, ...servicioRoutes];
}
