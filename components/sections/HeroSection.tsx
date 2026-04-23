/**
 * HeroSection.tsx — Sección hero full-width con imagen de fondo y CTA
 *
 * Server Component. Sin interactividad.
 *
 * Mobile-first:
 * - Mobile: min-h-[85vh], texto compacto text-4xl, CTAs en columna
 * - Desktop: min-h-[90vh], texto display-lg, CTAs en fila
 */

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const DEFAULT_BG = 'https://picsum.photos/seed/mayustudio-hero/1600/900';

export interface HeroCTA {
  label: string;
  href: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaPrimary: HeroCTA;
  ctaSecondary?: HeroCTA;
  backgroundImage?: string;
}

export function HeroSection({
  title,
  subtitle,
  eyebrow,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
}: HeroSectionProps) {
  const bgSrc = backgroundImage ?? DEFAULT_BG;

  return (
    <section
      className="relative flex min-h-[85vh] items-end md:min-h-[90vh]"
      aria-label="Sección principal"
    >
      {/* Imagen de fondo */}
      <Image
        src={bgSrc}
        alt="MayuStudio — Fotografía infantil boutique"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay: de abajo hacia arriba para legibilidad del texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[rgba(27,28,20,0.80)] via-[rgba(27,28,20,0.35)] to-[rgba(27,28,20,0.10)]"
      />

      {/* Contenido */}
      <div className="relative w-full px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-3xl">
          {eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-accent">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-accent"
              />
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-4xl leading-[1.05] text-white sm:text-5xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-white/80 sm:text-lg lg:mt-6">
            {subtitle}
          </p>

          {/* CTAs: columna en mobile, fila en sm+ */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
            <Button asChild variant="primary">
              <Link href={ctaPrimary.href}>{ctaPrimary.label}</Link>
            </Button>

            {ctaSecondary && (
              <Button asChild variant="inverse-outline">
                <Link href={ctaSecondary.href}>{ctaSecondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
