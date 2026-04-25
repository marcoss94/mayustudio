'use client';

import { useForm, Controller, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { EmbeddedGalleryManager } from '@/components/admin/EmbeddedGalleryManager';
import { styleSetSchema, type StyleSetInput } from '@/lib/validations/services';
import { slugify } from '@/lib/utils';
import type { GalleryImageRow, StyleWithSets } from '@/app/(admin)/admin/galeria/GalleryGrid';

export interface StyleSetFormProps {
  styleSlug: string;
  setSlug?: string;
  styleSlugs: StyleWithSets[];
  galleryImages: GalleryImageRow[];
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
    standardPrice: initial?.standardPrice ?? 0,
    premiumPrice: initial?.premiumPrice ?? 0,
    isCustom: initial?.isCustom ?? false,
    customPrice: initial?.customPrice ?? null,
    isActive: initial?.isActive ?? true,
    displayOrder: initial?.displayOrder ?? 0,
  };
}

export function StyleSetForm({
  styleSlug,
  setSlug,
  styleSlugs,
  galleryImages,
  initialData,
  onSubmit,
  onCancel,
}: StyleSetFormProps) {
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
        <div>
          <Input
            label="Slug"
            {...register('slug')}
            error={errors.slug?.message}
            hint="minúsculas-con-guiones"
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

      <section className="pt-6 border-t border-outline-variant/20">
        <header className="mb-3">
          <h4 className="font-serif text-base italic text-on-surface">Galería del set</h4>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Fotos específicas de este set — aparecen en /servicios/{styleSlug}/{setSlug ?? '[slug]'}.
          </p>
        </header>
        <EmbeddedGalleryManager
          styleSlug={styleSlug}
          setSlug={setSlug ?? null}
          enabled={Boolean(setSlug)}
          images={setSlug ? galleryImages.filter((i) => i.setSlug === setSlug) : []}
          styleSlugs={styleSlugs}
          pendingMessage="Guardá el set primero para poder agregar fotos."
          emptyMessage="Sin fotos del set todavía."
        />
      </section>

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
