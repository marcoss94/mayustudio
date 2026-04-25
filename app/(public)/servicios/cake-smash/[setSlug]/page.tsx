import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Palette, Sparkles, Check, X } from 'lucide-react';
import { getStyleBySlug } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';
import { FAQ, HowItWorks } from '@/components/sections';
import { CustomSetForm } from './CustomSetForm';
import { Button } from '@/components/ui/Button';

export async function generateStaticParams() {
  const style = await getStyleBySlug('cake-smash');
  if (!style) return [];
  return style.sets
    .filter((s) => s.isActive)
    .map((s) => ({ setSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setSlug: string }>;
}): Promise<Metadata> {
  const { setSlug } = await params;
  const style = await getStyleBySlug('cake-smash');
  const set = style?.sets.find((s) => s.slug === setSlug && s.isActive);
  if (!set) return { title: 'Set no encontrado' };
  return {
    title: `${set.name} — Cake Smash`,
    description: set.description ?? undefined,
  };
}

export default async function SetDetailPage({
  params,
}: {
  params: Promise<{ setSlug: string }>;
}) {
  const { setSlug } = await params;
  const style = await getStyleBySlug('cake-smash');
  if (!style) notFound();

  const set = style.sets.find((s) => s.slug === setSlug && s.isActive);
  if (!set) notFound();

  // Breadcrumb común
  const breadcrumb = (
    <div className="px-4 md:px-8 max-w-screen-2xl mx-auto pt-6">
      <Link
        href="/servicios/cake-smash"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
        Cake Smash
      </Link>
    </div>
  );

  // ─── Set personalizado ─────────────────────────────────────────────
  if (set.isCustom) {
    return (
      <main className="relative">
        {/* Grain/dot texture global */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#3f2b22 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
          aria-hidden="true"
        />

        <div className="relative">
          {/* Hero — imagen fullwidth + glass card */}
          <section className="relative w-full h-[600px] md:h-[720px] flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={set.coverImage || `https://picsum.photos/seed/${set.slug}-hero/1920/1080`}
                alt={set.name}
                fill
                className="object-cover brightness-75"
                priority
              />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12">
              <div className="max-w-2xl bg-surface/40 backdrop-blur-md p-6 md:p-10 rounded-xl border border-outline-variant/10">
                <Link
                  href="/servicios/cake-smash"
                  className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors mb-4"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  Cake Smash
                </Link>
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
                  Tu idea, tu set
                </p>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-on-surface leading-tight mb-6">
                  {set.name}
                </h1>
                <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
                  {set.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="primary">
                    <a href="#formulario">Contar mi idea</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo funciona */}
          <HowItWorks
            title="¿Cómo funciona?"
            steps={[
              { n: '1', title: 'Describí', desc: 'Contanos en detalle lo que imaginás para el set.' },
              { n: '2', title: 'Pagás', desc: 'Confirmás con el pago completo del set personalizado.' },
              { n: '3', title: 'Coordinamos', desc: 'Nos pondremos en contacto para pulir los detalles.' },
              { n: '4', title: 'Sesión', desc: 'Disfrutamos la sesión con tu set único creado a medida.' },
            ]}
          />

          {/* Precio + Form */}
          <section id="formulario" className="py-20 md:py-32 px-4 md:px-8 bg-surface">
            <div className="max-w-3xl mx-auto border border-outline-variant/20 rounded-3xl p-8 md:p-16 bg-surface-container-lowest shadow-sm">
              <div className="text-center mb-12">
                <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-6 block">
                  Precio fijo único
                </span>
                <p className="font-serif italic text-4xl md:text-5xl text-primary">
                  {formatCurrency(set.customPrice!)}
                </p>
                <p className="text-sm text-on-surface-variant/70 mt-2 font-sans uppercase tracking-widest">
                  Tu set, tu visión
                </p>
              </div>

              <CustomSetForm setSlug={set.slug} price={set.customPrice!} />
            </div>
          </section>

          {/* FAQ propio */}
          <FAQ
            items={[
              { q: '¿Qué nivel de detalle necesitan?', a: 'Cuanto más específica sea tu visión, mejor. Mencioná colores, temática, elementos que te inspiran, referencias visuales si las tenés, y cualquier objeto o detalle importante.' },
              { q: '¿Qué pasa si mi idea no es viable?', a: 'Si detectamos algún problema técnico o logístico, te contactamos para ajustar la propuesta antes de empezar. Siempre buscamos respetar tu visión original.' },
              { q: '¿Puedo modificar el pedido después de pagar?', a: 'Hasta 2 semanas antes de la sesión podés hacer ajustes menores. Cambios mayores pueden implicar costos adicionales o reprogramación.' },
              { q: '¿Incluye lo mismo que los sets temáticos?', a: 'Sí, el set personalizado incluye pastel artesanal, decoración completa, vestuario y 30 fotos editadas. La diferencia es que la temática la definís vos.' },
            ]}
          />

          {/* CTA final */}
          <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
                Contanos tu idea
              </h2>
              <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
                No hay ideas malas. Cuanto más detalle nos des, mejor podremos
                hacerlo realidad.
              </p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // ─── Set regular (Standard + Premium) ──────────────────────────────
  const galleryImages = await getGalleryImages({
    styleSlug: 'cake-smash',
    setSlug,
  });
  const images = galleryImages.slice(0, 6);
  const standardHighlights = style.tierStandardHighlights ?? [];
  const premiumHighlights = style.tierPremiumHighlights ?? [];
  const customSet = style.sets.find((s) => s.isCustom && s.isActive);

  return (
    <main>
      {/* Hero — imagen fullwidth + glass card */}
      <section className="relative w-full h-[600px] md:h-[720px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={set.coverImage || `https://picsum.photos/seed/${set.slug}-hero/1920/1080`}
            alt={set.name}
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12">
          <div className="max-w-2xl bg-surface/40 backdrop-blur-md p-6 md:p-10 rounded-xl border border-outline-variant/10">
            <Link
              href="/servicios/cake-smash"
              className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              Cake Smash
            </Link>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary font-semibold mb-4">
              Set Exclusivo de Cake Smash
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-on-surface leading-tight mb-6">
              {set.name}
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
              {set.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="primary">
                <a href="#paquetes">Ver paquetes</a>
              </Button>
              {images.length > 0 && (
                <Button asChild variant="outline">
                  <a href="#galeria">Ver galería</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Introductory quote */}
      <section className="bg-surface-container-low py-20 md:py-24 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-4xl text-primary-container mb-6 italic">
            &ldquo;Donde la curiosidad se encuentra con el diseño atemporal.&rdquo;
          </h2>
          <p className="text-on-surface-variant leading-loose text-base md:text-lg">
            Nuestra visión para el set de {set.name} no es solo un fondo, es una
            experiencia táctil. Cada detalle está curado para que el foco siga
            siendo la expresión pura de tu pequeño.
          </p>
        </div>
      </section>

      {/* Galería del set */}
      {images.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto" id="galeria">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
              Momentos en el set {set.name}
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Una muestra de sesiones realizadas con este set temático.
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

      {/* Paquetes Standard vs Premium — estilo Fine Art */}
      <section id="paquetes" className="py-20 md:py-32 px-4 md:px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-serif text-3xl md:text-5xl text-on-surface mb-4">
              Eleva tu aventura
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              Dos formas de vivir la experiencia &ldquo;{set.name}&rdquo;,
              diseñadas para adaptarse a tu visión.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
            {/* Standard */}
            <div className="border border-outline-variant/20 rounded-3xl p-8 md:p-12 text-center bg-surface-container-lowest shadow-sm flex flex-col">
              <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-4 block">
                Colección Standard
              </span>
              {style.tierStandardTagline && (
                <h3 className="font-serif text-2xl md:text-3xl text-primary mb-10 italic">
                  {style.tierStandardTagline}
                </h3>
              )}
              <ul className="space-y-4 mb-10 flex-1 text-left max-w-sm mx-auto w-full">
                {style.tierStandardDuration && (
                  <li className="flex items-center gap-3 text-on-surface-variant">
                    <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    {style.tierStandardDuration} minutos de sesión
                  </li>
                )}
                {standardHighlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-on-surface-variant">
                    <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mb-8">
                <p className="font-serif italic text-3xl md:text-4xl text-primary">
                  {formatCurrency(set.standardPrice)}
                </p>
              </div>
              <Button asChild variant="outline" uppercase fullWidthMobile className="mx-auto">
                <Link href={`/reservar?servicio=cake-smash&set=${set.slug}&tier=standard`}>
                  Reservar Standard
                </Link>
              </Button>
            </div>

            {/* Premium */}
            <div className="border border-outline-variant/20 rounded-3xl p-8 md:p-12 text-center bg-surface-container-lowest shadow-sm relative flex flex-col">
              <div className="absolute top-5 right-5 bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Upgrade Recomendado
              </div>
              <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-4 block">
                Colección Premium
              </span>
              {style.tierPremiumTagline && (
                <h3 className="font-serif text-2xl md:text-3xl text-primary mb-10 italic">
                  {style.tierPremiumTagline}
                </h3>
              )}
              <ul className="space-y-4 mb-10 flex-1 text-left max-w-sm mx-auto w-full">
                {style.tierPremiumDuration && (
                  <li className="flex items-center gap-3 text-on-surface">
                    <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    {style.tierPremiumDuration} minutos de sesión
                  </li>
                )}
                {premiumHighlights.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-on-surface">
                    <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mb-8">
                <p className="font-serif italic text-3xl md:text-4xl text-primary">
                  {formatCurrency(set.premiumPrice)}
                </p>
              </div>
              <Button asChild variant="primary" uppercase fullWidthMobile className="mx-auto">
                <Link href={`/reservar?servicio=cake-smash&set=${set.slug}&tier=premium`}>
                  Reservar Premium
                </Link>
              </Button>
            </div>
          </div>

          {/* Comparación rápida */}
          <div className="mt-16 md:mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-3 block">
                Comparación
              </span>
              <h3 className="font-serif text-2xl md:text-3xl italic text-on-surface">
                ¿Qué tiene cada uno?
              </h3>
            </div>
            <div className="border border-outline-variant/20 rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 md:gap-6 px-6 md:px-8 py-4 bg-surface-container-low text-xs uppercase tracking-widest font-semibold text-on-surface-variant">
                <span>Incluye</span>
                <span className="text-center w-16 md:w-24">Standard</span>
                <span className="text-center w-16 md:w-24">Premium</span>
              </div>
              {(() => {
                const allItems = Array.from(
                  new Set([...standardHighlights, ...premiumHighlights]),
                );
                return allItems.map((item) => {
                  const inStd = standardHighlights.includes(item);
                  const inPrem = premiumHighlights.includes(item);
                  return (
                    <div
                      key={item}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 md:gap-6 px-6 md:px-8 py-4 border-t border-outline-variant/10 items-center"
                    >
                      <span className="text-sm text-on-surface">{item}</span>
                      <span className="text-center w-16 md:w-24">
                        {inStd ? (
                          <Check className="w-5 h-5 text-primary inline" strokeWidth={2.5} aria-label="Incluido" />
                        ) : (
                          <X className="w-5 h-5 text-outline inline" strokeWidth={2} aria-label="No incluido" />
                        )}
                      </span>
                      <span className="text-center w-16 md:w-24">
                        {inPrem ? (
                          <Check className="w-5 h-5 text-primary inline" strokeWidth={2.5} aria-label="Incluido" />
                        ) : (
                          <X className="w-5 h-5 text-outline inline" strokeWidth={2} aria-label="No incluido" />
                        )}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Personalization Block → link a set personalizado */}
      {customSet && (
        <section className="py-16 md:py-24 px-4 md:px-8 bg-surface-bright border-y border-outline-variant/10">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                <Image
                  src={customSet.coverImage || `https://picsum.photos/seed/${customSet.slug}/800/600`}
                  alt="Set personalizado"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary font-semibold">
                Tu idea, tu set
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-on-surface">
                Personaliza tu aventura
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                ¿Tenés una idea específica? Desde la paleta de colores hasta la
                temática completa, diseñamos un set único para vos.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    Paleta de colores custom
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-on-surface">
                    Temática y decoración a medida
                  </span>
                </div>
              </div>
              <Button asChild variant="primary">
                <Link href={`/servicios/cake-smash/${customSet.slug}`}>
                  Crear mi set personalizado
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ compartidos de Cake Smash */}
      <FAQ
        items={[
          { q: '¿Cuándo debo reservar la sesión?', a: 'Recomendamos reservar con 1 o 2 meses de antelación, especialmente si deseas un set personalizado.' },
          { q: '¿Incluyen el pastel en la sesión?', a: 'Sí, todos nuestros packs incluyen el pastel artesanal coordinado con la temática elegida.' },
          { q: '¿Qué pasa si mi bebé tiene alergias?', a: 'Nuestros pasteles son orgánicos y adaptables. Nos informas con antelación y ajustamos ingredientes según las necesidades de tu bebé.' },
          { q: '¿Pueden participar los padres o hermanos?', a: 'Por supuesto. Incluimos algunas tomas familiares al inicio de la sesión sin costo adicional.' },
        ]}
      />

      {/* CTA final */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
            Reservá tu sesión {set.name}
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Los cupos son limitados. Asegurá tu fecha antes de que se agote.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild variant="inverse">
              <Link href={`/reservar?servicio=cake-smash&set=${set.slug}`}>
                Reservar ahora
              </Link>
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
