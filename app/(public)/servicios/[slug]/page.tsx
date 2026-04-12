/**
 * /servicios/[slug] — Página de detalle de un servicio.
 *
 * Server Component con generateStaticParams para pre-render estático.
 * Data fetching paralelo: servicio + imágenes de galería del servicio.
 *
 * Layout:
 * - Mobile: stack vertical (imagen → info → detalles → galería → CTA)
 * - Desktop (lg+): hero imagen full-width arriba, luego contenido en 2 cols
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServiceSlugs } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { serviceJsonLd } from '@/lib/seo/json-ld';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { GalleryItem } from '@/components/ui/GalleryItem';

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

// ── Metadata dinámica ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: 'Servicio no encontrado',
      description: 'La sesión que buscás no existe o ya no está disponible.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    title: service.name,
    description:
      service.shortDescription ??
      service.description ??
      `Sesión de fotografía infantil ${service.name} — MayuStudio`,
    openGraph: {
      title: `${service.name} — MayuStudio`,
      description:
        service.shortDescription ??
        service.description ??
        `Sesión ${service.name}`,
      type: 'website',
      images: service.coverImage
        ? [{ url: service.coverImage, alt: service.name }]
        : [`${baseUrl}/opengraph-image.png`],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMAGE = 'https://picsum.photos/seed/mayustudio-hero/1200/800';

function getBadgeVariant(text: string): 'default' | 'popular' | 'new' | 'seasonal' {
  const lower = text.toLowerCase();
  if (lower.includes('popular')) return 'popular';
  if (lower.includes('nuevo') || lower.includes('new')) return 'new';
  if (lower.includes('estacional') || lower.includes('seasonal')) return 'seasonal';
  return 'default';
}

function AgeRange({ min, max }: { min: number | null; max: number | null }) {
  if (min === null && max === null) return null;

  const formatAge = (months: number) => {
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (rem === 0) return years === 1 ? '1 año' : `${years} años`;
    return `${years} a ${years + 1} años`;
  };

  const label =
    min !== null && max !== null
      ? `${formatAge(min)} — ${formatAge(max)}`
      : min !== null
        ? `Desde ${formatAge(min)}`
        : `Hasta ${formatAge(max!)}`; // max !== null if we reach here

  return (
    <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)]">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default async function ServicioDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch paralelo: servicio + galería filtrada por slug
  const [service, galleryImages] = await Promise.all([
    getServiceBySlug(slug),
    getGalleryImages(slug),
  ]);

  if (!service) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const jsonLd = serviceJsonLd(service, baseUrl);

  const heroImage = service.coverImage ?? PLACEHOLDER_IMAGE;
  const reservarHref = `/reservar?servicio=${service.slug}`;

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-[100dvh]">
        {/* ── Hero imagen — full width, aspect variable ── */}
        <section className="relative w-full overflow-hidden" aria-hidden="false">
          {/* Mobile: aspect-[4/3], Desktop: aspect-[21/9] */}
          <div className="relative aspect-[4/3] lg:aspect-[21/9] w-full">
            <Image
              src={heroImage}
              alt={`Sesión ${service.name} — MayuStudio`}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay hacia abajo para transición suave */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(27,28,20,0.55)]"
            />

            {/* Breadcrumb sobre la imagen */}
            <nav
              aria-label="Navegación de ruta"
              className="absolute top-0 left-0 right-0 pt-6 px-4 sm:px-6 lg:px-8"
            >
              <ol className="flex items-center gap-2 text-xs text-[var(--color-inverse-on-surface)] opacity-80">
                <li>
                  <Link href="/" className="hover:opacity-100 transition-opacity">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/servicios" className="hover:opacity-100 transition-opacity">
                    Servicios
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="opacity-60">{service.name}</li>
              </ol>
            </nav>

            {/* Nombre del servicio sobre la imagen (desktop) — mobile lo muestra abajo */}
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-10 hidden lg:block">
              <div className="max-w-7xl mx-auto">
                {service.badge && (
                  <div className="mb-3">
                    <Badge variant={getBadgeVariant(service.badge)}>{service.badge}</Badge>
                  </div>
                )}
                <h1 className="font-serif text-4xl xl:text-5xl text-[var(--color-inverse-on-surface)] leading-tight">
                  {service.name}
                </h1>
                <p className="mt-2 text-lg text-[var(--color-inverse-on-surface)] opacity-80 max-w-xl">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contenido principal ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">

            {/* ── Columna izquierda: contenido editorial ── */}
            <div className="space-y-10 min-w-0">

              {/* Título mobile (oculto en desktop, ya aparece sobre la imagen) */}
              <div className="lg:hidden space-y-3">
                {service.badge && (
                  <Badge variant={getBadgeVariant(service.badge)}>{service.badge}</Badge>
                )}
                <h1 className="font-serif text-3xl sm:text-4xl text-on-surface leading-tight">
                  {service.name}
                </h1>
                {service.shortDescription && (
                  <p className="font-sans text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                    {service.shortDescription}
                  </p>
                )}
              </div>

              {/* Descripción completa */}
              {service.description && (
                <div className="prose prose-stone max-w-none">
                  <p className="font-sans text-base sm:text-lg text-[var(--color-on-surface-variant)] leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>
              )}

              {/* Highlights — lista de puntos clave */}
              {service.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-serif text-xl text-on-surface">
                    ¿Qué incluye?
                  </h2>
                  <ul className="space-y-3" role="list">
                    {service.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {/* Check decorativo */}
                        <span
                          aria-hidden="true"
                          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary-fixed)] flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="font-sans text-sm sm:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Galería del servicio */}
              {galleryImages.length > 0 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl text-on-surface">
                    Galería de la sesión
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {galleryImages.slice(0, 12).map((img, i) => (
                      <GalleryItem
                        key={img.id}
                        image={{ url: img.url, alt: img.alt, caption: img.caption }}
                        sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw"
                        priority={i < 4}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA mobile (sticky bottom en mobile se implementa con fixed, pero
                  para evitar layout issues usamos inline debajo del contenido) */}
              <div className="lg:hidden pt-4">
                <Link
                  href={reservarHref}
                  className="flex items-center justify-center w-full min-h-[52px] px-8 py-4 rounded-full gradient-cta text-[var(--color-on-primary)] font-semibold text-base tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-lg"
                >
                  Reservar esta sesión
                </Link>
              </div>
            </div>

            {/* ── Columna derecha: ficha técnica sticky (desktop) ── */}
            <aside
              className="lg:sticky lg:top-24 space-y-6"
              aria-label="Información de la sesión"
            >
              <div className="glass-card p-6 space-y-5">
                {/* Precio destacado */}
                <div className="space-y-1">
                  <p className="label-caps text-[var(--color-on-surface-variant)]">
                    Inversión
                  </p>
                  <p className="font-serif text-3xl text-primary font-semibold">
                    {formatCurrency(service.price)}
                  </p>
                </div>

                <hr className="border-[var(--color-outline-variant)] opacity-40" />

                {/* Detalles de la sesión */}
                <div className="space-y-3">
                  {/* Duración */}
                  <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      <strong className="text-on-surface font-medium">Duración:</strong>{' '}
                      {service.duration} minutos
                    </span>
                  </div>

                  {/* Categoría */}
                  <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span>
                      <strong className="text-on-surface font-medium">Tipo:</strong>{' '}
                      {service.category.name}
                    </span>
                  </div>

                  {/* Edad recomendada */}
                  <AgeRange min={service.minChildAge} max={service.maxChildAge} />
                </div>

                <hr className="border-[var(--color-outline-variant)] opacity-40" />

                {/* CTA desktop */}
                <Link
                  href={reservarHref}
                  className="flex items-center justify-center w-full min-h-[48px] px-6 py-3 rounded-full gradient-cta text-[var(--color-on-primary)] font-semibold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-md"
                >
                  Reservar esta sesión
                </Link>

                {/* Link secundario: contactar antes de reservar */}
                <Link
                  href={`/contacto?servicio=${service.slug}`}
                  className="flex items-center justify-center w-full min-h-[44px] px-6 py-3 rounded-full border border-[var(--color-outline-variant)] text-primary font-medium text-sm transition-all duration-200 hover:bg-[var(--color-surface-container-low)] active:scale-[0.98]"
                >
                  Hacer una consulta
                </Link>
              </div>

              {/* Nota de confianza */}
              <div className="text-center px-2">
                <p className="font-sans text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                  Coordinamos fecha y horario por WhatsApp o email.
                  Sin compromiso hasta confirmar la reserva.
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* ── CTA final — ver todos los servicios ── */}
        <section className="bg-[var(--color-surface-container-low)] py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface">
              Explorá todas nuestras sesiones
            </h2>
            <Link
              href="/servicios"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-full border border-[var(--color-outline-variant)] text-primary font-medium text-sm transition-all duration-200 hover:bg-[var(--color-surface-container)] active:scale-[0.98]"
            >
              Ver todos los servicios
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
