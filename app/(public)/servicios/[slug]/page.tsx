import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getStyleBySlug, getStyleSlugs } from '@/lib/queries/services';
import { formatCurrency } from '@/lib/utils';

export async function generateStaticParams() {
  const styles = await getStyleSlugs();
  return styles.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const style = await getStyleBySlug(slug);
  if (!style) return { title: 'Estilo no encontrado' };
  return {
    title: style.name,
    description: style.shortDescription || style.description?.slice(0, 160),
  };
}

export default async function StyleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const style = await getStyleBySlug(slug);
  if (!style) notFound();

  const hasSets = style.type === 'SETS_AND_TIERS' && style.sets.length > 0;

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="px-4 md:px-8 max-w-screen-2xl mx-auto mb-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
          <Image
            src={style.coverImage || `https://picsum.photos/seed/${style.slug}/1600/700`}
            alt={style.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3f2b22]/50 to-transparent" />
          <div className="absolute inset-0 flex items-end px-6 md:px-16 pb-6 md:pb-12">
            <div>
              <h1 className="font-serif text-3xl md:text-6xl text-white mb-2">{style.name}</h1>
              {style.badge && (
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {style.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="px-4 md:px-8 max-w-screen-xl mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              {style.description}
            </p>
            {style.highlights.length > 0 && (
              <ul className="space-y-3">
                {style.highlights.map((h: string) => (
                  <li key={h} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-surface-container-low rounded-2xl p-8">
            {style.price !== null && (
              <div className="mb-4">
                <p className="text-sm text-on-surface-variant uppercase tracking-wider mb-1">Precio</p>
                <p className="font-serif text-3xl text-primary">{formatCurrency(style.price)}</p>
              </div>
            )}
            {style.duration && (
              <div className="mb-6">
                <p className="text-sm text-on-surface-variant uppercase tracking-wider mb-1">Duración</p>
                <p className="text-lg">{style.duration} minutos</p>
              </div>
            )}
            <Link
              href="/reservar"
              className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[48px] flex items-center justify-center active:scale-[0.98] w-full"
            >
              Reservar esta sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Sets (solo para estilos con sets, ej Cake Smash) */}
      {hasSets && (
        <section className="px-4 md:px-8 max-w-screen-xl mx-auto mb-16">
          <h2 className="font-serif text-2xl md:text-4xl mb-8">Sets disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {style.sets.map((set) => (
              <div key={set.slug} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={set.coverImage || `https://picsum.photos/seed/set-${set.slug}/600/450`}
                    alt={set.name}
                    fill
                    className="object-cover"
                  />
                  {set.isCustom && (
                    <span className="absolute top-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-semibold">
                      Personalizado
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl mb-2">{set.name}</h3>
                  <p className="text-on-surface-variant text-sm mb-4 leading-relaxed">{set.description}</p>
                  {set.isCustom ? (
                    <p className="font-serif text-2xl text-primary">{formatCurrency(set.customPrice!)}</p>
                  ) : (
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider">Standard</p>
                        <p className="font-serif text-lg text-primary">{formatCurrency(set.standardPrice)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider">Premium</p>
                        <p className="font-serif text-lg text-primary">{formatCurrency(set.premiumPrice)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Extras (ej: Minimalista) */}
      {style.extras.length > 0 && (
        <section className="px-4 md:px-8 max-w-screen-xl mx-auto mb-16">
          <h2 className="font-serif text-2xl md:text-4xl mb-8">Opcionales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {style.extras.map((extra) => (
              <div key={extra.id} className="bg-surface-container-low rounded-xl p-6 flex justify-between items-center">
                <span>{extra.name}</span>
                <span className="font-serif text-primary font-semibold">{formatCurrency(extra.price)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
