import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStyleBySlug } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';
import { HowItWorks, FAQ } from '@/components/sections';
import { Camera, Sparkles, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Fine Art',
  description:
    'Retratos pictóricos que trascienden la fotografía convencional. Sesiones Fine Art con dirección artística, iluminación Rembrandt y edición de autor.',
};

export default async function FineArtPage() {
  const [style, galleryImages] = await Promise.all([
    getStyleBySlug('fine-art'),
    getGalleryImages({ styleSlug: 'fine-art' }),
  ]);

  const images = galleryImages.slice(0, 6);

  return (
    <main className="pt-24">
      {/* ─── Hero split ────────────────────────────────────────────────── */}
      <section className="px-4 md:px-20 py-16 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h1 className="font-serif text-4xl md:text-7xl italic leading-tight text-primary mb-6">
              Capturando la esencia de la infancia
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl max-w-lg mb-10 leading-relaxed">
              Nuestra visión Fine Art trasciende la fotografía convencional,
              creando retratos pictóricos que parecen detenidos en el tiempo.
              Arte puro para recordar siempre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="primary">
                <Link href="/reservar">Reservar Fine Art</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="#galeria">Ver galería</a>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-end">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-xs md:max-w-sm">
              <Image
                src={style?.coverImage || 'https://picsum.photos/seed/fa-hero/600/750'}
                alt="Retrato Fine Art"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Manifiesto ────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary mb-6 md:mb-8 block">
            El Manifiesto
          </span>
          <h2 className="font-serif text-3xl md:text-5xl italic text-on-surface mb-10 md:mb-12 leading-snug">
            Una mirada eterna,
            <br />
            una composición magistral.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-left text-on-surface-variant">
            <p className="leading-relaxed">
              El estilo Fine Art en MayuStudio es una oda a la pintura clásica.
              No buscamos la sonrisa forzada, sino la profundidad del alma
              infantil a través de una dirección artística meticulosa. Cada sesión
              es tratada como una obra de arte única, donde la luz y la sombra
              cuentan una historia silenciosa.
            </p>
            <p className="leading-relaxed">
              Utilizamos técnicas de post-producción pictórica para elevar cada
              retrato a un nivel de galería. El resultado es una pieza atemporal
              que no sigue tendencias, diseñada para ser heredada y admirada por
              generaciones como el tesoro más preciado de la familia.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Galería ───────────────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-5xl mx-auto" id="galeria">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-on-background mb-4">
              Retratos atemporales
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">
              Cada pieza es una obra única, tratada como un lienzo.
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

      {/* ─── Proceso artístico ─────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface-container">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
          <div className="w-full md:w-1/2">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">
              La Experiencia
            </span>
            <h2 className="font-serif text-3xl md:text-4xl italic mb-8">
              El arte de la quietud
            </h2>
            <ul className="space-y-10 md:space-y-12">
              {[
                { n: '01', title: 'Dirección de Arte', desc: 'Asesoramos en vestuario y paleta de colores para asegurar que el resultado visual sea armónico y atemporal.' },
                { n: '02', title: 'Escultura de Luz', desc: 'Utilizamos iluminación controlada para modelar las facciones, creando sombras suaves que dan volumen y alma.' },
                { n: '03', title: 'Edición de Autor', desc: 'Cada archivo digital pasa por un proceso de post-producción manual de horas para lograr texturas de lienzo.' },
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
                src="https://picsum.photos/seed/fa-process/500/625"
                alt="Fotógrafa ajustando detalles durante sesión Fine Art"
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
            La Experiencia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-primary mb-12">
            Fine Art Collection
          </h2>
          <div className="space-y-8 mb-16 text-left max-w-md mx-auto">
            <div className="flex items-start gap-4">
              <Camera className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Sesión Personalizada:</strong>{' '}
                {style?.duration ?? 45} minutos de creación artística en estudio.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Revelado Digital:</strong> 15 piezas de autor editadas con nuestra firma estética editorial.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Printer className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Legado Físico:</strong> 3 impresiones Fine Art en papel de algodón 100% (20x30cm).
              </p>
            </div>
          </div>
          {style?.price !== null && style?.price !== undefined && (
            <div className="mb-12">
              <p className="font-serif italic text-4xl md:text-5xl text-primary">
                {formatCurrency(style.price)}
              </p>
              <p className="text-sm text-on-surface-variant/70 mt-2 font-sans uppercase tracking-widest">
                Inversión en Memoria
              </p>
            </div>
          )}
          <Button asChild variant="gradient" uppercase fullWidthMobile>
            <Link href="/reservar">Solicitar Disponibilidad</Link>
          </Button>
        </div>
      </section>

      <HowItWorks
        title="El camino hacia su legado"
        steps={[
          { n: '1', title: 'Fecha', desc: 'Selecciona tu espacio en nuestro calendario exclusivo.' },
          { n: '2', title: 'Sesión', desc: 'Disfrutamos de una sesión tranquila y artística en el atelier.' },
          { n: '3', title: 'Selección', desc: 'Eliges tus tomas favoritas desde tu galería privada.' },
          { n: '4', title: 'Entrega', desc: 'Recibes tus obras de arte digitales y tu lienzo impreso.' },
        ]}
      />

      <FAQ
        title="Consultas frecuentes"
        items={[
          { q: '¿A qué edad se recomiendan estas sesiones?', a: 'Recomendamos estas sesiones para niños que ya pueden mantenerse sentados o seguir instrucciones sencillas (generalmente a partir de los 4-5 meses), ya que requiere cierta quietud para lograr la iluminación técnica necesaria.' },
          { q: '¿Proporcionan el vestuario?', a: 'Contamos con una selección exclusiva de piezas clásicas en nuestro atelier. Tras la reserva, coordinamos una llamada para definir si usaremos piezas del studio o prendas propias que encajen con la estética.' },
          { q: '¿Puedo comprar más fotos de las incluidas?', a: 'Sí, por supuesto. Debido a que el proceso de edición es altamente artesanal, cada foto adicional tiene un costo extra y añade tiempo al plazo de entrega final.' },
        ]}
      />

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-4 md:px-8 text-center bg-primary text-on-primary">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
            Crea un legado eterno
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Los momentos pasan, pero el arte permanece. Reserva hoy tu sesión
            Fine Art y transforma la infancia de tus hijos en una obra maestra.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild variant="inverse">
              <Link href="/reservar">Reservar Fine Art</Link>
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
