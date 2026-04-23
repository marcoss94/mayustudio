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
import type { StyleType } from '@prisma/client';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { styleSchema, type StyleInput } from '@/lib/validations/services';

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

function HighlightsField({
  name,
  label,
  control,
}: {
  name: 'highlights' | 'tierStandardHighlights' | 'tierPremiumHighlights';
  label: string;
  // RHF no tolera discriminated unions bien en useFieldArray — usamos FieldValues.
  control: Control<FieldValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
        {label}
      </label>
      <ul className="flex flex-col gap-2 list-none">
        {fields.map((f, i) => (
          <li key={f.id} className="flex gap-2 items-start">
            <Controller
              control={control}
              name={`${name}.${i}`}
              render={({ field }) => (
                <Input
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Texto del highlight"
                  containerClassName="flex-1"
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Quitar"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
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

  async function submit(data: StyleInput) {
    setServerError(null);
    const res = await onSubmit(data);
    if (!res.success) {
      setServerError(res.error ?? 'Error');
      return;
    }
    startTransition(() => onSuccess?.(data));
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {serverError}
        </div>
      )}

      {/* Sección: básico */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Slug"
          {...register('slug')}
          hint="minúsculas y guiones. Ej: cake-smash"
          error={errors.slug?.message}
        />
        <Select
          label="Tipo"
          {...register('type')}
          disabled={mode === 'edit'}
          options={[
            { value: 'STANDARD', label: 'Standard' },
            { value: 'SETS_AND_TIERS', label: 'Sets & Tiers' },
            { value: 'SEASONAL', label: 'Temporada' },
          ]}
          containerClassName="md:col-span-1"
        />
        <Input
          label="Orden"
          type="number"
          {...register('displayOrder', { valueAsNumber: true })}
          error={errors.displayOrder?.message}
        />
        <Input
          label="Badge"
          {...register('badge')}
          hint="ej: Nuevo, Popular"
          error={errors.badge?.message}
        />
        <Input
          label="Label"
          {...register('label')}
          hint="ej: Celebración Vibrante"
          error={errors.label?.message}
        />
      </section>

      <section className="grid grid-cols-1 gap-4">
        <Input
          label="Descripción corta"
          {...register('shortDescription')}
          hint="máx 200 caracteres"
          error={errors.shortDescription?.message}
        />
        <Textarea
          label="Descripción"
          rows={5}
          {...register('description')}
          error={errors.description?.message}
        />
        <Input
          label="Cover image URL"
          type="url"
          {...register('coverImage')}
          error={errors.coverImage?.message}
          placeholder="https://..."
        />
      </section>

      <HighlightsField
        name="highlights"
        label="Highlights"
        control={control as unknown as Control<FieldValues>}
      />

      {/* Sección específica por type */}
      {currentType === 'STANDARD' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio (ARS)"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            // @ts-expect-error — errors es union
            error={errors.price?.message}
          />
          <Input
            label="Duración (min)"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            // @ts-expect-error — errors es union
            error={errors.duration?.message}
          />
        </section>
      )}

      {currentType === 'SEASONAL' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio (ARS)"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            // @ts-expect-error — errors es union
            error={errors.price?.message}
          />
          <Input
            label="Duración (min)"
            type="number"
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
        </section>
      )}

      {currentType === 'SETS_AND_TIERS' && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Standard — duración (min)"
              type="number"
              {...register('tierStandardDuration', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.tierStandardDuration?.message}
            />
            <Input
              label="Premium — duración (min)"
              type="number"
              {...register('tierPremiumDuration', { valueAsNumber: true })}
              // @ts-expect-error — errors es union
              error={errors.tierPremiumDuration?.message}
            />
            <Input
              label="Standard — tagline"
              {...register('tierStandardTagline')}
              // @ts-expect-error — errors es union
              error={errors.tierStandardTagline?.message}
            />
            <Input
              label="Premium — tagline"
              {...register('tierPremiumTagline')}
              // @ts-expect-error — errors es union
              error={errors.tierPremiumTagline?.message}
            />
          </section>
          <HighlightsField
            name="tierStandardHighlights"
            label="Standard — Highlights"
            control={control as unknown as Control<FieldValues>}
          />
          <HighlightsField
            name="tierPremiumHighlights"
            label="Premium — Highlights"
            control={control as unknown as Control<FieldValues>}
          />
        </>
      )}

      <section className="flex flex-wrap gap-6 pt-4 border-t border-outline-variant/20">
        <Switch
          checked={isActive}
          onCheckedChange={(v) => setValue('isActive', v, { shouldDirty: true })}
          label="Activo"
          description="visible en el catálogo"
        />
        <Switch
          checked={isVisible}
          onCheckedChange={(v) => setValue('isVisible', v, { shouldDirty: true })}
          label="Visible"
          description="aparece en listas públicas"
        />
      </section>

      <div className="flex justify-end gap-2">
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
