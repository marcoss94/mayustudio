'use client';

import { useState, useTransition } from 'react';
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type FieldValues,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { styleSchema, type StyleInput } from '@/lib/validations/services';
import { slugify } from '@/lib/utils';

export interface StyleFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<StyleInput> & { id?: string };
  onSubmit: (data: StyleInput) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: (data: StyleInput) => void;
}

function defaultsFor(initial?: Partial<StyleInput>): StyleInput {
  const type = initial?.type ?? 'STANDARD';
  const base = {
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    shortDescription: initial?.shortDescription ?? '',
    description: initial?.description ?? '',
    coverImage: initial?.coverImage ?? '',
    badge: initial?.badge ?? '',
    label: initial?.label ?? '',
    highlights: initial?.highlights ?? [],
    isActive: initial?.isActive ?? true,
    isVisible: initial?.isVisible ?? true,
    displayOrder: initial?.displayOrder ?? 0,
  };

  if (type === 'SETS_AND_TIERS') {
    const i = initial as Partial<Extract<StyleInput, { type: 'SETS_AND_TIERS' }>> | undefined;
    return {
      ...base,
      type: 'SETS_AND_TIERS',
      tierStandardDuration: i?.tierStandardDuration ?? 30,
      tierPremiumDuration: i?.tierPremiumDuration ?? 45,
      tierStandardTagline: i?.tierStandardTagline ?? '',
      tierPremiumTagline: i?.tierPremiumTagline ?? '',
      tierStandardHighlights: i?.tierStandardHighlights ?? [],
      tierPremiumHighlights: i?.tierPremiumHighlights ?? [],
    };
  }

  if (type === 'SEASONAL') {
    const i = initial as Partial<Extract<StyleInput, { type: 'SEASONAL' }>> | undefined;
    return {
      ...base,
      type: 'SEASONAL',
      price: i?.price ?? 0,
      duration: i?.duration ?? 60,
      seasonStart: i?.seasonStart ?? new Date(),
      seasonEnd: i?.seasonEnd ?? new Date(),
    };
  }

  const i = initial as Partial<Extract<StyleInput, { type: 'STANDARD' }>> | undefined;
  return {
    ...base,
    type: 'STANDARD',
    price: i?.price ?? 0,
    duration: i?.duration ?? 60,
  };
}

function toDateInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

