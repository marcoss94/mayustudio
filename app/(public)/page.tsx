import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Paintbrush, Aperture, Palette, CalendarHeart } from 'lucide-react';
import { HowItWorks, FAQ, SpecialsBanner } from '@/components/sections';
import { getActiveStyles, getSeasonalStyles } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { websiteJsonLd, localBusinessJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'MayuStudio — Fotografía Infantil Boutique',
  description:
    'Estudio de fotografía infantil boutique. Cake Smash, Fine Art, sesiones minimalistas y experiencias completas. Reservá tu sesión.',
};

export default async function HomePage() {
  const [styles, galleryImages, seasonals] = await Promise.all([
    getActiveStyles(),
    getGalleryImages(),
    getSeasonalStyles(),
  ]);

  const bannerSpecials = seasonals.map((s) => ({
    slug: s.slug,
    name: s.name,
    coverImage: s.coverImage,
    badge: s.badge,
  }));

  // Los 3 estilos base para "Nuestros Estilos"
  const featuredStyles = styles.slice(0, 3);
  // 4 imágenes para el grid de experiencia
  const expImages = galleryImages.slice(0, 4);

  return (
    <main className="pt-24">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd(), localBusinessJsonLd()]),
        }}
      />

      {/* ─── 1. Banner especiales (dinámico) ────────────────────────────── */}
      <SpecialsBanner specials={bannerSpecials} />

      {/* ─── 2. Hero ───────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden mb-16 md:mb-24 px-4 md:px-8 max-w-screen-2xl mx-auto">
        {/* Mobile: stacked layout (imagen arriba, texto abajo) */}
        <div className="md:hidden">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] mb-8">
            <Image
              src="https://picsum.photos/seed/hero-mayu/800/600"
              alt="Retrato editorial infantil con luz natural"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-serif text-3xl text-on-surface leading-[1.15] mb-4 tracking-tight">
            Capturando la{' '}
            <span className="italic text-primary">esencia</span> de la infancia
          </h1>
          <p className="text-base text-on-surface-variant leading-relaxed mb-8">
            Creamos recuerdos atemporales a través de una mirada editorial y
            delicada. Una experiencia artística diseñada para perdurar por
            generaciones.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/servicios"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center justify-center active:scale-[0.98]"
            >
              Ver estilos
            </Link>
            <Link
              href="/reservar"
              className="bg-white text-primary border-2 border-primary-container px-6 py-2.5 rounded-full font-medium text-sm hover:bg-surface transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center justify-center active:scale-[0.98]"
            >
              Reservar sesión
            </Link>
          </div>
        </div>

        {/* Desktop: imagen con texto overlay */}
        <div className="hidden md:block relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
          <Image
            src="https://picsum.photos/seed/hero-mayu/1600/700"
            alt="Retrato editorial infantil con luz natural"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/40 to-transparent" />
          <div className="absolute inset-0 flex items-center px-24">
            <div className="max-w-xl">
              <h1 className="font-serif text-6xl lg:text-7xl text-on-surface leading-[1.1] mb-6 tracking-tight">
                Capturando la{' '}
                <span className="italic text-primary">esencia</span> de la
                infancia
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed mb-10">
                Creamos recuerdos atemporales a través de una mirada editorial y
                delicada. Una experiencia artística diseñada para perdurar por
                generaciones.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/servicios"
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center"
                >
                  Ver estilos
                </Link>
                <Link
                  href="/reservar"
                  className="bg-white text-primary border-2 border-primary-container px-8 py-3 rounded-full font-medium hover:bg-surface transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center"
                >
                  Reservar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Feature strip ──────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {[
            { label: 'Retratos con dirección artística', Icon: Paintbrush },
            { label: 'Experiencias en estudio', Icon: Aperture },
            { label: 'Propuestas para cada estilo', Icon: Palette },
            { label: 'Reserva personalizada', Icon: CalendarHeart },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <item.Icon className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="font-sans uppercase tracking-widest text-xs font-semibold leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. Nuestros Estilos ───────────────────────────────────────── */}
      <section className="py-20 md:py-24 px-4 md:px-8 max-w-screen-2xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-5xl mb-4">Nuestros Estilos</h2>
          <div className="h-1 w-20 bg-secondary rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {featuredStyles.map((service) => (
            <Link
              key={service.slug}
              href={`/servicios/${service.slug}`}
              className="group block"
            >
              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6 shadow-[0_20px_40px_rgba(63,43,34,0.06)] relative">
                <Image
                  src={service.coverImage || `https://picsum.photos/seed/${service.slug}/800/450`}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-2xl mb-3">{service.name}</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed">
                {service.shortDescription || service.name}
              </p>
              <span className="bg-primary text-on-primary px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] inline-flex items-center gap-2">
                Ver detalles
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 5. Experiencia Completa (split) ───────────────────────────── */}
      <section className="py-20 md:py-24 bg-surface-container-highest">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Fotos — 2 imágenes alineadas */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {expImages.slice(0, 2).map((img) => (
                <Image
                  key={img.id}
                  src={img.url}
                  alt={img.alt}
                  width={400}
                  height={500}
                  className="rounded-2xl w-full aspect-[3/4] object-cover shadow-[0_20px_40px_rgba(63,43,34,0.06)]"
                />
              ))}
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <span className="font-sans uppercase tracking-[0.2em] text-primary text-sm font-bold mb-6 block">
              Documentando cada paso
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mb-8 leading-tight">
              Experiencia Completa: Del estudio a tu celebración
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-10">
              Ofrecemos un servicio integral que combina la precisión artística de
              una sesión de estudio con la cobertura documental de tu evento. El
              resultado es un relato visual cohesivo, elegante y profundamente
              emotivo.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Sesión de pre-cumpleaños personalizada',
                'Cobertura fotográfica premium del evento',
                'Álbum editorial de diseño exclusivo',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-secondary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/experiencia-completa"
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-medium hover:opacity-90 transition-all shadow-[0_20px_40px_rgba(63,43,34,0.06)] inline-flex items-center min-h-[44px]"
            >
              Conocer la experiencia
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks
        title="¿Cómo funciona?"
        steps={[
          { n: '1', title: 'Elige un estilo', desc: 'Explora nuestras propuestas artísticas y selecciona la que mejor conecte con tu visión.' },
          { n: '2', title: 'Personaliza tu experiencia', desc: 'Coordinamos detalles, vestuario y paleta de colores para una sesión a medida.' },
          { n: '3', title: 'Reserva tu fecha', desc: 'Asegura tu lugar en nuestro calendario y prepárate para crear magia juntos.' },
        ]}
      />

      {/* ─── 7. Testimonios ────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-surface">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl italic">
              Lo que dicen las familias
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: 'Una experiencia increíble. La paciencia y el ojo artístico hicieron que las fotos de mi hijo fueran simplemente perfectas. Son tesoros.', name: 'Lucía Fernández' },
              { text: 'El estilo editorial es justo lo que buscábamos. No son simples fotos, son piezas de arte que ahora decoran nuestra sala.', name: 'Marcos Ruiz' },
              { text: 'Recomendado 100%. La calidez del estudio y la atención al detalle en cada entrega es lo que los hace únicos en el mercado.', name: 'Elena Martínez' },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-[0_20px_40px_rgba(63,43,34,0.06)]"
              >
                <div className="text-secondary mb-6 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-on-surface mb-8 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-bold text-sm uppercase tracking-wider text-primary">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ
        items={[
          { q: '¿Con cuánta antelación debo reservar?', a: 'Recomendamos reservar con al menos 4 a 6 semanas de antelación, especialmente para sesiones de temporada o fines de semana, ya que nuestro calendario suele completarse rápido.' },
          { q: '¿Ofrecen vestuario para las sesiones?', a: 'Sí, contamos con un "clóset editorial" con prendas seleccionadas en tonos neutros y fibras naturales (lino, algodón) para niños de 0 a 5 años, asegurando que el estilo sea coherente.' },
          { q: '¿Cómo es el proceso de entrega?', a: 'Tras la sesión, recibirás una galería online para seleccionar tus favoritas. Una vez elegidas, el proceso de edición fina toma entre 10 y 15 días hábiles para garantizar la máxima calidad editorial.' },
        ]}
      />

      {/* ─── 9. CTA final ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-6xl mb-8 leading-tight">
            Cada mirada cuenta una historia única. Deja que la contemos por ti.
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Estamos listos para capturar esos momentos fugaces que se convertirán
            en tus tesoros más preciados.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/reservar"
              className="bg-on-primary text-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.12)] min-h-[44px] flex items-center active:scale-[0.98]"
            >
              Reservar sesión ahora
            </Link>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-on-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 min-h-[44px] flex items-center active:scale-[0.98]"
            >
              Enviar consulta directa
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
