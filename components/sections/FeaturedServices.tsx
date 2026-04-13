/**
 * FeaturedServices.tsx — Grid de servicios destacados para la home
 *
 * Server Component. Fetch directo desde Prisma via query helper.
 *
 * Mobile-first:
 * - Mobile: 1 columna
 * - Tablet (sm): 2 columnas
 * - Desktop (lg): 3 columnas
 */

import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { getActiveStyles } from '@/lib/queries/services';

export async function FeaturedServices() {
  const services = await getActiveStyles();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-label="Servicios destacados">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Nuestras Sesiones"
          subtitle="Cada sesión es única, diseñada para capturar la personalidad y magia de tu bebé en este momento irrepetible."
        />

        {services.length === 0 ? (
          <p className="mt-12 text-center font-sans text-base text-[var(--color-on-surface-variant)]">
            Próximamente nuestros servicios disponibles.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/servicios"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 font-sans text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Ver todos los servicios
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
