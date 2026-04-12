/**
 * lib/auth/config.ts — Edge-safe Auth.js config
 *
 * IMPORTANTE: Este archivo NO puede importar PrismaClient ni nada
 * que use Node.js APIs exclusivas. Es importado por middleware.ts
 * que corre en Edge Runtime.
 *
 * Responsabilidades:
 * - Definir providers (Google + Credentials)
 * - Configurar páginas custom
 * - JWT callback: inyectar role e id en el token
 * - Session callback: exponer role e id en session.user
 */

import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const authConfig = {
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
        /**
         * La lógica de validación real (bcrypt + DB lookup) se implementa
         * en Phase 1 cuando se construya el flujo de login completo.
         *
         * En Phase 0 retornamos null para que el provider esté registrado
         * pero no acepte credenciales todavía.
         *
         * NOTA: authorize() corre en Node runtime (no edge), por lo que
         * aquí SÍ se puede importar prisma cuando se implemente.
         */
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Phase 1: implementar lookup + bcrypt.compare
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/registro',
  },

  callbacks: {
    /**
     * jwt — se ejecuta al crear/actualizar el token
     * Inyectamos role e id desde el user object (disponible solo en el
     * primer login) hacia el token para persistirlos en la cookie JWT.
     */
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    /**
     * session — se ejecuta al leer la sesión desde el cliente
     * Expone role e id (que están en el token JWT) en session.user
     * para que los Client Components puedan acceder a ellos.
     */
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
