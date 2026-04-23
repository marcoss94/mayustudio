/**
 * lib/auth/index.ts — Full Auth.js config (Node runtime only)
 *
 * Importa PrismaClient + bcrypt. NO debe importarse desde Edge Runtime.
 *
 * Providers:
 * - Google OAuth (para clientes)
 * - Credentials (email + password con bcrypt para admins + clientes manuales)
 *
 * Exports:
 * - auth      → sesión en Server Components / Route Handlers
 * - handlers  → { GET, POST } para app/api/auth/[...nextauth]/route.ts
 * - signIn    → Server Action
 * - signOut   → Server Action
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/client';
import { authConfig } from './config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
});
