/**
 * Badge.tsx — Etiqueta de estado / categoría
 *
 * Server Component. Sin interactividad.
 * Sigue las reglas "No-Line Rule": sin borders visibles, solo tonal layering.
 * Label style: uppercase, tracking-wide, text-xs (label-caps del design system).
 */

import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'default' | 'popular' | 'new' | 'seasonal';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  // default: superficie neutra
  default:
    'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]',
  // popular: terra cotta (secondary palette)
  popular:
    'bg-[var(--color-secondary-container)] text-[var(--color-on-surface)]',
  // new: sage green (tertiary palette)
  new: 'bg-[var(--color-tertiary-container)] text-[var(--color-on-primary)]',
  // seasonal: warm brown (primary palette)
  seasonal:
    'bg-[var(--color-primary-container)] text-[var(--color-on-primary)]',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        // Base
        'inline-flex items-center rounded-full px-2.5 py-1',
        // Label caps: Inter, uppercase, tracking-wide
        'label-caps',
        // Variante de color
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
