'use client';

import { useForm, useFieldArray, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { styleSetSchema, type StyleSetInput } from '@/lib/validations/services';

export interface StyleSetFormProps {
  initialData?: Partial<StyleSetInput>;
  onSubmit: (data: StyleSetInput) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

function defaults(initial?: Partial<StyleSetInput>): StyleSetInput {
  return {
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    coverImage: initial?.coverImage ?? '',
    images: initial?.images ?? [],
    standardPrice: initial?.standardPrice ?? 0,
    premiumPrice: initial?.premiumPrice ?? 0,
    isCustom: initial?.isCustom ?? false,
    customPrice: initial?.customPrice ?? null,
    isActive: initial?.isActive ?? true,
    displayOrder: initial?.displayOrder ?? 0,
  };
}

export function StyleSetForm({ initialData, onSubmit, onCancel }: StyleSetFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StyleSetInput>({
    resolver: zodResolver(styleSetSchema) as unknown as Resolver<StyleSetInput>,
    defaultValues: defaults(initialData),
  });

  const { fields, append, remove } = useFieldArray<StyleSetInput>({
    control,
    // @ts-expect-error — arrays of strings tipado como never en RHF strict
    name: 'images',
  });
  const isCustom = watch('isCustom');
  const isActive = watch('isActive');

  async function submit(data: StyleSetInput) {
    const res = await onSubmit(data);
    if (!res.success) {
      // El modal padre muestra el error
      throw new Error(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Slug"
          {...register('slug')}
          error={errors.slug?.message}
          hint="minúsculas-con-guiones"
        />
      </div>

      <Textarea
        label="Descripción"
        rows={3}
        {...register('description')}
        error={errors.description?.message}
      />

      <Input
        label="Cover image URL"
        type="url"
        {...register('coverImage')}
        error={errors.coverImage?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Precio Standard"
          type="number"
          step="0.01"
          {...register('standardPrice', { valueAsNumber: true })}
          error={errors.standardPrice?.message}
        />
        <Input
          label="Precio Premium"
          type="number"
          step="0.01"
          {...register('premiumPrice', { valueAsNumber: true })}
          error={errors.premiumPrice?.message}
        />
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-lg border border-outline-variant/30 bg-surface-container/40">
        <Switch
          checked={isCustom}
          onCheckedChange={(v) => setValue('isCustom', v, { shouldDirty: true })}
          label="Set personalizado"
          description="precio fijo, descripción libre del cliente"
        />
        {isCustom && (
          <Controller
            control={control}
            name="customPrice"
            render={({ field }) => (
              <Input
                label="Precio personalizado"
                type="number"
                step="0.01"
                value={field.value ?? ''}
                onChange={(e) =>
                  field.onChange(e.target.value === '' ? null : Number(e.target.value))
                }
                error={errors.customPrice?.message}
              />
            )}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          Imágenes (URLs)
        </label>
        <ul className="flex flex-col gap-2 list-none">
          {fields.map((f, i) => (
            <li key={f.id} className="flex gap-2 items-start">
              <Input
                {...register(`images.${i}` as const)}
                placeholder="https://..."
                containerClassName="flex-1"
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
          Agregar URL
        </Button>
        {errors.images && (
          <p className="text-xs text-error">
            {errors.images.message ?? 'URL inválida en la lista'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Orden"
          type="number"
          {...register('displayOrder', { valueAsNumber: true })}
          error={errors.displayOrder?.message}
        />
        <div className="flex items-end">
          <Switch
            checked={isActive}
            onCheckedChange={(v) => setValue('isActive', v, { shouldDirty: true })}
            label="Activo"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant/20">
        <Button type="button" variant="soft" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}
