/**
 * types/auth.d.ts — Module augmentation para Auth.js v5
 *
 * Extiende los tipos de next-auth y next-auth/jwt para inyectar
 * los campos custom que agregamos en los callbacks de config.ts:
 * - role: UserRole (CLIENT | ADMIN | SUPERADMIN)
 * - id: string (cuid del usuario en DB)
 *
 * Esto permite usar session.user.role y session.user.id
 * con tipado correcto en Server Components y Client Components.
 */

import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null;
    id?: string | null;
  }
}
