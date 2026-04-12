/**
 * SectionHeader.tsx — Encabezado de sección con título y subtítulo opcional
 *
 * Server Component. Sin interactividad.
 *
 * Tipografía:
 * - Título: Noto Serif (font-serif), display-sm en mobile → display-md en desktop
 * - Subtítulo: Inter (font-sans), text-on-surface-variant
 * - Divider: línea decorativa 48px en color primary
 */

import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Alineación del bloque. Default: 'center'. */
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const alignClasses: Record<NonNullable<SectionHeaderProps['align']>, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3', alignClasses[align], className)}>
      {/* Título serif — display-sm en mobile, display-md en lg */}
      <h2
        className={cn(
          'display-sm lg:display-md text-on-surface',
          // display-sm ya tiene font-serif vía la clase de globals.css,
          // pero lo reforzamos para evitar herencia de h1/h2 inesperada
          'font-serif',
        )}
      >
        {title}
      </h2>

      {/* Divider decorativo: 48px de ancho, color primary */}
      <span
        aria-hidden="true"
        className="block h-0.5 w-12 rounded-full bg-primary opacity-60"
      />

      {/* Subtítulo opcional */}
      {subtitle && (
        <p className="font-sans text-base text-[var(--color-on-surface-variant)] max-w-prose leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;
