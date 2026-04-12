/**
 * proxy.ts — Auth.js v5 proxy (Edge Runtime)
 *
 * En Next.js 16, middleware.ts fue renombrado a proxy.ts.
 * La funcionalidad es idéntica; solo cambia el nombre del archivo y la convención.
 *
 * IMPORTANTE: Importa desde lib/auth/config.ts (edge-safe),
 * NO desde lib/auth/index.ts (que tiene PrismaAdapter y falla en edge).
 *
 * Protección de rutas:
 * - /reservar/*      → requiere autenticación (cualquier rol)
 * - /mis-reservas/*  → requiere autenticación (cualquier rol)
 * - /perfil/*        → requiere autenticación (cualquier rol)
 * - /admin/*         → requiere rol ADMIN o SUPERADMIN
 * - /dashboard/*     → requiere rol ADMIN o SUPERADMIN
 *
 * Rutas excluidas del matcher:
 * - /api/auth/*   → Auth.js handlers (no proteger)
 * - /_next/*      → assets de Next.js
 * - /favicon.ico  → asset estático
 * - archivos con extensión (imágenes, fonts, etc.)
 */

import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const pathname = nextUrl.pathname;

  // ─── Rutas de cliente — requiere auth ──────────────────────────────────
  const isClientRoute =
    pathname.startsWith('/reservar') ||
    pathname.startsWith('/mis-reservas') ||
    pathname.startsWith('/perfil');

  if (isClientRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // ─── Rutas de admin — requiere ADMIN o SUPERADMIN ──────────────────────
  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl.origin));
    }

    const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';
    if (!isAdmin) {
      // Usuario autenticado pero sin permisos → redirigir a home
      return Response.redirect(new URL('/', nextUrl.origin));
    }
  }
});

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas EXCEPTO:
     * - /api/auth/* → Auth.js handlers internos
     * - /_next/static, /_next/image → assets de Next.js
     * - /favicon.ico → icono del sitio
     * - archivos con extensión (*.png, *.jpg, *.svg, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\..*).*)',
  ],
};
