'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { LogOut, User as UserIcon, LayoutDashboard, Calendar } from 'lucide-react';

export interface UserMenuProps {
  session: Session;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }
  return email?.[0]?.toUpperCase() ?? '?';
}

export function UserMenu({ session }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = session.user;
  const role = user?.role;
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';
  const image = user?.image;
  const name = user?.name;
  const email = user?.email;
  const initials = getInitials(name, email);

  // Cerrar con click fuera o Escape
  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menú de usuario"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full p-1 hover:bg-surface-container transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
          {image ? (
            <Image
              src={image}
              alt={name ?? 'Avatar'}
              fill
              className="object-cover"
              sizes="36px"
            />
          ) : (
            <span className="text-sm font-semibold uppercase">{initials}</span>
          )}
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-[0_20px_40px_rgba(63,43,34,0.12)] overflow-hidden z-50"
        >
          {/* Header con info */}
          <div className="px-4 py-3 border-b border-outline-variant/20">
            <p className="font-medium text-on-surface text-sm truncate">
              {name ?? 'Usuario'}
            </p>
            {email && (
              <p className="text-xs text-on-surface-variant truncate">{email}</p>
            )}
          </div>

          {/* Links */}
          <nav className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" strokeWidth={1.75} />
                Panel admin
              </Link>
            )}
            <Link
              href="/perfil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <UserIcon className="w-4 h-4 text-primary" strokeWidth={1.75} />
              Perfil
            </Link>
            <Link
              href="/mis-reservas"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <Calendar className="w-4 h-4 text-primary" strokeWidth={1.75} />
              Mis reservas
            </Link>
          </nav>

          {/* Logout */}
          <div className="border-t border-outline-variant/20 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <LogOut className="w-4 h-4 text-error" strokeWidth={1.75} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
