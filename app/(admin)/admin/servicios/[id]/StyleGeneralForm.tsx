'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StyleForm } from '../StyleForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmbeddedGalleryManager } from '@/components/admin/EmbeddedGalleryManager';
import { updateStyle } from '@/actions/services.actions';
import type { StyleInput } from '@/lib/validations/services';
import type { SerializedStyle } from './types';
import type { GalleryImageRow, StyleWithSets } from '@/app/(admin)/admin/galeria/GalleryGrid';

export interface StyleGeneralFormProps {
  style: SerializedStyle;
  galleryImages: GalleryImageRow[];
  styleSlugs: StyleWithSets[];
}

export function StyleGeneralForm({ style, galleryImages, styleSlugs }: StyleGeneralFormProps) {
  const router = useRouter();
  const [pendingSlugChange, setPendingSlugChange] = useState<StyleInput | null>(null);

  const initial = {
    type: style.type,
    name: style.name,
    slug: style.slug,
    shortDescription: style.shortDescription ?? '',
    description: style.description ?? '',
    coverImage: style.coverImage ?? '',
    badge: style.badge ?? '',
    label: style.label ?? '',
    highlights: style.highlights,
    isActive: style.isActive,
    isVisible: style.isVisible,
    displayOrder: style.displayOrder,
    ...(style.type === 'STANDARD' && {
      price: style.price ?? 0,
      duration: style.duration ?? 60,
    }),
    ...(style.type === 'SEASONAL' && {
      price: style.price ?? 0,
      duration: style.duration ?? 60,
      seasonStart: style.seasonStart ?? new Date(),
      seasonEnd: style.seasonEnd ?? new Date(),
    }),
    ...(style.type === 'SETS_AND_TIERS' && {
      tierStandardDuration: style.tierStandardDuration ?? 30,
      tierPremiumDuration: style.tierPremiumDuration ?? 45,
      tierStandardTagline: style.tierStandardTagline ?? '',
      tierPremiumTagline: style.tierPremiumTagline ?? '',
      tierStandardHighlights: style.tierStandardHighlights,
      tierPremiumHighlights: style.tierPremiumHighlights,
    }),
  } as Partial<StyleInput>;

  async function doUpdate(data: StyleInput) {
    const res = await updateStyle(style.id, data);
    if (!res.success) return { success: false, error: res.error };
    router.refresh();
    return { success: true };
  }

  async function handleSubmit(data: StyleInput) {
    if (data.slug !== style.slug && style.isActive) {
      setPendingSlugChange(data);
      return { success: false, error: 'Confirmá el cambio de slug.' };
    }
    return doUpdate(data);
  }

  async function handleConfirmSlug() {
    if (!pendingSlugChange) return;
    const res = await doUpdate(pendingSlugChange);
    if (!res.success) throw new Error(res.error);
    setPendingSlugChange(null);
  }

  const generalImages = galleryImages.filter((i) => i.setSlug === null);

  return (
    <>
      <StyleForm mode="edit" initialData={initial} onSubmit={handleSubmit} />

      <section className="mt-10 pt-8 border-t border-outline-variant/20">
        <header className="mb-4">
          <h3 className="font-serif text-lg italic text-on-surface">Galería del estilo</h3>
          <p className="mt-0.5 text-sm text-on-surface-variant">
            Fotos generales del estilo — no asociadas a un set específico. Aparecen en /galeria y /servicios/{style.slug}.
          </p>
        </header>
        <EmbeddedGalleryManager
          styleSlug={style.slug}
          setSlug={null}
          enabled={true}
          images={generalImages}
          styleSlugs={styleSlugs}
          emptyMessage="Sin fotos generales del estilo todavía."
        />
      </section>

      <ConfirmDialog
        open={pendingSlugChange !== null}
        onClose={() => setPendingSlugChange(null)}
        onConfirm={handleConfirmSlug}
        title="Cambiar slug"
        description={`Cambiar el slug rompe URLs públicas existentes (/servicios/${style.slug}). ¿Continuar?`}
        confirmLabel="Sí, cambiar"
        variant="danger"
      />
    </>
  );
}
