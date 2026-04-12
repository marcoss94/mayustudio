/**
 * AdminLayout — Zona de administración: dashboard, reservas, servicios, clientes, pagos
 *
 * Requiere role ADMIN o SUPERADMIN (protegido via middleware.ts).
 * Estructura: Sidebar fijo (nav admin) + área principal (Topbar + main).
 * Design: sidebar con tonal layering oscuro (inverse-surface), main con surface.
 */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar — navegación administrativa */}
      <aside className="flex w-64 shrink-0 flex-col bg-inverse-surface">
        {/* Logo en sidebar */}
        <div className="flex h-16 items-center border-b border-white/10 px-6">
          <a
            href="/dashboard"
            className="font-serif text-lg font-semibold text-inverse-on-surface"
          >
            MayuStudio
          </a>
          <span className="ml-2 rounded bg-primary/30 px-1.5 py-0.5 text-xs font-medium text-inverse-on-surface">
            Admin
          </span>
        </div>

        {/* Navegación admin */}
        <nav aria-label="Navegación de administración" className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3 list-none">
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/admin/reservas', label: 'Reservas' },
              { href: '/admin/servicios', label: 'Servicios' },
              { href: '/admin/clientes', label: 'Clientes' },
              { href: '/admin/pagos', label: 'Pagos' },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-inverse-on-surface/70 transition-colors hover:bg-white/10 hover:text-inverse-on-surface"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-inverse-on-surface/70 transition-colors hover:bg-white/10 hover:text-inverse-on-surface"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/20 bg-surface px-6">
          <h1 className="font-serif text-lg font-medium text-on-surface">
            Panel de administración
          </h1>
          {/* User info — se completa en M5 con Auth.js session */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-container" aria-hidden="true" />
            <span className="text-sm font-medium text-on-surface-variant">Admin</span>
          </div>
        </header>

        {/* Contenido admin */}
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
