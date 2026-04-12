/**
 * app/(public)/page.tsx — Página principal de MayuStudio
 *
 * Server Component. Compone todas las secciones del home.
 * Queries paralelas con Promise.all para mínima latencia.
 *
 * Secciones (top → bottom):
 *   HeroSection → FeaturedServices → GalleryPreview →
 *   TestimonialsSection → CTA final
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedServices } from '@/components/sections/FeaturedServices';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { websiteJsonLd, localBusinessJsonLd } from '@/lib/seo/json-ld';

/* ─── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'MayuStudio — Fotografía Infantil Boutique',
  description:
    'Estudio de fotografía infantil boutique en Argentina. Sesiones Cake Smash, Fine Art, minimalistas y experiencias completas. Capturamos la esencia de la infancia con una mirada editorial y delicada.',
  openGraph: {
    title: 'MayuStudio — Fotografía Infantil Boutique',
    description:
      'Capturamos la esencia de la infancia con una mirada editorial y delicada. Sesiones Cake Smash, Fine Art y más.',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'MayuStudio — Fotografía Infantil Boutique',
      },
    ],
  },
};

/* ─── Sección CTA Final ─────────────────────────────────────────────────────
   Componente interno — Server Component, sin lógica compleja.
─────────────────────────────────────────────────────────────────────────── */

function CtaFinal() {
  return (
    <section
      className="gradient-cta px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
      aria-label="Reservar sesión"
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-on-primary/70">
          El momento es ahora
        </p>

        <h2 className="font-serif text-3xl font-semibold leading-tight text-on-primary sm:text-4xl lg:text-5xl">
          Cada mirada cuenta una historia única.{' '}
          <span className="italic">Deja que la contemos por ti.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-on-primary/80 sm:text-lg">
          Estamos listos para capturar esos momentos fugaces que se convertirán
          en tus tesoros más preciados. Agendá tu sesión hoy.
        </p>

        {/* CTAs: columna mobile, fila sm+ */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/reservar"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-on-primary px-10 py-3 font-sans text-base font-semibold text-primary shadow-[0_4px_16px_rgba(27,28,20,0.2)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(27,28,20,0.25)] active:scale-[0.98] sm:w-auto"
          >
            Reservar sesión
          </Link>
          <Link
            href="/contacto"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-on-primary/50 px-10 py-3 font-sans text-base font-semibold text-on-primary transition-all duration-200 hover:border-on-primary hover:bg-on-primary/10 active:scale-[0.98] sm:w-auto"
          >
            Enviar consulta
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Sección "Cómo funciona" ───────────────────────────────────────────────
   3 pasos editoriales, inspirados en el diseño Stitch.
─────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: '01',
    title: 'Elegí tu sesión',
    description:
      'Explorá nuestras propuestas y encontrá la que mejor conecte con tu visión. Cada estilo tiene su propia magia.',
  },
  {
    number: '02',
    title: 'Personalizamos juntos',
    description:
      'Coordinamos paleta de colores, vestuario y detalles para una sesión completamente a medida.',
  },
  {
    number: '03',
    title: 'Reservá tu fecha',
    description:
      'Asegurá tu lugar en el calendario y prepárate para crear recuerdos que durarán toda la vida.',
  },
] as const;

function HowItWorks() {
  return (
    <section
      className="bg-surface-container-low px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      aria-label="Cómo funciona"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            El proceso
          </p>
          <h2 className="font-serif text-3xl font-semibold text-on-surface sm:text-4xl lg:text-[2.5rem]">
            Simple y sin complicaciones
          </h2>
        </div>

        {/* Grid de pasos — asimétrico en desktop */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {STEPS.map((step, i) => (
            <article
              key={step.number}
              className={[
                'surface-card p-8',
                // El paso del medio está elevado en desktop (grid asimétrico vertical)
                i === 1 ? 'md:-translate-y-4' : '',
              ].join(' ')}
            >
              {/* Número grande, decorativo */}
              <span
                aria-hidden="true"
                className="mb-6 block font-serif text-5xl font-semibold italic leading-none text-primary/20"
              >
                {step.number}
              </span>
              <h3 className="mb-3 font-serif text-xl font-semibold text-on-surface">
                {step.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-on-surface-variant">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function PublicHomePage() {
  return (
    <>
      {/* JSON-LD: WebSite + LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd()),
        }}
      />

      <main>
        {/* 1. Hero */}
        <HeroSection
          title="Capturando la esencia de la infancia"
          subtitle="Creamos recuerdos atemporales a través de una mirada editorial y delicada. Una experiencia artística diseñada para perdurar por generaciones."
          ctaPrimary={{ label: 'Ver sesiones', href: '/servicios' }}
          ctaSecondary={{ label: 'Reservar ahora', href: '/reservar' }}
          backgroundImage="https://picsum.photos/seed/mayustudio-hero-home/1600/900"
        />

        {/* 2. Servicios destacados */}
        <FeaturedServices />

        {/* 3. Cómo funciona */}
        <HowItWorks />

        {/* 4. Galería preview */}
        <GalleryPreview />

        {/* 5. Testimonios */}
        <TestimonialsSection />

        {/* 6. CTA final */}
        <CtaFinal />
      </main>
    </>
  );
}
