'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Estilos' },
  { href: '/especiales', label: 'Especiales' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/login', label: 'Iniciar sesión' },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: mantener el foco dentro del panel cuando está abierto
  useEffect(() => {
    if (!isOpen) return;

    // Enfocar el botón de cierre al abrir
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Bloquear scroll del body cuando el nav está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        className={[
          'fixed inset-0 z-50 bg-on-surface/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Panel lateral derecho */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        onKeyDown={handleFocusTrap}
        className={[
          'fixed right-0 top-0 bottom-0 z-50 flex w-[85vw] max-w-sm flex-col',
          'bg-surface shadow-tonal-xl',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Cabecera del panel */}
        <div className="flex h-16 items-center justify-between px-6">
          <span className="font-serif text-lg font-semibold text-primary">MayuStudio</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            {/* Icono X */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Links de navegación */}
        <nav aria-label="Menú principal móvil" className="flex flex-1 flex-col overflow-y-auto">
          <ul className="flex flex-col" role="list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={[
                      'flex min-h-[48px] items-center px-6 py-3 font-serif text-base',
                      'border-b border-outline-variant/20 transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-on-surface hover:bg-surface-container hover:text-primary',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA Reservar — pegado al fondo */}
        <div className="px-6 pb-10 pt-6">
          <Button asChild variant="primary" className="w-full">
            <Link href="/reservar" onClick={onClose}>
              Reservar sesión
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
