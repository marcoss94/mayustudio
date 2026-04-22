import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveStyles, getStyleBySlug, getExperienciaCompletaConfig } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { FAQ, ExperienciaConfigurator, HowItWorks } from '@/components/sections';
import { Camera, Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Experiencia Completa',
  description:
    'Sesión de estudio más cobertura de evento. Del retrato artístico a la narrativa documental en un solo servicio boutique.',
};

export default async function ExperienciaCompletaPage() {
  const [styles, cakeSmash, config, galleryImages] = await Promise.all([
    getActiveStyles(),
    getStyleBySlug('cake-smash'),
    getExperienciaCompletaConfig(),
    getGalleryImages(),
  ]);

  const configStyles = styles.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    coverImage: s.coverImage,
    label: s.label,
  }));

  const cakeSmashSets = (cakeSmash?.sets ?? []).map((set) => ({
    id: set.id,
    name: set.name,
    slug: set.slug,
    coverImage: set.coverImage,
    standardPrice: set.standardPrice,
    isCustom: set.isCustom,
    customPrice: set.customPrice,
  }));

  const images = galleryImages.slice(0, 6);

  return (
    <main className="pt-24">
      {/* ─── Hero split ────────────────────────────────────────────────── */}
      <section className="relative flex items-center px-4 md:px-12 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <span className="inline-block text-secondary font-sans tracking-widest uppercase text-sm font-semibold">
              Experiencia Boutique
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] font-bold text-on-surface">
              Capturando la esencia de la infancia.
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Un viaje visual que comienza en nuestro estudio íntimo y culmina
              en la celebración de sus momentos más valiosos. Arte para ser
              recordado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#configurator"
                className="bg-primary text-on-primary px-6 md:px-7 py-2.5 md:py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center justify-center active:scale-[0.98]"
              >
                Configurar mi sesión
              </a>
              <a
                href="#galeria"
                className="bg-white text-primary border-2 border-primary-container px-6 md:px-7 py-2.5 md:py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[44px] flex items-center justify-center active:scale-[0.98]"
              >
                Ver galería
              </a>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-xs md:max-w-sm">
              <div className="rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] aspect-[4/5] relative">
                <Image
                  src="https://picsum.photos/seed/exp-hero/600/750"
                  alt="Retrato en estudio + celebración"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest p-5 md:p-6 rounded-xl shadow-lg max-w-[220px] hidden md:block">
                <p className="font-serif italic text-primary text-sm md:text-base leading-relaxed">
                  &ldquo;Cada gesto es una historia, cada luz es una memoria
                  eterna.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── La Fusión Perfecta ────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-surface-container-low">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
            <div className="md:w-1/2 grid grid-cols-2 gap-4 max-w-md">
              <Image
                src="https://picsum.photos/seed/exp-studio/400/400"
                alt="Set de estudio minimalista"
                width={400}
                height={400}
                className="rounded-xl aspect-square object-cover mt-6"
              />
              <Image
                src="https://picsum.photos/seed/exp-event/400/400"
                alt="Cobertura de evento de cumpleaños"
                width={400}
                height={400}
                className="rounded-xl aspect-square object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl">
                La Fusión Perfecta
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                Nuestra &ldquo;Experiencia Completa&rdquo; combina la perfección
                técnica del estudio con la espontaneidad de tu evento especial.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <Camera className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <span className="font-bold block mb-1">Sesión de Estudio</span>
                    <span className="text-on-surface-variant">
                      Control total de luz y estilo para retratos artísticos
                      atemporales.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Film className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <span className="font-bold block mb-1">Cobertura de Evento</span>
                    <span className="text-on-surface-variant">
                      Narrativa documental de 3 o 4 horas capturando cada
                      emoción real.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cómo funciona el servicio ─────────────────────────────────── */}
      <HowItWorks
        title="¿Cómo funciona?"
        steps={[
          { n: '1', title: 'Configura', desc: 'Elegís tu estilo de estudio, set (si aplica) y duración del evento.' },
          { n: '2', title: 'Reservás', desc: 'Confirmás fechas y seña para asegurar tu lugar en el calendario.' },
          { n: '3', title: 'Sesión', desc: 'Primero pasás por el estudio para retratos editoriales tranquilos.' },
          { n: '4', title: 'Evento', desc: 'Cubrimos tu celebración con narrativa documental y te entregamos todo editado.' },
        ]}
      />

      {/* ─── Configurator ──────────────────────────────────────────────── */}
      {config && (
        <ExperienciaConfigurator
          styles={configStyles}
          cakeSmashSets={cakeSmashSets}
          eventPrice3h={config.eventPrice3h}
          eventPrice4h={config.eventPrice4h}
          comboDiscount={config.comboDiscount}
        />
      )}

      {/* ─── Galería ───────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto" id="galeria">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
              Fragmentos de Realidad
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Una muestra de nuestra visión: desde la calma del estudio hasta
              la alegría del festejo.
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

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <FAQ
        items={[
          { q: '¿Con cuánta antelación debo reservar?', a: 'Recomendamos reservar con al menos 2 meses de antelación, especialmente para eventos en fin de semana. La sesión de estudio se suele realizar 1 o 2 semanas antes del evento.' },
          { q: '¿Qué sucede si llueve el día del evento?', a: 'Nos adaptamos a las condiciones del día. Si el evento es al aire libre y hay clima adverso, coordinamos un plan alternativo bajo techo sin costo adicional.' },
          { q: '¿Cómo recibiré mis fotografías?', a: 'Recibirás una galería online privada con las fotos editadas. La sesión de estudio se entrega en 10-15 días hábiles; la cobertura del evento en 20-30 días.' },
        ]}
      />

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            ¿Listo para crear recuerdos eternos?
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto font-light">
            Permítenos contar tu historia con la luz y la delicadeza que tu
            familia merece.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-2">
            <a
              href="#configurator"
              className="bg-on-primary text-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.12)] min-h-[44px] flex items-center active:scale-[0.98]"
            >
              Reservar ahora
            </a>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-on-primary px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 min-h-[44px] flex items-center active:scale-[0.98]"
            >
              Enviar consulta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
