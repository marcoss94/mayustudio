/**
 * AuthLayout — Zona de autenticación: login, registro
 *
 * No requiere autenticación (páginas de entrada).
 * Estructura: fondo con textura terrosa, card glassmorphism centrada.
 * Layout minimal para no distraer del formulario.
 */

import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-surface px-4 py-12">
      {/* Fondo decorativo sutil — tonal layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      {/* Logo sobre el card */}
      <Link
        href="/"
        className="relative mb-8 font-serif text-2xl font-semibold text-primary"
      >
        MayuStudio
      </Link>

      {/* Card glassmorphism */}
      <div className="glass-card relative w-full max-w-md px-8 py-10">
        {children}
      </div>

      {/* Volver al inicio */}
      <p className="relative mt-6 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
