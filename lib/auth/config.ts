/**
 * lib/auth/config.ts — Edge-safe Auth.js config
 *
 * Este archivo lo importa el middleware (proxy.ts) que corre en Edge Runtime.
 * NO puede importar PrismaClient, bcrypt, ni Node.js APIs.
 *
 * Providers con lógica que necesita Node (ej. Credentials con bcrypt/prisma)
 * se definen en lib/auth/index.ts. Esta config solo tiene:
 *   - pages (routing de login/error)
 *   - callbacks (jwt/session) — solo transformaciones puras
 */

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
