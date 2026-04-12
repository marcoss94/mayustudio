'use client';

/**
 * components/providers/session-provider.tsx — Client Component
 *
 * Wrapper de SessionProvider de Auth.js v5 (next-auth/react).
 * Necesario porque SessionProvider usa React Context (hooks),
 * lo que lo hace incompatible con Server Components.
 *
 * Al wrappear aquí y usarlo en app/layout.tsx (Server Component),
 * mantenemos el RootLayout como Server Component mientras todos los
 * Client Components descendientes tienen acceso a la sesión via useSession().
 *
 * Uso en Client Components hijos:
 * ```tsx
 * import { useSession } from 'next-auth/react';
 * const { data: session, status } = useSession();
 * ```
 */

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
