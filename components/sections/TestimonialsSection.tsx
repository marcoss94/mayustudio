/**
 * TestimonialsSection.tsx — Sección de testimonios de clientes
 *
 * Server Component. Datos hardcoded Phase 1 (no hay CRUD de testimonios aún).
 *
 * Mobile: scroll horizontal con snap (carousel simple)
 * Desktop: grid de 3 columnas
 *
 * Tipografía:
 * - Cita: font-serif italic
 * - Nombre: font-sans font-semibold
 */

import { SectionHeader } from '@/components/ui/SectionHeader';

interface Testimonial {
  id: string;
  quote: string;
  name: string;
  sessionType: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'La sesión de Cake Smash de Valentina fue increíble. Mayu tiene una paciencia y ternura especiales con los bebés. Las fotos superaron todas nuestras expectativas — las tenemos enmarcadas en la sala.',
    name: 'Carolina R.',
    sessionType: 'Cake Smash',
  },
  {
    id: 't2',
    quote:
      'Elegimos la sesión Fine Art para el primer añito de Emilio y quedamos sin palabras. El resultado es arte puro. Mayu capturó exactamente lo que queríamos: esa mirada profunda y tierna que solo los bebés tienen.',
    name: 'Martina & Facundo',
    sessionType: 'Fine Art',
  },
  {
    id: 't3',
    quote:
      'Contratamos la Experiencia Completa y fue la mejor decisión. Tuvimos Cake Smash y Fine Art en el mismo día. Un lujo para los papás y una tarde mágica para nuestro Luca. Mil gracias, Mayu.',
    name: 'Sofía P.',
    sessionType: 'Experiencia Completa',
  },
  {
    id: 't4',
    quote:
      'El estudio es hermoso y acogedor. Sebastián (6 meses) estaba cómodo desde el primer momento. La sesión Minimalista quedó atemporal — esas fotos van a acompañarnos toda la vida.',
    name: 'Laura M.',
    sessionType: 'Minimalista',
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-label="Testimonios de clientes"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Lo Que Dicen las Familias"
          subtitle="Cada familia lleva consigo recuerdos que duran para siempre."
        />

        {/*
          Mobile: scroll horizontal con snap
          Desktop (md+): grid 3 columnas
        */}
        <div
          className={[
            'mt-12',
            // Mobile: flex horizontal scrolleable
            'flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory',
            // Desktop: grilla estática
            'md:grid md:grid-cols-2 md:overflow-visible md:pb-0 md:snap-none',
            'lg:grid-cols-4',
            // Ocultar scrollbar en webkit
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          ].join(' ')}
        >
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className={[
                'glass-card flex flex-col gap-4 p-6',
                // Mobile: ancho fijo para el carousel
                'min-w-[85vw] snap-start',
                // Tablet+: auto
                'sm:min-w-[70vw]',
                // Desktop: sin restricción de ancho
                'md:min-w-0',
              ].join(' ')}
            >
              {/* Icono de comilla decorativo */}
              <svg
                aria-hidden="true"
                width="28"
                height="20"
                viewBox="0 0 28 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary opacity-40"
              >
                <path
                  d="M0 20V12.667C0 9.244 0.822 6.4 2.467 4.133 4.155 1.822 6.489.356 9.467 0l1.2 2.267C8.4 3.022 6.8 4.156 5.733 5.667c-1.022 1.511-1.556 3.244-1.6 5.2H8v9.133H0zm16 0V12.667c0-3.423.822-6.267 2.467-8.534C20.155 1.822 22.489.356 25.467 0l1.2 2.267c-2.267.755-3.867 1.889-4.934 3.4-1.022 1.511-1.556 3.244-1.6 5.2H24v9.133H16z"
                  fill="currentColor"
                />
              </svg>

              {/* Cita en serif italic */}
              <blockquote className="font-serif text-base italic leading-relaxed text-on-surface">
                {t.quote}
              </blockquote>

              {/* Autor */}
              <footer className="mt-auto">
                <cite className="not-italic">
                  <span className="block font-sans text-sm font-semibold text-on-surface">
                    {t.name}
                  </span>
                  <span className="label-caps text-[var(--color-on-surface-variant)] opacity-80">
                    {t.sessionType}
                  </span>
                </cite>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
