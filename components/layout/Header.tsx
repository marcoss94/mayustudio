'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Estilos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(63,43,34,0.04)]">
        <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-2xl italic font-semibold text-[#3f2b22]"
          >
            MayuStudio
          </Link>

          {/* Nav desktop */}
          <div className="hidden md:flex items-center gap-8 font-serif text-lg tracking-tight">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors',
                    isActive
                      ? 'text-primary border-b border-primary pb-1'
                      : 'text-[#3f2b22] hover:text-primary',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              href="/login"
              className="hidden lg:block text-primary font-medium hover:opacity-80 transition-all duration-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/reservar"
              className="hidden md:flex bg-primary text-on-primary px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] active:scale-95 min-h-[44px] items-center"
            >
              Reservar sesión
            </Link>

            {/* Hamburger mobile */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={isMobileNavOpen}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#3f2b22] md:hidden"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
