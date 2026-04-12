/**
 * ClientLayout — Zona autenticada del cliente: reservar, mis reservas, perfil
 *
 * Requiere autenticación (protegido via middleware.ts).
 * Estructura: Header con nav de cliente + main + Footer.
 * Diferencia del PublicLayout: nav muestra acciones de usuario autenticado.
 */

import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header cliente — muestra acciones autenticadas */}
      <header className="glass-nav">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="font-serif text-xl font-semibold text-primary">
            MayuStudio
          </Link>

          {/* Navegación cliente autenticado */}
          <nav aria-label="Navegación de cliente">
            <ul className="flex items-center gap-6 list-none">
              <li>
                <a
                  href="/reservar"
                  className="label-caps text-on-surface-variant transition-colors hover:text-primary"
                >
                  Reservar
                </a>
              </li>
              <li>
                <a
                  href="/mis-reservas"
                  className="label-caps text-on-surface-variant transition-colors hover:text-primary"
                >
                  Mis reservas
                </a>
              </li>
              <li>
                <a
                  href="/perfil"
                  className="label-caps text-on-surface-variant transition-colors hover:text-primary"
                >
                  Mi perfil
                </a>
              </li>
              {/* Logout — se implementa en M5 con Auth.js */}
              <li>
                <button
                  type="button"
                  className="label-caps text-on-surface-variant transition-colors hover:text-error"
                  aria-label="Cerrar sesión"
                >
                  Salir
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Contenido con padding generoso */}
      <main className="flex-1 bg-surface-container-lowest">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-outline-variant/20 bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-on-surface-variant">
            © {new Date().getFullYear()} MayuStudio
          </p>
        </div>
      </footer>
    </div>
  );
}
