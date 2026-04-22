/**
 * Button.tsx — Componente atómico de botón
 *
 * Server Component compatible (sin 'use client').
 * Soporta composición con next/link via prop `asChild` (slot pattern manual).
 *
 * Design system "The Timeless Curator":
 * - primary:   gradient CTA (btn-primary), rounded-full
 * - secondary: terra cotta sólido
 * - ghost:     sin fondo, solo texto con hover
 * - outline:   border-ghost + texto primary
 * - link:      texto plano sin padding
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg';
  /**
   * Cuando es true, el Button delega el render al primer hijo.
   * Usar así: <Button asChild><Link href="/ruta">Texto</Link></Button>
   * El hijo recibe todas las clases CSS del Button.
   */
  asChild?: boolean;
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'btn-primary text-on-primary active:translate-y-0',
  secondary:
    'bg-secondary text-on-secondary rounded-full font-medium transition-all duration-200 hover:bg-secondary-light hover:shadow-[var(--shadow-tonal-lg)]',
  ghost:
    'bg-transparent text-primary rounded-full font-medium transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]',
  outline:
    'border-ghost bg-transparent text-primary rounded-full font-medium transition-all duration-200 hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline font-medium p-0 h-auto',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-1.5 min-h-[32px]',
  md: 'text-sm px-5 py-2 min-h-[40px]',
  lg: 'text-sm px-6 py-2.5 min-h-[44px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    // Base: inline-flex centrado
    'inline-flex items-center justify-center gap-2 font-sans font-medium cursor-pointer select-none',
    // No link: usa tamaños y radios estándar
    variant !== 'link' && sizeClasses[size],
    // Variante
    variantClasses[variant],
    // Estados
    (disabled || isLoading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    isLoading && 'relative',
    className,
  );

  // Slot pattern: clona el hijo inyectando las clases
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
    });
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
