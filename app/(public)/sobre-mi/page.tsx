/**
 * app/(public)/sobre-mi/page.tsx — Página "Sobre Mí / Sobre el Estudio"
 *
 * Server Component. Contenido editorial hardcoded (Phase 1).
 *
 * Layout mobile-first:
 *   - Mobile:  stack vertical — imagen arriba, texto abajo
 *   - Desktop: grid 2 columnas alternadas (imagen | texto, luego texto | imagen)
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

/* ─── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description:
    'Conocé a Mayu y la historia detrás del estudio de fotografía infantil. Una propuesta artística y delicada para capturar los momentos más preciados de la infancia.',
  openGraph: {
    title: 'Sobre Mí | MayuStudio',
    description:
      'Conocé a Mayu y la historia detrás del estudio de fotografía infantil.',
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

/* ─── Data ──────────────────────────────────────────────────────────────────
   Valores del estudio — lista editorial.
─────────────────────────────────────────────────────────────────────────── */

const VALORES = [
  {
    id: 'v1',
    title: 'Autenticidad',
    description:
      'Cada sesión refleja la personalidad única de tu hijo. No hay poses forzadas, solo momentos genuinos capturados con sensibilidad.',
  },
  {
    id: 'v2',
    title: 'Excelencia artística',
    description:
      'Cada imagen pasa por un proceso de edición cuidadosa. El resultado no es una foto — es una pieza de arte que merece ser enmarcada.',
  },
  {
    id: 'v3',
    title: 'Experiencia memorable',
    description:
      'Desde la consulta inicial hasta la entrega de las imágenes, cada paso está diseñado para que las familias se sientan acompañadas y tranquilas.',
  },
  {
    id: 'v4',
    title: 'Atemporalidad',
    description:
      'Evito tendencias pasajeras. El trabajo está pensado para que, en 20 años, las fotos sigan siendo tan hermosas como el día en que fueron tomadas.',
  },
] as const;

/* ─── Page ──────────────────────────────────────────────────────────────────
─────────────────────────────────────────────────────────────────────────── */

