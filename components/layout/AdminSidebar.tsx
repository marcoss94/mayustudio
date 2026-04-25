'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Image as ImageIcon,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/reservas', label: 'Reservas', icon: Calendar },
  { href: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { href: '/admin/galeria', label: 'Galería', icon: ImageIcon },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/pagos', label: 'Pagos', icon: CreditCard },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-baseline gap-2 font-serif text-lg italic text-inverse-on-surface"
        >
          MayuStudio
          <span className="rounded bg-inverse-primary/20 px-1.5 py-0.5 font-sans not-italic text-[10px] uppercase tracking-[0.15em] text-inverse-primary">
            Admin
          </span>
        </Link>
      </div>

      <nav aria-label="Navegación admin" className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3 list-none">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-white/10 text-inverse-on-surface'
                      : 'text-inverse-on-surface/65 hover:bg-white/8 hover:text-inverse-on-surface',
                  )}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-inverse-primary"
                    />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive
                        ? 'text-inverse-primary'
                        : 'text-inverse-on-surface/65 group-hover:text-inverse-on-surface',
                    )}
                    strokeWidth={1.75}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut({ callbackUrl: '/' });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-inverse-on-surface/65 transition-colors hover:bg-white/8 hover:text-inverse-on-surface"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-inverse-surface sticky top-0 h-dvh">
        <SidebarContent />
      </aside>

      {/* Mobile burger trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú admin"
        aria-expanded={mobileOpen}
        className="md:hidden fixed top-3 left-3 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-inverse-surface text-inverse-on-surface shadow-lg"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex w-72 max-w-[85vw] flex-col bg-inverse-surface shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-lg text-inverse-on-surface/65 hover:bg-white/10 hover:text-inverse-on-surface"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
