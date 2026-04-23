'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Clock, Sparkles, Camera } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface ConfigStyle {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  label: string | null;
}

export interface ConfigSet {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  standardPrice: number;
  isCustom: boolean;
  customPrice: number | null;
}

export interface ExperienciaConfiguratorProps {
  styles: ConfigStyle[];
  cakeSmashSets: ConfigSet[];
  eventPrice3h: number;
  eventPrice4h: number;
  comboDiscount: number;
}

export function ExperienciaConfigurator({
  styles,
  cakeSmashSets,
  eventPrice3h,
  eventPrice4h,
  comboDiscount,
}: ExperienciaConfiguratorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [coverage, setCoverage] = useState<'3h' | '4h'>('3h');

  const isCakeSmash = selectedStyle === 'cake-smash';
  const eventPrice = coverage === '3h' ? eventPrice3h : eventPrice4h;

  const selectedStyleData = styles.find((s) => s.slug === selectedStyle);
  const selectedSetData = cakeSmashSets.find((s) => s.slug === selectedSet);

  let stylePrice = 0;
  if (isCakeSmash && selectedSetData) {
    stylePrice = selectedSetData.isCustom
      ? selectedSetData.customPrice ?? 0
      : selectedSetData.standardPrice;
  }
  const total = stylePrice + eventPrice - comboDiscount;

  // Step 2 visible solo si Cake Smash — paso 3 pasa a ser número 2 cuando no hay Cake Smash
  const coverageStepNum = isCakeSmash ? '3' : '2';

  return (
    <section className="py-20 md:py-32 px-4 md:px-8" id="configurator">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Configura tu Experiencia
          </h2>
          <p className="text-on-surface-variant">
            Diseña cada detalle de tu sesión en pocos pasos.
          </p>
        </div>

        {/* ── Step 1: Style ── */}
        <div className="space-y-6 mb-16 md:mb-24">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
              1
            </span>
            <div>
              <h3 className="font-serif text-xl md:text-2xl mb-1">
                Elige tu Estilo de Estudio
              </h3>
              <p className="text-on-surface-variant text-sm md:text-base">
                Cada estilo tiene su propia estética. Seleccioná el que mejor
                resuene con tu visión para la sesión en estudio.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {styles.map((style) => {
              const isSelected = selectedStyle === style.slug;
              return (
                <button
                  key={style.slug}
                  type="button"
                  onClick={() => {
                    setSelectedStyle(style.slug);
                    if (style.slug !== 'cake-smash') setSelectedSet(null);
                  }}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    isSelected
                      ? 'border-primary shadow-xl ring-4 ring-primary/20 scale-[1.02]'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={
                        style.coverImage ||
                        `https://picsum.photos/seed/${style.slug}/400/500`
                      }
                      alt={style.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-left">
                      <span className="text-white font-serif text-xl">
                        {style.name}
                      </span>
                      {style.label && (
                        <span className="text-white/70 text-sm">
                          {style.label}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Check
                          className="w-5 h-5 text-on-primary"
                          strokeWidth={3}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2: Cake Smash Set (solo si aplica) ── */}
        {isCakeSmash && (
          <div className="space-y-6 mb-16 md:mb-24">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
                2
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl mb-1">
                  Personaliza tu Set
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base">
                  Elegí uno de nuestros sets temáticos curados o pedí un diseño
                  personalizado según tu visión.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cakeSmashSets.map((set) => {
                const isSetSelected = selectedSet === set.slug;
                return (
                  <button
                    key={set.slug}
                    type="button"
                    onClick={() => setSelectedSet(set.slug)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isSetSelected
                        ? 'border-primary shadow-xl ring-4 ring-primary/20 scale-[1.02]'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={
                          set.coverImage ||
                          `https://picsum.photos/seed/set-${set.slug}/300/300`
                        }
                        alt={set.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white font-serif text-sm text-left">
                        {set.name}
                      </span>
                      {isSetSelected && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Check
                            className="w-4 h-4 text-on-primary"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 3 (o 2): Coverage ── */}
        <div className="space-y-6 mb-16 md:mb-24">
          <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shrink-0">
              {coverageStepNum}
            </span>
            <div>
              <h3 className="font-serif text-xl md:text-2xl mb-1">
                Duración de la Cobertura
              </h3>
              <p className="text-on-surface-variant text-sm md:text-base">
                ¿Cuánto querés que cubramos tu evento? Elegí según el tamaño y
                ritmo de la celebración.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {(
              [
                { h: '3h' as const, label: '3 Horas', desc: 'Ideal para celebraciones íntimas.', price: eventPrice3h },
                { h: '4h' as const, label: '4 Horas', desc: 'Captura cada detalle, de inicio a fin.', price: eventPrice4h },
              ]
            ).map((opt) => {
              const isSelected = coverage === opt.h;
              return (
                <button
                  key={opt.h}
                  type="button"
                  onClick={() => setCoverage(opt.h)}
                  className={`p-6 md:p-8 rounded-xl bg-surface-container-lowest flex items-start justify-between gap-4 text-left transition-all border-2 ${
                    isSelected
                      ? 'border-primary shadow-xl ring-4 ring-primary/20'
                      : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  <div>
                    <span className="text-xl md:text-2xl font-bold block">
                      {opt.label}
                    </span>
                    <span className="text-on-surface-variant text-sm">
                      {opt.desc}
                    </span>
                    <span className="block mt-2 text-primary font-serif text-lg">
                      {formatCurrency(opt.price)}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-primary'
                        : 'border-2 border-outline'
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <Check
                        className="w-5 h-5 text-on-primary"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Summary (estilo Fine Art package) ── */}
        <div className="max-w-3xl mx-auto border border-outline-variant/20 rounded-3xl p-8 md:p-16 text-center bg-surface-container-lowest shadow-sm">
          <span className="font-sans text-secondary uppercase tracking-widest text-xs mb-6 block">
            Tu Configuración
          </span>
          <h3 className="font-serif text-3xl md:text-4xl text-primary mb-10 md:mb-12">
            Experiencia Completa
          </h3>

          <div className="space-y-6 mb-10 md:mb-12 text-left max-w-md mx-auto">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Estilo:</strong>{' '}
                {selectedStyleData?.name ?? (
                  <span className="italic text-on-surface-variant/60">
                    Sin seleccionar
                  </span>
                )}
              </p>
            </div>
            {isCakeSmash && (
              <div className="flex items-start gap-4">
                <Camera className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-on-surface-variant">
                  <strong className="text-on-surface">Set:</strong>{' '}
                  {selectedSetData?.name ?? (
                    <span className="italic text-on-surface-variant/60">
                      Sin seleccionar
                    </span>
                  )}
                </p>
              </div>
            )}
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary shrink-0 mt-1" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-on-surface-variant">
                <strong className="text-on-surface">Cobertura:</strong>{' '}
                {coverage === '3h' ? '3 Horas' : '4 Horas'}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-8 text-left max-w-md mx-auto text-sm">
            {stylePrice > 0 && (
              <div className="flex justify-between text-on-surface-variant">
                <span>Estilo</span>
                <span>{formatCurrency(stylePrice)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Evento ({coverage})</span>
              <span>{formatCurrency(eventPrice)}</span>
            </div>
            <div className="flex justify-between text-tertiary">
              <span>Descuento combo</span>
              <span>-{formatCurrency(comboDiscount)}</span>
            </div>
          </div>

          <div className="mb-12">
            <p className="font-serif italic text-4xl md:text-5xl text-primary">
              {formatCurrency(total)}
            </p>
            <p className="text-sm text-on-surface-variant/70 mt-2 font-sans uppercase tracking-widest">
              Total estimado
            </p>
          </div>

          <Button asChild variant="gradient" uppercase fullWidthMobile>
            <Link
              href={`/reservar?servicio=experiencia-completa${
                selectedStyle ? `&estilo=${selectedStyle}` : ''
              }${selectedSet ? `&set=${selectedSet}` : ''}&cobertura=${coverage}`}
            >
              Reservar sesión ahora
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
