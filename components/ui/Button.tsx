/**
 * Button.tsx — Componente atómico de botón
 *
 * Server Component compatible (sin 'use client').
 * Soporta composición con next/link via prop `asChild`.
 *
 * Variantes:
 * - primary:         sólido marrón tierra, CTA principal
 * - gradient:        gradient primary→primary-container, CTA destacado
 * - outline:         blanco + borde primary-container, secundario estándar
 * - soft:            surface + borde sutil, tercera opción
 * - inverse:         fondo blanco, texto primary — para usar sobre fondos oscuros
 * - inverse-outline: transparente + borde blanco — secundario sobre fondos oscuros
 * - ghost:           sin fondo, hover tinte
 * - link:            solo texto subrayado
 *
 * Sizes:
 * - sm: chip / nav secundario
 * - md: default, CTAs normales (min-h-44)
 * - lg: hero CTAs, bigger padding (min-h-48)
 */

import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'gradient'
  | 'outline'
  | 'soft'
  | 'inverse'
  | 'inverse-outline'
  | 'ghost'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Usa el primer hijo como elemento raíz (útil para Link). */
  asChild?: boolean;
  isLoading?: boolean;
  /** Uppercase tracking-widest — para CTAs editoriales. */
  uppercase?: boolean;
  /** w-full mobile, auto desktop. */
  fullWidthMobile?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary shadow-[0_20px_40px_rgba(63,43,34,0.06)] hover:opacity-90 active:scale-[0.98]',
  gradient:
    'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-xl shadow-primary/10 hover:opacity-90 active:scale-[0.98]',
  outline:
    'bg-white text-primary border-2 border-primary-container shadow-[0_20px_40px_rgba(63,43,34,0.06)] hover:opacity-90 active:scale-[0.98]',
  soft:
    'bg-surface text-primary border border-outline-variant/20 hover:bg-surface-container-low active:scale-[0.98]',
  inverse:
    'bg-on-primary text-primary shadow-[0_20px_40px_rgba(63,43,34,0.12)] hover:opacity-90 active:scale-[0.98]',
  'inverse-outline':
    'bg-transparent border-2 border-on-primary text-on-primary hover:opacity-90 active:scale-[0.98]',
  ghost:
    'bg-transparent text-primary hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]',
  link:
    'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto min-h-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-1.5 min-h-[36px] rounded-full font-medium',
  md: 'text-sm px-6 md:px-7 py-2.5 md:py-3 min-h-[44px] rounded-full font-medium',
  lg: 'text-base px-8 md:px-10 py-3 md:py-3.5 min-h-[48px] rounded-full font-semibold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  isLoading = false,
  uppercase = false,
  fullWidthMobile = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-sans cursor-pointer select-none transition-all duration-300',
    variant !== 'link' && sizeClasses[size],
    variantClasses[variant],
    uppercase && 'uppercase tracking-widest',
    fullWidthMobile && 'w-full sm:w-auto',
    (disabled || isLoading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ className?: string }>,
      {
        className: cn(
          classes,
          (children as React.ReactElement<{ className?: string }>).props.className,
        ),
      },
    );
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
