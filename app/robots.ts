/**
 * app/robots.ts — Configuración de robots.txt para MayuStudio
 *
 * Next.js genera /robots.txt automáticamente a partir de este archivo.
 * Bloquea rutas privadas (admin, API, área de cliente) y apunta al sitemap.
 *
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/client/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
