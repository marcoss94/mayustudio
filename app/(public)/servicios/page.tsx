import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveStyles } from '@/lib/queries/services';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Estilos',
  description:
    'Descubrí todos los estilos de fotografía infantil de MayuStudio: Cake Smash, Fine Art y Minimalista. Momentos únicos capturados con arte.',
};

export default async function EstilosPage() {
  const styles = await getActiveStyles();


  return (
    <main className="pt-24">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low relative flex min-h-[500px] items-center md:min-h-[600px]">
        {/* Japandi dot pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#d3c4ba 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 text-center md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <span className="border-outline-variant/60 text-primary mb-6 inline-block rounded-full border px-4 py-1 font-sans text-xs tracking-[0.2em] uppercase md:mb-8">
              Nuestra Curaduría
            </span>
            <h1 className="text-on-background mb-6 font-serif text-4xl leading-tight tracking-tight md:mb-8 md:text-6xl lg:text-8xl">
              Nuestros <span className="font-normal italic">Estilos</span> de Fotografía
            </h1>
            <p className="text-on-surface-variant mx-auto max-w-2xl text-base leading-relaxed md:text-xl">
              Capturamos la pureza de los primeros años a través de tres lenguajes visuales
              distintos, diseñados para trascender el tiempo y reflejar la esencia de su hogar.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Intro ─────────────────────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="mb-8 font-serif text-2xl leading-snug md:text-4xl">
            Cada familia imagina sus momentos de forma única.
          </h2>
          <div className="bg-outline-variant mx-auto mb-8 h-[1px] w-16 opacity-40" />
          <p className="text-on-surface-variant text-base leading-relaxed md:text-lg">
            Entendemos que la fotografía es una extensión de la identidad de su hogar. Por eso,
            hemos curado tres enfoques estéticos que permiten que cada sesión sea un reflejo
            auténtico de su visión, desde la explosión de alegría de un cumpleaños hasta la
            serenidad atemporal de un retrato artístico.
          </p>
        </div>
      </section>

      {/* ─── Estilos ───────────────────────────────────────────────────── */}
      {styles.map((style, index) => {
        const isReversed = index % 2 !== 0;
        const bgClass = index % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface';

        return (
          <section key={style.slug} className={`py-20 md:py-32 ${bgClass}`}>
            <div
              className={`mx-auto flex max-w-7xl flex-col px-4 md:px-8 ${
                isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
              } items-center gap-12 md:gap-24`}
            >
              {/* Imagen */}
              <div className="w-full md:w-1/2">
                <div
                  className={`${style.type === 'SETS_AND_TIERS' ? 'aspect-[5/4]' : 'aspect-[4/5]'} relative overflow-hidden rounded-2xl shadow-lg`}
                >
                  <Image
                    src={
                      style.coverImage ||
                      `https://picsum.photos/seed/${style.slug}-style/${style.type === 'SETS_AND_TIERS' ? '1000/800' : '640/800'}`
                    }
                    alt={style.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Texto */}
              <div className="w-full md:w-1/2">
                <span
                  className="font-sans text-xs tracking-[0.3em] uppercase mb-4 block font-semibold text-primary"
                >
                  {style.label || style.name}
                </span>
                <h3 className="mb-6 font-serif text-3xl md:text-5xl">{style.name}</h3>
                <p className="text-on-surface-variant mb-8 text-base leading-relaxed md:text-lg">
                  {style.shortDescription || style.name}
                </p>
                {style.highlights.length > 0 && (
                  <ul className="text-on-surface mb-10 space-y-4">
                    {style.highlights.map((h: string) => (
                      <li key={h} className="flex items-center gap-3">
                        <span
                          className="h-5 w-5 shrink-0 rounded-full bg-primary flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <Button asChild variant="primary" uppercase>
                  <Link href={`/servicios/${style.slug}`}>
                    Ver detalles de {style.name}
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── CTA final ─────────────────────────────────────────────────── */}
      <section className="bg-primary text-on-primary px-4 py-24 text-center md:px-8 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 font-serif text-3xl leading-tight md:text-6xl">
            Crea un <span className="font-normal italic">legado</span> eterno
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-lg font-light opacity-90 md:text-xl">
            No permitas que estos días pasen desapercibidos. Elige el estilo que mejor resuene con
            tu familia y comencemos a planificar tu sesión.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Button asChild variant="inverse">
              <Link href="/reservar">Reservar sesión ahora</Link>
            </Button>
            <Button asChild variant="inverse-outline">
              <Link href="/contacto">Enviar consulta directa</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
