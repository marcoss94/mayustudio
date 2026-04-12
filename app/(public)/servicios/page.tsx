/**
 * /servicios — Listado de todos los servicios activos, agrupados por categoría.
 *
 * Server Component. Data fetching directo via query helper.
 * Layout asimétrico: mobile 1 col, tablet 2 col, desktop grid con variación.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveServices } from '@/lib/queries/services';
import { itemListJsonLd } from '@/lib/seo/json-ld';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Descubrí todas las sesiones de fotografía infantil de MayuStudio: Cake Smash, Fine Art, Minimalista, Especiales estacionales y la Experiencia Completa. Momentos únicos capturados con arte.',
  openGraph: {
    title: 'Servicios — MayuStudio',
    description:
      'Sesiones de fotografía infantil boutique: Cake Smash, Fine Art, Minimalista, Especiales y Experiencia Completa.',
    type: 'website',
  },
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ServiciosPage() {
  const services = await getActiveServices();

  // Agrupar por categoría manteniendo el orden del servidor
  const grouped = services.reduce<
    Record<string, { categoryName: string; categoryOrder: number; items: typeof services }>
  >((acc, service) => {
    const { id: categoryId, name: categoryName, order: categoryOrder } = service.category;
    if (!acc[categoryId]) {
      acc[categoryId] = { categoryName, categoryOrder, items: [] };
    }
    acc[categoryId].items.push(service);
    return acc;
  }, {});

  const sortedGroups = Object.values(grouped).sort(
    (a, b) => a.categoryOrder - b.categoryOrder,
  );

  // JSON-LD ItemList
  const jsonLd = itemListJsonLd(
    services.map((s) => ({ name: s.name, slug: s.slug })),
  );

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-[100dvh]">
        {/* ── Hero / Header ── */}
        <section className="bg-[var(--color-surface-container-low)] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              title="Nuestras Sesiones"
              subtitle="Cada servicio está diseñado para capturar la esencia única de tu pequeño. Explorá las opciones y encontrá la experiencia que mejor conecta con tu familia."
              align="center"
            />
          </div>
        </section>

        {/* ── Categorías con servicios ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
          {sortedGroups.length === 0 && (
            <div className="text-center py-24">
              <p className="font-sans text-[var(--color-on-surface-variant)] text-lg">
                Próximamente nuevas sesiones disponibles.
              </p>
              <Link
                href="/contacto"
                className="mt-6 inline-block label-caps text-primary underline underline-offset-4"
              >
                Consultanos directamente
              </Link>
            </div>
          )}

          {sortedGroups.map(({ categoryName, items }) => (
            <section key={categoryName} aria-labelledby={`cat-${categoryName}`}>
              {/* Heading de categoría */}
              <div className="mb-10 flex items-end gap-4">
                <h2
                  id={`cat-${categoryName}`}
                  className="font-serif text-2xl sm:text-3xl text-on-surface"
                >
                  {categoryName}
                </h2>
                <span
                  aria-hidden="true"
                  className="flex-1 h-px bg-[var(--color-outline-variant)] opacity-40 mb-1.5"
                />
              </div>

              {/*
               * Grid asimétrico por diseño:
               * - Mobile: 1 columna
               * - Tablet (sm): 2 columnas
               * - Desktop (lg): depende de cantidad de items
               *   - 1 item  → centrado, max-w-sm
               *   - 2 items → 2 columnas con cards anchos
               *   - 3+ items → primero grande (col-span-2) + resto normales, o 3 col estándar
               *
               * Para no tener 3 iguales en fila: el primer item de cada grupo recibe
               * énfasis visual diferente cuando hay múltiples items (featured).
               */}
              <ServiceGrid items={items} />
            </section>
          ))}
        </div>

        {/* ── CTA final ── */}
        <section className="gradient-cta py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--color-on-primary)] leading-tight">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="font-sans text-[var(--color-on-primary)] opacity-90 text-lg leading-relaxed">
              Creamos experiencias a medida. Contanos tu idea y la hacemos realidad.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 rounded-full bg-[var(--color-surface)] text-primary font-semibold text-sm tracking-wide transition-all duration-200 hover:bg-[var(--color-surface-container-low)] active:scale-[0.98]"
            >
              Consultanos
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

// ── ServiceGrid — layout asimétrico por cantidad ──────────────────────────────

type ServiceItem = Awaited<ReturnType<typeof getActiveServices>>[number];

function ServiceGrid({ items }: { items: ServiceItem[] }) {
  const count = items.length;

  // 1 item — centrado, card ancho
  if (count === 1) {
    return (
      <div className="flex justify-center">
        <div className="w-full sm:max-w-sm lg:max-w-md">
          <ServiceCard service={items[0]} priority />
        </div>
      </div>
    );
  }

  // 2 items — 2 columnas iguales, cards prominentes
  if (count === 2) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
        {items.map((item, i) => (
          <ServiceCard key={item.id} service={item} priority={i === 0} />
        ))}
      </div>
    );
  }

  // 3+ items — layout 2+1: primer item featured (más grande), resto en subgrid
  // Desktop: featured a la izquierda (60%), stack de 2 a la derecha (40%)
  // Tablet/Mobile: single column
  return (
    <div className="space-y-6">
      {/* Primera fila: featured grande + stack de hasta 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 items-start">
        {/* Featured — primer item */}
        <ServiceCard service={items[0]} priority />

        {/* Stack de los siguientes 1-2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {items.slice(1, 3).map((item) => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      </div>

      {/* Fila adicional para el resto (4+) — grid uniforme */}
      {items.length > 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.slice(3).map((item) => (
            <ServiceCard key={item.id} service={item} />
          ))}
        </div>
      )}
    </div>
  );
}