const typeLabels: Record<string, string> = {
  STANDARD: 'Standard',
  SETS_AND_TIERS: 'Sets & Tiers',
  SEASONAL: 'Temporada',
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-8 first:pt-0 border-t border-outline-variant/20 first:border-0">
      <header className="mb-4">
        <h3 className="font-serif text-lg italic text-on-surface">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-on-surface-variant">{description}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function HighlightsField({
  name,
  label,
  description,
  placeholder,
  control,
}: {
  name: 'highlights' | 'tierStandardHighlights' | 'tierPremiumHighlights';
  label: string;
  description?: string;
  placeholder: string;
  control: Control<FieldValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/60 p-4">
      <div>
        <p className="text-sm font-medium text-on-surface">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-on-surface-variant">{description}</p>
        )}
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-on-surface-variant italic">
          Sin {label.toLowerCase()} aún. Agregá uno para empezar.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 list-none">
          {fields.map((f, i) => (
            <li key={f.id} className="flex gap-2 items-center">
              <span className="text-xs font-mono text-on-surface-variant w-5 text-right shrink-0">
                {i + 1}.
              </span>
              <Controller
                control={control}
                name={`${name}.${i}`}
                render={({ field }) => (
                  <Input
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    placeholder={placeholder}
                    containerClassName="flex-1"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Quitar ${label.toLowerCase()} ${i + 1}`}
                className="shrink-0 rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="soft"
        size="sm"
        onClick={() => append('' as never)}
        className="self-start"
      >
        <Plus className="w-3 h-3" />
        Agregar
      </Button>
    </div>
  );
}

export function StyleForm({ mode, initialData, onSubmit, onSuccess }: StyleFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StyleInput>({
    resolver: zodResolver(styleSchema) as unknown as Resolver<StyleInput>,
    defaultValues: defaultsFor(initialData),
    mode: 'onBlur',
  });

  const currentType = watch('type');
  const isActive = watch('isActive');
  const isVisible = watch('isVisible');
  const coverImage = watch('coverImage');

  async function submit(data: StyleInput) {
    setServerError(null);
    const res = await onSubmit(data);
    if (!res.success) {
      setServerError(res.error ?? 'Error');
      return;
    }
    startTransition(() => onSuccess?.(data));
  }

  const typedControl = control as unknown as Control<FieldValues>;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-0">
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {serverError}
        </div>
      )}

      <Section
        title="Identidad"
        description="Nombre interno y URL pública del estilo."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Ej: Cake Smash"
          />
          <div>
            <Input
              label="Slug"
              {...register('slug')}
              hint={
                mode === 'edit'
                  ? 'Cambiarlo rompe URLs públicas existentes'
                  : 'minúsculas y guiones. Ej: cake-smash'
              }
              error={errors.slug?.message}
              placeholder="cake-smash"
            />
            <button
              type="button"
              onClick={() => {
                const name = watch('name');
                if (name) setValue('slug', slugify(name), { shouldDirty: true, shouldValidate: true });
              }}
              className="mt-1.5 text-xs text-primary hover:underline font-medium"
            >
              Generar desde nombre
            </button>
          </div>
          <Select
            label="Tipo"
            {...register('type')}
            disabled={mode === 'edit'}
            hint={mode === 'edit' ? 'No editable tras creación' : undefined}
            options={[
              { value: 'STANDARD', label: 'Standard' },
              { value: 'SETS_AND_TIERS', label: 'Sets & Tiers' },
              { value: 'SEASONAL', label: 'Temporada' },
            ]}
          />
        </div>
      </Section>

      <Section
        title="Presentación"
        description="Cómo se muestra en las tarjetas del catálogo público."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Badge"
            {...register('badge')}
            hint="Etiqueta corta, ej: Nuevo, Popular"
            error={errors.badge?.message}
            placeholder="Nuevo"
          />
          <Input
            label="Label"
            {...register('label')}
            hint="Subtítulo editorial, ej: Celebración Vibrante"
            error={errors.label?.message}
            placeholder="Celebración Vibrante"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <Input
            label="Cover image URL"
            type="url"
            {...register('coverImage')}
            error={errors.coverImage?.message}
            placeholder="https://..."
            hint="Imagen principal del estilo"
          />
          {coverImage && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </Section>

      <Section
        title="Contenido"
        description="Textos que aparecen en el sitio público."
      >
        <Input
          label="Descripción corta"
          {...register('shortDescription')}
          hint="Resumen para tarjetas del catálogo (máx 200 caracteres)"
          error={errors.shortDescription?.message}
          placeholder="Una experiencia lúdica para celebrar el primer año..."
        />
        <Textarea
          label="Descripción larga"
          rows={5}
          {...register('description')}
          error={errors.description?.message}
          placeholder="Texto completo que aparece en la página del estilo."
        />
      </Section>

      <Section
        title="Highlights"
        description="Puntos destacados que aparecen como lista en la página del estilo."
      >
        <HighlightsField
          name="highlights"
          label="Highlights generales"
          description="Se muestran en la página pública del estilo."
          placeholder="Ej: Sesión de 45 minutos con acompañante"
          control={typedControl}
        />
      </Section>

      {currentType === 'STANDARD' && (
        <Section
          title={`Configuración — ${typeLabels[currentType]}`}
          description="Precio y duración fijos para este estilo."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Precio (UYU)"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.price?.message}
              placeholder="55000"
            />
            <Input
              label="Duración (min)"
              type="number"
              min="1"
              {...register('duration', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.duration?.message}
              placeholder="60"
            />
          </div>
        </Section>
      )}

      {currentType === 'SEASONAL' && (
        <Section
          title={`Configuración — ${typeLabels[currentType]}`}
          description="Precio fijo + rango de fechas en que aparece en el sitio público."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Precio (UYU)"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.price?.message}
            />
            <Input
              label="Duración (min)"
              type="number"
              min="1"
              {...register('duration', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.duration?.message}
            />
            <Controller
              control={control}
              name="seasonStart"
              render={({ field }) => (
                <Input
                  label="Inicio temporada"
                  type="date"
                  value={toDateInput(field.value as Date | string | undefined)}
                  onChange={(e) =>
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  // @ts-expect-error — errors es union
                  error={errors.seasonStart?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="seasonEnd"
              render={({ field }) => (
                <Input
                  label="Fin temporada"
                  type="date"
                  value={toDateInput(field.value as Date | string | undefined)}
                  onChange={(e) =>
                    field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                  }
                  // @ts-expect-error — errors es union
                  error={errors.seasonEnd?.message}
                />
              )}
            />
          </div>
        </Section>
      )}

      {currentType === 'SETS_AND_TIERS' && (
        <Section
          title={`Configuración — ${typeLabels[currentType]}`}
          description="Este tipo se compone de sets (se editan aparte). Acá configurás los tiers Standard y Premium compartidos."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/60 p-4">
              <p className="font-serif italic text-on-surface">Tier Standard</p>
              <Input
                label="Duración (min)"
                type="number"
                min="1"
                {...register('tierStandardDuration', { valueAsNumber: true })}
                // @ts-expect-error — errors es union
                error={errors.tierStandardDuration?.message}
              />
              <Input
                label="Tagline"
                {...register('tierStandardTagline')}
                hint="Frase corta del tier"
                // @ts-expect-error — errors es union
                error={errors.tierStandardTagline?.message}
              />
              <HighlightsField
                name="tierStandardHighlights"
                label="Highlights Standard"
                placeholder="Ej: 8 fotos editadas"
                control={typedControl}
              />
            </div>

            <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/60 p-4">
              <p className="font-serif italic text-on-surface">Tier Premium</p>
              <Input
                label="Duración (min)"
                type="number"
                min="1"
                {...register('tierPremiumDuration', { valueAsNumber: true })}
                // @ts-expect-error — errors es union
                error={errors.tierPremiumDuration?.message}
              />
              <Input
                label="Tagline"
                {...register('tierPremiumTagline')}
                hint="Frase corta del tier"
                // @ts-expect-error — errors es union
                error={errors.tierPremiumTagline?.message}
              />
              <HighlightsField
                name="tierPremiumHighlights"
                label="Highlights Premium"
                placeholder="Ej: 20 fotos + álbum físico"
                control={typedControl}
              />
            </div>
          </div>
        </Section>
      )}

      <Section
        title="Ordenación y estado"
        description="Dónde aparece y si es visible en el sitio público."
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-6 items-start">
          <Input
            label="Orden"
            type="number"
            min="0"
            {...register('displayOrder', { valueAsNumber: true })}
            hint="Menor = aparece primero"
            error={errors.displayOrder?.message}
          />
          <div className="pt-6 md:pt-7">
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue('isActive', v, { shouldDirty: true })}
              label="Activo"
              description="Se puede reservar"
            />
          </div>
          <div className="pt-6 md:pt-7">
            <Switch
              checked={isVisible}
              onCheckedChange={(v) => setValue('isVisible', v, { shouldDirty: true })}
              label="Visible"
              description="Aparece en el catálogo público"
            />
          </div>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-6 md:-mx-8 mt-8 border-t border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur px-6 md:px-8 py-4 flex justify-end gap-2">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting || isPending}
          disabled={isSubmitting || isPending}
        >
          {mode === 'create' ? 'Crear estilo' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
