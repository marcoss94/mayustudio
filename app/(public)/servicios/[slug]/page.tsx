import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, CheckCircle2 } from 'lucide-react';
import { getStyleBySlug, getStyleSlugs } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';
import { FAQ, HowItWorks } from '@/components/sections';
import { Button } from '@/components/ui/Button';

const DEDICATED_PAGES = ['cake-smash', 'fine-art', 'minimalista'];

export async function generateStaticParams() {
  const styles = await getStyleSlugs();
  return styles
    .filter((s) => !DEDICATED_PAGES.includes(s.slug))
    .map((s) => ({ slug: s.slug }));
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

  if (DEDICATED_PAGES.includes(slug)) {
    redirect(`/servicios/${slug}`);
  }

  const [style, galleryImages] = await Promise.all([
    getStyleBySlug(slug),
    getGalleryImages({ styleSlug: slug }),
  ]);

  if (!style) notFound();

  const images = galleryImages.slice(0, 6);
  const isSeasonal = style.type === 'SEASONAL';

  return (
    <main className="pt-24">
      {/* ─── Hero split ────────────────────────────────────────────────── */}
      <section className="px-4 md:px-20 py-16 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            {style.label && (
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-4 block font-semibold">
                {style.label}
              </span>
            )}
            {style.badge && !style.label && (
              <span className="inline-block bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                {style.badge}
              </span>
            )}
            <h1 className="font-serif text-4xl md:text-7xl italic leading-tight text-primary mb-6">
              {style.name}
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl max-w-lg mb-10 leading-relaxed">
              {style.shortDescription || style.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="primary">
                <Link href="/reservar">Reservar {style.name}</Link>
              </Button>
              {images.length > 0 && (
                <Button asChild variant="outline">
                  <a href="#galeria">Ver galería</a>
                </Button>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-end">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-xs md:max-w-sm">
              <Image
                src={style.coverImage || `https://picsum.photos/seed/${style.slug}/600/750`}
                alt={style.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Descripción completa ──────────────────────────────────────── */}
      {style.description && style.description !== style.shortDescription && (
        <section className="bg-surface-container-low py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
              {style.description}
            </p>
          </div>
        </section>
      )}

      {/* ─── Galería ───────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto" id="galeria">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
              {isSeasonal ? 'Momentos capturados' : 'Galería'}
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Una muestra de lo que creamos en cada sesión.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={400}
                  height={500}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── La Experiencia (estilo Fine Art) ──────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface-container">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-1/2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">
              La Experiencia
            </span>
            <h2 className="font-serif text-3xl md:text-4xl italic mb-8">
              {isSeasonal
                ? 'Un momento que no se repite'
                : 'Una sesión con intención'}
            </h2>
            <ul className="space-y-10 md:space-y-12">
              {[
                {
                  n: '01',
                  title: 'Dirección de Arte',
                  desc: 'Coordinamos vestuario, accesorios y paleta de colores para que cada detalle sume al resultado final.',
                },
                {
                  n: '02',
                  title: 'Sesión Guiada',
                  desc: 'Trabajamos con luz natural controlada y ritmo tranquilo para capturar gestos auténticos sin forzar poses.',
                },
                {
                  n: '03',
                  title: 'Edición Cuidada',
                  desc: 'Post-producción manual fotografía por fotografía para preservar la emoción y el carácter de cada retrato.',
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-6">
                  <span className="text-3xl md:text-4xl font-serif italic text-outline-variant shrink-0">
                    {step.n}
                  </span>
                  <div>
                    <h4 className="font-bold text-on-surface mb-2">
                      {step.title}
                    </h4>
                    <p className="text-on-surface-variant leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-xs md:max-w-sm">
              <Image
                src={`https://picsum.photos/seed/${style.slug}-exp/500/625`}
                alt={`Experiencia ${style.name}`}
                width={500}
                height={625}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Paquete (estilo Fine Art) ─────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface">
        <div className="max-w-3xl mx-auto border border-outline-variant/20 rounded-3xl p-8 md:p-20 text-center bg-surface-container-lowest shadow-sm">
          <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-6 block">
            {isSeasonal ? 'Edición Limitada' : 'La Experiencia'}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-12">
            {style.name} Collection
          </h2>

          <div className="space-y-6 mb-12 text-left max-w-md mx-auto">
            {style.duration && (
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-on-surface-variant">
                  <strong className="text-on-surface">Duración:</strong>{' '}
                  {style.duration} minutos de sesión.
                </p>
              </div>
            )}
            {style.highlights.map((h: string) => (
              <div key={h} className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-on-surface-variant">{h}</p>
              </div>
            ))}
          </div>

          {style.price !== null && style.price !== undefined && (
            <div className="mb-12">
              <p className="font-serif italic text-4xl md:text-5xl text-primary">
                {formatCurrency(style.price)}
              </p>
              <p className="text-sm text-on-surface-variant/70 mt-2 font-sans uppercase tracking-widest">
                {isSeasonal ? 'Inversión de Temporada' : 'Inversión en Memoria'}
              </p>
            </div>
          )}

          <Button asChild variant="gradient" uppercase fullWidthMobile>
            <Link href="/reservar">
              {isSeasonal ? 'Solicitar Disponibilidad' : `Reservar ${style.name}`}
            </Link>
          </Button>

          {isSeasonal && style.seasonEnd && (
            <p className="mt-6 text-xs text-on-surface-variant/60 italic">
              Disponible hasta{' '}
              {new Date(style.seasonEnd).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>

      {/* ─── Cómo funciona ─────────────────────────────────────────────── */}
      <HowItWorks
        title="¿Cómo funciona?"
        steps={[
          { n: '1', title: 'Reservá', desc: 'Elegí tu fecha y confirmá con la seña online.' },
          { n: '2', title: 'Coordinamos', desc: 'Definimos detalles, vestuario y paleta de colores.' },
          { n: '3', title: 'Sesión', desc: 'Una experiencia tranquila y artística en el estudio.' },
          { n: '4', title: 'Entrega', desc: 'Recibís tu galería editada en formato digital.' },
        ]}
      />

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <FAQ
        items={[
          { q: '¿Con cuánta antelación debo reservar?', a: 'Recomendamos reservar con al menos 4 a 6 semanas de antelación, especialmente para sesiones de temporada.' },
          { q: '¿Qué debo llevar?', a: 'Nosotros proporcionamos vestuario y accesorios. Si preferís usar prendas propias, te asesoramos para que armonicen con la estética.' },
          { q: '¿Cómo recibiré las fotografías?', a: 'Recibirás una galería online privada con las fotos editadas, entre 10 y 15 días hábiles después de la sesión.' },
        ]}
      />

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
            {isSeasonal ? 'No dejes pasar esta temporada' : 'Capturemos tu historia'}
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            {isSeasonal
              ? 'Las sesiones estacionales son únicas y los cupos son limitados. Reservá el tuyo hoy.'
              : 'Cada sesión es un momento único. Reservá la tuya y creemos algo memorable juntos.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild variant="inverse">
              <Link href="/reservar">Reservar ahora</Link>
            </Button>
            <Button asChild variant="inverse-outline">
              <Link href="/contacto">Enviar consulta</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
