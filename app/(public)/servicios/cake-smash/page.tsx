import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStyleBySlug } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';
import { Cake, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cake Smash',
  description:
    'Celebramos el primer año de tu bebé con sets temáticos únicos. Sesiones Cake Smash con paquetes Standard y Premium.',
};

export default async function CakeSmashPage() {
  const [style, galleryImages] = await Promise.all([
    getStyleBySlug('cake-smash'),
    getGalleryImages('cake-smash'),
  ]);

  const sets = style?.sets.filter((s) => !s.isCustom) ?? [];
  const customSet = style?.sets.find((s) => s.isCustom);
  const images = galleryImages.slice(0, 8);

  return (
    <main className="pt-24">
      {/* ─── Sets temáticos ────────────────────────────────────────────── */}
      {sets.length > 0 && (
        <section className="py-20 md:py-32 px-4 md:px-12" id="sets">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-serif text-3xl md:text-4xl text-on-background mb-4">
                  Nuestros universos
                </h2>
                <p className="text-on-surface-variant">
                  Elige el estilo que mejor conecte con la personalidad de tu
                  bebé. Cada set es una obra original.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sets.map((set) => (
                <Link
                  key={set.slug}
                  href={`/servicios/cake-smash/${set.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[5/4] rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={
                        set.coverImage ||
                        `https://picsum.photos/seed/set-${set.slug}/750/600`
                      }
                      alt={set.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c14]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-serif text-2xl text-on-background">
                    {set.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-2">
                    {set.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Set personalizado ─────────────────────────────────────────── */}
      {customSet && (
        <section className="py-16 md:py-20 px-4 md:px-12" id="personalizado">
          <div className="max-w-7xl mx-auto bg-primary rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
            <div className="p-8 md:p-20 flex-1 flex flex-col justify-center items-start text-on-primary">
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                ¿Tienes una idea única?
              </h2>
              <p className="text-base md:text-lg text-primary-fixed mb-6 max-w-md opacity-90 leading-relaxed">
                Creamos sets desde cero basados en tus cuentos favoritos, hobbies
                o temáticas especiales. Tu imaginación es el único límite.
              </p>
              <p className="font-serif text-2xl md:text-3xl mb-10">
                {formatCurrency(customSet.customPrice!)}
              </p>
              <Link
                href="/servicios/cake-smash/personalizado"
                className="bg-on-primary text-primary px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold hover:opacity-90 transition-all duration-300 min-h-[48px] flex items-center active:scale-[0.98]"
              >
                Solicitar set personalizado
              </Link>
            </div>
            <div className="w-full md:w-1/2 aspect-video md:aspect-auto min-h-[300px] relative">
              <Image
                src="https://picsum.photos/seed/cs-custom/800/600"
                alt="Artista pintando un set personalizado"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ─── Experiencia ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
            <div className="aspect-[5/4] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
              <Image
                src="https://picsum.photos/seed/cs-experience/1000/800"
                alt="Torta artesanal decorada para sesión fotográfica"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-1/2 aspect-[5/4] rounded-xl overflow-hidden border-8 border-background shadow-[0_20px_40px_rgba(63,43,34,0.06)] hidden md:block">
              <Image
                src="https://picsum.photos/seed/cs-detail/500/400"
                alt="Detalle de manitos de bebé con pastel"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl text-on-background leading-tight">
              La experiencia sensorial que merecen
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
              No es solo una foto, es su primer contacto real con texturas,
              sabores y colores. En MayuStudio diseñamos cada sesión para que sea
              un juego seguro y divertido.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <Cake className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">Repostería Artesanal</h4>
                  <p className="text-on-surface-variant text-sm">Pasteles orgánicos, bajos en azúcar y adaptados a alergias alimentarias.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                  <Palette className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">Escenarios de Autor</h4>
                  <p className="text-on-surface-variant text-sm">Diseño exclusivo realizado a mano por nuestro equipo creativo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Galería ───────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="bg-surface-container-low py-20 md:py-32 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
                Historias dulces
              </h2>
              <p className="text-on-surface-variant max-w-xl mx-auto">
                Momentos reales de nuestras últimas sesiones en el estudio.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] bg-surface"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className="w-full aspect-[3/2] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Cómo funciona ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16 md:mb-20">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { n: '1', title: 'Reserva', desc: 'Elige tu fecha y pack ideal online en pocos clics.' },
              { n: '2', title: 'Planificación', desc: 'Hablamos sobre la temática y detalles del set.' },
              { n: '3', title: 'La Sesión', desc: 'Día de juegos, risas y, por supuesto, pastel.' },
              { n: '4', title: 'Entrega', desc: 'Recibe tus recuerdos en formato digital y físico.' },
            ].map((step) => (
              <div key={step.n} className="text-center group">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center text-primary font-serif text-xl md:text-2xl group-hover:bg-primary group-hover:text-on-primary transition-all">
                  {step.n}
                </div>
                <h4 className="font-bold mb-2 md:mb-3">{step.title}</h4>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-12 bg-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 md:mb-16">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              { q: '¿Cuándo debo reservar la sesión?', a: 'Recomendamos reservar con 1 o 2 meses de antelación, especialmente si deseas un set personalizado.' },
              { q: '¿Incluyen el pastel en la sesión?', a: 'Sí, todos nuestros packs incluyen el pastel artesanal coordinado con la temática elegida.' },
              { q: '¿Qué pasa si mi bebé tiene alergias?', a: 'Nuestros pasteles son orgánicos y adaptables. Nos informas con antelación y ajustamos ingredientes según las necesidades de tu bebé.' },
              { q: '¿Pueden participar los padres o hermanos?', a: 'Por supuesto. Incluimos algunas tomas familiares al inicio de la sesión sin costo adicional.' },
            ].map((faq, i) => (
              <details
                key={faq.q}
                className="group bg-surface-container rounded-xl overflow-hidden"
                open={i === 0}
              >
                <summary className="list-none flex justify-between items-center p-6 cursor-pointer font-semibold text-base md:text-lg hover:bg-surface-container-high transition-colors min-h-[44px]">
                  {faq.q}
                  <svg
                    className="w-5 h-5 shrink-0 ml-4 text-on-surface-variant group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-6 pt-0 text-on-surface-variant leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-6xl mb-8 leading-tight">
            Hagamos magia juntos
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Las plazas son limitadas cada mes para garantizar la exclusividad de
            cada diseño.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/reservar"
              className="bg-on-primary text-primary px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.12)] min-h-[48px] flex items-center active:scale-[0.98]"
            >
              Reservar Cake Smash
            </Link>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-on-primary px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 min-h-[48px] flex items-center active:scale-[0.98]"
            >
              Enviar consulta directa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