export default function SobreMiPage() {
  return (
    <main>
      {/* ── Hero editorial: imagen full-width con overlay ── */}
      <section
        className="relative min-h-[50vh] overflow-hidden bg-surface-container-highest md:min-h-[60vh]"
        aria-label="Presentación"
      >
        <Image
          src="https://picsum.photos/seed/mayustudio-sobre-hero/1600/700"
          alt="Mayu en su estudio de fotografía infantil"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Gradient: de abajo a arriba */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgba(27,28,20,0.75)] via-[rgba(27,28,20,0.30)] to-transparent"
        />
        {/* Texto sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-on-primary/70">
              El estudio
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Hola, soy Mayu
            </h1>
          </div>
        </div>
      </section>

      {/* ── Sección principal: historia + imagen de retrato ── */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        aria-label="Historia del estudio"
      >
        <div className="mx-auto max-w-7xl">
          {/*
            Mobile: stack vertical (imagen arriba, texto abajo)
            Desktop: grid 2 columnas — imagen izquierda, texto derecha
          */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Imagen de retrato */}
            <div className="relative w-full">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-tonal-xl)]">
                <Image
                  src="https://picsum.photos/seed/mayustudio-mayu-portrait/600/800"
                  alt="Retrato de Mayu, fotógrafa de MayuStudio"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              {/* Badge decorativo */}
              <div className="absolute -bottom-5 -right-2 glass-card px-5 py-3 sm:-right-5">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Desde 2018
                </p>
                <p className="font-serif text-sm font-semibold text-on-surface">
                  Fotografía infantil boutique
                </p>
              </div>
            </div>

            {/* Texto editorial */}
            <div className="pt-8 lg:pt-0">
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                La historia
              </p>
              <h2 className="mb-6 font-serif text-3xl font-semibold leading-tight text-on-surface sm:text-4xl">
                Un estudio creado desde el amor por la infancia
              </h2>
              <div className="space-y-5 font-sans text-base leading-relaxed text-on-surface-variant">
                <p>
                  Soy Mayu, fotógrafa especializada en fotografía infantil
                  boutique. Empecé este camino en 2018, movida por una
                  convicción simple pero poderosa: los primeros años de un niño
                  merecen ser capturados con la misma atención y cuidado
                  artístico que cualquier obra de arte.
                </p>
                <p>
                  Mi formación combina técnica fotográfica clásica con una
                  sensibilidad contemporánea. Me inspiran la pintura del
                  Renacimiento, la luz natural y, sobre todo, la autenticidad de
                  los momentos que suceden cuando los niños simplemente son
                  niños.
                </p>
                <p>
                  Cada sesión en mi estudio es una experiencia pensada tanto
                  para los pequeños como para sus familias. El objetivo no es
                  solo la foto perfecta — es que recuerden el día de la sesión
                  con una sonrisa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sección filosofía: texto izquierda, imagen derecha ── */}
      <section
        className="bg-surface-container-low px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        aria-label="Filosofía del estudio"
      >
        <div className="mx-auto max-w-7xl">
          {/*
            Mobile: stack vertical
            Desktop: grid 2 columnas — texto izquierda, imagen derecha
          */}
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Texto — orden primero en mobile, primero en desktop también */}
            <div>
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                La mirada
              </p>
              <h2 className="mb-6 font-serif text-3xl font-semibold leading-tight text-on-surface sm:text-4xl">
                Fotografía que trasciende el tiempo
              </h2>
              <div className="space-y-5 font-sans text-base leading-relaxed text-on-surface-variant">
                <p>
                  Creo en la fotografía como un acto de preservación. Cuando
                  encuadro una imagen, pienso en cómo se verá dentro de veinte
                  años. Por eso evito las tendencias pasajeras y elijo la luz,
                  la composición y el color de forma deliberada.
                </p>
                <p>
                  Mi estilo oscila entre lo editorial y lo documental. Trabajo
                  con luz natural siempre que es posible y con luz de estudio
                  cuando quiero esculpir algo más pictórico. El resultado es un
                  trabajo cohesivo, reconocible y, sobre todo, atemporal.
                </p>
              </div>
            </div>

            {/* Imagen — debajo en mobile, derecha en desktop */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-tonal-xl)] lg:aspect-[3/4]">
              <Image
                src="https://picsum.photos/seed/mayustudio-filosofia/600/800"
                alt="Sesión fotográfica en el estudio de MayuStudio"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Sección de valores ── */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        aria-label="Valores del estudio"
      >
        <div className="mx-auto max-w-7xl">
          {/* Header centrado */}
          <div className="mb-12 text-center">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Principios
            </p>
            <h2 className="font-serif text-3xl font-semibold text-on-surface sm:text-4xl">
              Lo que guía cada sesión
            </h2>
          </div>

          {/*
            Grid de valores:
            Mobile:  1 columna
            Tablet:  2 columnas
            Desktop: 4 columnas (asimétrico: las tarjetas pares van más abajo)
          */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALORES.map((valor, i) => (
              <article
                key={valor.id}
                className={[
                  'surface-card p-7',
                  // Alternancia vertical en desktop para grid asimétrico
                  i % 2 === 1 ? 'lg:translate-y-6' : '',
                ].join(' ')}
              >
                {/* Número decorativo */}
                <span
                  aria-hidden="true"
                  className="mb-4 block font-serif text-4xl font-semibold italic text-primary/20"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mb-3 font-serif text-lg font-semibold text-on-surface">
                  {valor.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-on-surface-variant">
                  {valor.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA: invitar a reservar o contactar ── */}
      <section
        className="bg-surface-container px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        aria-label="Contacto"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-semibold leading-tight text-on-surface sm:text-4xl">
            ¿Queres que capturemos juntos este momento?
          </h2>
          <p className="mb-10 font-sans text-base leading-relaxed text-on-surface-variant">
            Contame sobre tu bebé, la fecha que tenés en mente y el estilo que
            te imaginas. Me encantaría acompañarlos en esta experiencia.
          </p>

          {/* CTAs: columna mobile, fila sm+ */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contacto"
              className="btn-primary inline-flex min-h-[52px] w-full items-center justify-center px-10 py-3 font-sans text-base font-semibold text-on-primary active:scale-[0.98] sm:w-auto"
            >
              Contactarme
            </Link>
            <Link
              href="/servicios"
              className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-primary/30 px-10 py-3 font-sans text-base font-semibold text-primary transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98] sm:w-auto"
            >
              Ver sesiones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
