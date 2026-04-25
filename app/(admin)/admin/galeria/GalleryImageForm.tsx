'use client';

import { useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import {
  galleryImageSchema,
  type GalleryImageInput,
} from '@/lib/validations/gallery';

export interface StyleWithSets {
  slug: string;
  name: string;
  sets?: { slug: string; name: string }[];
}

export interface GalleryImageFormProps {
  initialData?: Partial<GalleryImageInput>;
  styleSlugs: StyleWithSets[];
  /** Si true, styleSlug y setSlug vienen de initialData y no son editables */
  lockTags?: boolean;
  onSubmit: (data: GalleryImageInput) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

function defaults(initial?: Partial<GalleryImageInput>): GalleryImageInput {
  return {
    url: initial?.url ?? '',
    alt: initial?.alt ?? '',
    caption: initial?.caption ?? '',
    order: initial?.order ?? 0,
    isVisible: initial?.isVisible ?? true,
    styleSlug: initial?.styleSlug ?? null,
    setSlug: initial?.setSlug ?? null,
  };
}

export function GalleryImageForm({
  initialData,
  styleSlugs,
  lockTags = false,
  onSubmit,
  onCancel,
}: GalleryImageFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GalleryImageInput>({
    resolver: zodResolver(galleryImageSchema) as unknown as Resolver<GalleryImageInput>,
    defaultValues: defaults(initialData),
  });

  const url = watch('url');
  const isVisible = watch('isVisible');
  const styleSlug = watch('styleSlug');
  const setSlug = watch('setSlug');

  const availableSets = useMemo(() => {
    if (!styleSlug) return [];
    const s = styleSlugs.find((x) => x.slug === styleSlug);
    return s?.sets ?? [];
  }, [styleSlug, styleSlugs]);

  async function submit(data: GalleryImageInput) {
    setServerError(null);
    const res = await onSubmit(data);
    if (!res.success) setServerError(res.error ?? 'Error');
  }

  const styleOptions = [
    { value: '', label: 'Sin tag (general)' },
    ...styleSlugs.map((s) => ({ value: s.slug, label: s.name })),
  ];

  const setOptions = [
    { value: '', label: 'Ninguno (general del estilo)' },
    ...availableSets.map((s) => ({ value: s.slug, label: s.name })),
  ];

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
        <Input
          label="URL de la imagen"
          type="url"
          {...register('url')}
          error={errors.url?.message}
          placeholder="https://..."
        />
        {url && (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.opacity = '1';
              }}
            />
          </div>
        )}
      </div>

      <Input
        label="Alt text"
        {...register('alt')}
        error={errors.alt?.message}
        hint="Descripción de la imagen para SEO y accesibilidad"
        placeholder="Ej: Bebé sonriendo con torta de cumpleaños"
      />

      <Textarea
        label="Caption"
        rows={2}
        {...register('caption')}
        error={errors.caption?.message}
        hint="Pie de foto opcional"
      />

      {!lockTags && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Estilo"
            value={styleSlug ?? ''}
            onChange={(e) => {
              const v = e.target.value === '' ? null : e.target.value;
              setValue('styleSlug', v, { shouldDirty: true });
              setValue('setSlug', null, { shouldDirty: true });
            }}
            options={styleOptions}
            hint="Taggear por estilo o dejar general"
          />
          <Select
            label="Set"
            value={setSlug ?? ''}
            onChange={(e) =>
              setValue('setSlug', e.target.value === '' ? null : e.target.value, {
                shouldDirty: true,
              })
            }
            options={setOptions}
            disabled={!styleSlug || availableSets.length === 0}
            hint={!styleSlug ? 'Elegí un estilo primero' : undefined}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Orden"
          type="number"
          min="0"
          {...register('order', { valueAsNumber: true })}
          error={errors.order?.message}
          hint="Menor = aparece primero"
        />
        <div className="pt-6">
          <Switch
            checked={isVisible}
            onCheckedChange={(v) => setValue('isVisible', v, { shouldDirty: true })}
            label="Visible"
            description="Aparece en el sitio público"
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
