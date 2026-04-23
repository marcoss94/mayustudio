'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { StyleForm } from '../StyleForm';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { updateStyle } from '@/actions/services.actions';
import type { StyleInput } from '@/lib/validations/services';
import type { SerializedStyle } from './types';

export function StyleGeneralForm({ style }: { style: SerializedStyle }) {
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

  return (
    <>
      <StyleForm mode="edit" initialData={initial} onSubmit={handleSubmit} />
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
