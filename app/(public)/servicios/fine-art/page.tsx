import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getStyleBySlug } from '@/lib/queries/services';
import { getGalleryImages } from '@/lib/queries/gallery';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Fine Art',
  description:
    'Retratos pictóricos que trascienden la fotografía convencional. Sesiones Fine Art con dirección artística, iluminación Rembrandt y edición de autor.',
};

export default async function FineArtPage() {
  const [style, galleryImages] = await Promise.all([
    getStyleBySlug('fine-art'),
    getGalleryImages('fine-art'),
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
              <Link
                href="/reservar"
                className="bg-primary text-on-primary px-8 md:px-10 py-3.5 md:py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[48px] flex items-center justify-center active:scale-[0.98]"
              >
                Reservar Fine Art
              </Link>
              <a
                href="#galeria"
                className="bg-white text-primary border-2 border-primary-container px-8 md:px-10 py-3.5 md:py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.06)] min-h-[48px] flex items-center justify-center active:scale-[0.98]"
              >
                Ver galería
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-end">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] max-w-md">
              <Image
                src={style?.coverImage || 'https://picsum.photos/seed/fa-hero/800/1000'}
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

      {/* ─── Galería editorial ─────────────────────────────────────────── */}
      {images.length > 0 && (
        <section className="py-20 md:py-32 px-4 md:px-8 max-w-screen-2xl mx-auto" id="galeria">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Columna izquierda */}
            <div className="md:col-span-5 md:mt-24 space-y-6 md:space-y-8">
              {images[0] && (
                <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                  <Image
                    src={images[0].url}
                    alt={images[0].alt}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {images[1] && (
                <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                  <Image
                    src={images[1].url}
                    alt={images[1].alt}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {/* Columna derecha */}
            <div className="md:col-span-7 space-y-6 md:space-y-8">
              {images[2] && (
                <div className="rounded-xl overflow-hidden aspect-[16/10] shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                  <Image
                    src={images[2].url}
                    alt={images[2].alt}
                    width={1000}
                    height={625}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                {images[3] && (
                  <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                    <Image
                      src={images[3].url}
                      alt={images[3].alt}
                      width={500}
                      height={667}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {images[4] && (
                  <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-[0_20px_40px_rgba(63,43,34,0.06)] mt-12">
                    <Image
                      src={images[4].url}
                      alt={images[4].alt}
                      width={500}
                      height={667}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
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
          <div className="w-full md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(63,43,34,0.06)] rotate-2">
              <Image
                src="https://picsum.photos/seed/fa-process/800/1000"
                alt="Fotógrafa ajustando detalles durante sesión Fine Art"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Paquete ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl italic mb-4">
              Colección de Autor
            </h2>
            <p className="text-on-surface-variant uppercase tracking-widest text-xs">
              Propuesta exclusiva Fine Art
            </p>
          </div>
          <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl shadow-[0_20px_40px_rgba(63,43,34,0.06)] text-center">
            <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
              {[
                { item: 'Sesión artística guiada', value: `${style?.duration ?? 45} Minutos` },
                { item: 'Fotografías digitales HD (Fine Art Edit)', value: '15 Archivos' },
                { item: 'Dirección de vestuario y color', value: 'Incluido' },
                { item: 'Galería privada online', value: 'Incluido' },
              ].map((row) => (
                <div
                  key={row.item}
                  className="flex justify-between items-center pb-4 border-b border-surface-container last:border-0 last:pb-0"
                >
                  <span className="text-on-surface text-left">{row.item}</span>
                  <span className="font-bold shrink-0 ml-4">{row.value}</span>
                </div>
              ))}
            </div>
            {style?.price !== null && style?.price !== undefined && (
              <div className="font-serif text-3xl md:text-4xl text-primary mb-8">
                {formatCurrency(style.price)}
              </div>
            )}
            <Link
              href="/reservar"
              className="w-full bg-primary text-on-primary py-4 md:py-5 rounded-full font-sans tracking-[0.1em] uppercase text-sm hover:opacity-90 transition-all active:scale-[0.98] min-h-[48px] flex items-center justify-center"
            >
              Reservar Fine Art
            </Link>
            <p className="mt-6 text-xs text-on-surface-variant/60 italic">
              Disponibilidad limitada por mes debido al proceso de
              post-producción
            </p>
          </div>
        </div>
      </section>

      {/* ─── Cómo funciona ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-surface">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl italic text-center mb-16 md:mb-24">
            El camino hacia su legado
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { n: '01', title: 'Fecha', desc: 'Selecciona tu espacio en nuestro calendario exclusivo.' },
              { n: '02', title: 'Sesión', desc: 'Disfrutamos de una sesión tranquila y artística en el atelier.' },
              { n: '03', title: 'Selección', desc: 'Eliges tus tomas favoritas desde tu galería privada.' },
              { n: '04', title: 'Entrega', desc: 'Recibes tus obras de arte digitales y tu lienzo impreso.' },
            ].map((step) => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface-container-highest flex items-center justify-center mb-6 shadow-[0_20px_40px_rgba(63,43,34,0.06)]">
                  <span className="text-primary font-serif text-lg md:text-xl">{step.n}</span>
                </div>
                <h4 className="font-bold mb-2 md:mb-3 uppercase text-xs tracking-widest">
                  {step.title}
                </h4>
                <p className="text-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl italic mb-12 md:mb-16 text-center">
            Consultas Frecuentes
          </h2>
          <div className="space-y-4">
            {[
              { q: '¿A qué edad se recomiendan estas sesiones?', a: 'Recomendamos estas sesiones para niños que ya pueden mantenerse sentados o seguir instrucciones sencillas (generalmente a partir de los 4-5 meses), ya que requiere cierta quietud para lograr la iluminación técnica necesaria.' },
              { q: '¿Proporcionan el vestuario?', a: 'Contamos con una selección exclusiva de piezas clásicas en nuestro atelier. Tras la reserva, coordinamos una llamada para definir si usaremos piezas del studio o prendas propias que encajen con la estética.' },
              { q: '¿Puedo comprar más fotos de las incluidas?', a: 'Sí, por supuesto. Debido a que el proceso de edición es altamente artesanal, cada foto adicional tiene un costo extra y añade tiempo al plazo de entrega final.' },
            ].map((faq, i) => (
              <details
                key={faq.q}
                className="group bg-surface-container-lowest rounded-xl overflow-hidden"
                open={i === 0}
              >
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none min-h-[44px]">
                  <span className="font-medium text-primary">{faq.q}</span>
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
                <div className="p-6 pt-0 text-on-surface-variant text-sm leading-relaxed">
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
          <h2 className="font-serif text-3xl md:text-5xl italic mb-8 leading-tight">
            Crea un legado eterno
          </h2>
          <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto font-light">
            Los momentos pasan, pero el arte permanece. Reserva hoy tu sesión
            Fine Art y transforma la infancia de tus hijos en una obra maestra.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/reservar"
              className="bg-on-primary text-primary px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-[0_20px_40px_rgba(63,43,34,0.12)] min-h-[48px] flex items-center active:scale-[0.98]"
            >
              Reservar Fine Art
            </Link>
            <Link
              href="/contacto"
              className="bg-transparent border-2 border-on-primary px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg hover:opacity-90 transition-all duration-300 min-h-[48px] flex items-center active:scale-[0.98]"
            >
              Enviar consulta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
