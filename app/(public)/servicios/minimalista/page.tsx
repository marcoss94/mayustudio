import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStyleBySlug } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';
import { HowItWorks, FAQ } from '@/components/sections';
import { Sun, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Estilo Minimalista',
  description:
    'La belleza de lo simple. Sesiones fotográficas minimalistas con fondos neutros donde la personalidad de tu bebé es la protagonista.',
};

export default async function MinimalistaPage() {
  const [style, galleryImages] = await Promise.all([
    getStyleBySlug('minimalista'),
    getGalleryImages('minimalista'),
  ]);

  const images = galleryImages.slice(0, 6);
  const extras = style?.extras ?? [];

  return (
    <main className="pt-24">
      {/* ─── Hero split ────────────────────────────────────────────────── */}
      <section className="px-4 md:px-20 py-16 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-4 block font-semibold">
              Menos es Más
            </span>
            <h1 className="font-serif text-4xl md:text-7xl italic leading-tight text-on-background mb-6">
              La belleza reside en la simplicidad
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl max-w-lg mb-10 leading-relaxed">
              Sin distracciones, solo tu bebé en un entorno luminoso y sereno.
              Capturamos la suavidad de la piel, los pequeños gestos y la
              conexión pura con la cámara.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="primary">
                <Link href="/reservar">Reservar Minimalista</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="#galeria">Ver galería</a>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-end">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-xs md:max-w-sm">
              <Image
                src={style?.coverImage || 'https://picsum.photos/seed/min-hero/600/750'}
                alt="Sesión fotográfica minimalista"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filosofía ─────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-6 md:mb-8 block">
            Nuestra Filosofía
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface mb-10 md:mb-12 leading-snug">
            El espacio vacío es parte de la composición.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left text-on-surface-variant">
            <p className="leading-relaxed">
              En la fotografía minimalista, cada elemento cuenta. Eliminamos lo
              superfluo para que la atención recaiga únicamente en lo que
              importa: la expresión, la textura de la piel, la curva de una
              sonrisa. El fondo neutro no es ausencia, es intención.
            </p>
            <p className="leading-relaxed">
              Trabajamos con luz natural suave y paletas monocromáticas que
              crean imágenes atemporales. El resultado son fotografías que no
              envejecen, que se integran en cualquier espacio del hogar y que
              transmiten serenidad y calidez al mismo tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Galería ───────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto" id="galeria">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
              Pureza visual
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Cuando el fondo desaparece, la personalidad brilla.
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

      {/* ─── Proceso ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface-container">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-1/2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
              La Experiencia
            </span>
            <h2 className="font-serif text-3xl md:text-4xl italic mb-8">
              Sencillez con intención
            </h2>
            <ul className="space-y-10 md:space-y-12">
              {[
                { n: '01', title: 'Paleta de Color', desc: 'Definimos juntos los tonos neutros que mejor representen la personalidad de tu bebé y armonicen con tu hogar.' },
                { n: '02', title: 'Luz Natural', desc: 'Trabajamos con la luz del día, suave y envolvente, para crear imágenes con calidez orgánica.' },
                { n: '03', title: 'Edición Limpia', desc: 'Post-producción sutil que respeta la naturalidad. Sin filtros artificiales, solo refinamiento profesional.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-6">
                  <span className="text-3xl md:text-4xl font-serif italic text-outline-variant shrink-0">
                    {step.n}
                  </span>
                  <div>
                    <h4 className="font-bold text-on-surface mb-2">{step.title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-xs md:max-w-sm">
              <Image
                src="https://picsum.photos/seed/min-process/500/625"
                alt="Sesión minimalista en proceso"
                width={500}
                height={625}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Paquete ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface">
        <div className="max-w-3xl mx-auto border border-outline-variant/20 rounded-3xl p-8 md:p-20 text-center bg-surface-container-lowest shadow-sm">
          <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-6 block">
            El Paquete
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-12">
            Minimalista Collection
          </h2>
          <div className="space-y-8 mb-16 text-left max-w-md mx-auto">
            <div className="flex items-start gap-4">
              <Sun className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Luz Natural:</strong>{' '}
                {style?.duration ?? 30} minutos de sesión con fondos neutros profesionales.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Palette className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Paleta Curada:</strong> Vestuario en tonos neutros y fibras naturales incluido.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Edición Limpia:</strong> 12 fotografías editadas con galería privada online.
              </p>
            </div>
          </div>
          {style?.price !== null && style?.price !== undefined && (
            <div className="mb-12">
              <p className="font-serif italic text-4xl md:text-5xl text-primary">
                {formatCurrency(style.price)}
              </p>
              <p className="text-sm text-on-surface-variant/70 mt-2 font-sans uppercase tracking-widest">
                Inversión en Simplicidad
              </p>
            </div>
          )}
          <Button asChild variant="gradient" uppercase fullWidthMobile>
            <Link href="/reservar">Reservar Minimalista</Link>
          </Button>
        </div>
      </section>

      {/* ─── Extras opcionales ─────────────────────────────────────────── */}
      {extras.length > 0 && (
        <section className="py-16 md:py-20 px-4 md:px-8 bg-surface-container-low">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-serif text-2xl md:text-3xl italic mb-4">
                Opcionales
              </h2>
              <p className="text-on-surface-variant text-sm">
                Complementá tu paquete con estos adicionales
              </p>
            </div>
            <div className="space-y-4">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className="bg-surface-container-lowest rounded-xl p-6 flex justify-between items-center shadow-[0_20px_40px_rgba(63,43,34,0.06)]"
                >
                  <span className="text-on-surface">{extra.name}</span>
                  <span className="font-serif text-primary font-semibold text-lg">
                    +{formatCurrency(extra.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <HowItWorks
        title="Así de simple"
        steps={[
          { n: '1', title: 'Reserva', desc: 'Elige tu fecha ideal desde nuestra agenda online.' },
          { n: '2', title: 'Coordinamos', desc: 'Definimos paleta de color y detalles del vestuario.' },
          { n: '3', title: 'Sesión', desc: 'Una experiencia tranquila y relajada en el estudio.' },
          { n: '4', title: 'Entrega', desc: 'Recibes tus fotografías editadas en formato digital.' },
        ]}
      />

      <FAQ
        title="Consultas frecuentes"
        items={[
          { q: '¿A partir de qué edad se puede hacer una sesión minimalista?', a: 'Desde recién nacidos. La sesión se adapta completamente a la etapa de desarrollo de tu bebé. Para recién nacidos trabajamos con poses seguras y suaves.' },
          { q: '¿Qué debo llevar a la sesión?', a: 'Nosotros proporcionamos vestuario en tonos neutros y fibras naturales. Si preferís usar prendas propias, te asesoramos para que armonicen con la estética.' },
          { q: '¿Cuánto dura la sesión?', a: `La sesión tiene una duración aproximada de ${style?.duration ?? 30} minutos, pero nos adaptamos al ritmo de tu bebé sin presiones.` },
          { q: '¿Puedo agregar opcionales después de reservar?', a: 'Sí, los opcionales se pueden agregar en cualquier momento antes de la sesión o incluso después al recibir la galería.' },
        ]}
      />

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
            Lo simple perdura
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Las fotografías más poderosas son las que no necesitan explicación.
            Reservá tu sesión minimalista y descubrí la belleza de lo esencial.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild variant="inverse">
              <Link href="/reservar">Reservar Minimalista</Link>
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
