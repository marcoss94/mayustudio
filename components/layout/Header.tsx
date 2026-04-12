'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/galeria', label: 'Galería' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="glass-nav">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-primary transition-opacity hover:opacity-80"
          >
            MayuStudio
          </Link>

          {/* Navegación desktop */}
          <nav aria-label="Navegación principal" className="hidden lg:flex">
            <ul className="flex items-center gap-1" role="list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={[
                        'label-caps rounded-lg px-4 py-2.5 transition-colors',
                        isActive
                          ? 'text-primary font-semibold'
                          : 'text-on-surface-variant hover:text-primary',
                      ].join(' ')}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              {/* CTA Reservar */}
              <li className="ml-4">
                <Link
                  href="/reservar"
                  className="btn-primary inline-flex min-h-[44px] items-center px-5 py-2.5 text-sm font-medium text-on-primary"
                >
                  Reservar
                </Link>
              </li>
            </ul>
          </nav>

          {/* Hamburger — solo visible en mobile (< lg) */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface lg:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* MobileNav — fuera del header para evitar z-index issues */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
