/**
 * lib/auth/index.ts — Full Auth.js config (Node runtime only)
 *
 * ADVERTENCIA: Este archivo importa PrismaClient via @auth/prisma-adapter.
 * NO debe ser importado desde middleware.ts ni ningún código de Edge Runtime.
 *
 * Para el middleware, usar lib/auth/config.ts (edge-safe).
 *
 * Exports:
 * - auth      → función para obtener la sesión en Server Components / Route Handlers
 * - handlers  → { GET, POST } para app/api/auth/[...nextauth]/route.ts
 * - signIn    → Server Action para iniciar sesión
 * - signOut   → Server Action para cerrar sesión
 */

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/client';
import { authConfig } from './config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
