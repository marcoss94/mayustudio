import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getSeasonalStyles } from '@/lib/queries/services';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Especiales y Estacionales',
  description:
    'Sesiones fotográficas de temporada. Día de las Madres, Navidad, Día del Niño y más. Ediciones limitadas en MayuStudio.',
};

export default async function EspecialesPage() {
  const specials = await getSeasonalStyles();

  return (
    <main className="pt-24">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-surface-container-low py-16 md:py-24 px-4 md:px-8">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(#d3c4ba 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block border border-outline-variant/60 text-primary mb-6 md:mb-8 rounded-full px-4 py-1 font-sans text-xs tracking-[0.2em] uppercase">
            Edición Limitada
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-on-background mb-6 md:mb-8 leading-tight tracking-tight">
            Especiales y{' '}
            <span className="italic font-normal">Estacionales</span>
          </h1>
          <p className="text-on-surface-variant text-base md:text-xl leading-relaxed max-w-2xl mx-auto">
            Sesiones únicas que celebran los momentos más especiales del año.
            Cada una tiene su propia temporada y su propio encanto.
          </p>
        </div>
      </section>

      {/* ─── Listado ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        {specials.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16">
            <h2 className="font-serif text-2xl md:text-3xl italic mb-4">
              Próximamente
            </h2>
            <p className="text-on-surface-variant mb-8">
              Por el momento no tenemos sesiones estacionales activas. Seguinos
              en redes para enterarte cuando abramos la próxima edición.
            </p>
            <Link
              href="/servicios"
              className="inline-flex bg-primary text-on-primary px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] items-center active:scale-[0.98]"
            >
              Ver estilos permanentes
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {specials.map((special) => (
              <Link
                key={special.slug}
                href={`/servicios/${special.slug}`}
                className="group block w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-sm"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 shadow-[0_20px_40px_rgba(63,43,34,0.06)] relative">
                  <Image
                    src={
                      special.coverImage ||
                      `https://picsum.photos/seed/${special.slug}/640/800`
                    }
                    alt={special.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {special.badge && (
                    <span className="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {special.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c14]/40 via-transparent to-transparent" />
                </div>
                <h3 className="font-serif text-2xl mb-2">{special.name}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-3">
                  {special.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  {special.price !== null && (
                    <span className="font-serif italic text-lg text-primary">
                      {formatCurrency(special.price)}
                    </span>
                  )}
                  {special.seasonEnd && (
                    <span className="text-xs text-on-surface-variant/70 uppercase tracking-wider">
                      Hasta{' '}
                      {new Date(special.seasonEnd).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      {specials.length > 0 && (
        <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
              No dejes pasar el momento
            </h2>
            <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
              Los especiales son de edición limitada. Reservá el tuyo antes de
              que termine la temporada.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/reservar"
                className="bg-on-primary text-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.12)] min-h-[44px] flex items-center active:scale-[0.98]"
              >
                Reservar ahora
              </Link>
              <Link
                href="/contacto"
                className="bg-transparent border-2 border-on-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 min-h-[44px] flex items-center active:scale-[0.98]"
              >
                Enviar consulta
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
