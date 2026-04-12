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

const DEFAULT_BG = 'https://picsum.photos/seed/mayustudio-hero/1600/900';

export interface HeroCTA {
  label: string;
  href: string;
}

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimary: HeroCTA;
  ctaSecondary?: HeroCTA;
  backgroundImage?: string;
}

export function HeroSection({
  title,
  subtitle,
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
          <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-white/80 sm:text-lg lg:mt-6">
            {subtitle}
          </p>

          {/* CTAs: columna en mobile, fila en sm+ */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
            <Link
              href={ctaPrimary.href}
              className="btn-primary inline-flex min-h-[48px] items-center justify-center px-8 py-3 text-base font-medium text-on-primary"
            >
              {ctaPrimary.label}
            </Link>

            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
