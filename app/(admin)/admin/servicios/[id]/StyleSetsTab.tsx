'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Switch } from '@/components/ui/Switch';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import {
  createStyleSet,
  updateStyleSet,
  deleteStyleSet,
  toggleStyleSetActive,
} from '@/actions/services.actions';
import type { StyleSetInput } from '@/lib/validations/services';
import { StyleSetForm } from './StyleSetForm';
import type { SerializedStyle, SerializedSet } from './types';
import type { GalleryImageRow, StyleWithSets } from '@/app/(admin)/admin/galeria/GalleryGrid';

export interface StyleSetsTabProps {
  style: SerializedStyle;
  galleryImages: GalleryImageRow[];
  styleSlugs: StyleWithSets[];
}

export function StyleSetsTab({ style, galleryImages, styleSlugs }: StyleSetsTabProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<SerializedSet | null>(null);
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<SerializedSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(data: StyleSetInput) {
    const res = await createStyleSet(style.id, data);
    if (!res.success) return { success: false, error: res.error };
    setCreating(false);
    router.refresh();
    return { success: true };
  }

  async function handleUpdate(data: StyleSetInput) {
    if (!editing) return { success: false, error: 'No set' };
    const res = await updateStyleSet(editing.id, data);
    if (!res.success) return { success: false, error: res.error };
    setEditing(null);
    router.refresh();
    return { success: true };
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const res = await deleteStyleSet(pendingDelete.id);
    if (!res.success) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleToggle(id: string, value: boolean) {
    setError(null);
    const res = await toggleStyleSetActive(id, value);
    if (!res.success) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-on-surface-variant">
          Sets temáticos para este estilo. Cada uno con precio Standard/Premium o personalizado.
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo set
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      {style.sets.length === 0 ? (
        <EmptyState
          title="Sin sets todavía"
          description="Creá el primer set para este estilo."
        />
      ) : (
        <ul className="space-y-2 list-none">
          {style.sets.map((set) => (
            <li
              key={set.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-on-surface truncate">{set.name}</p>
                <p className="text-xs text-on-surface-variant">
                  /{set.slug}
                  {set.isCustom
                    ? ` · Custom ${set.customPrice != null ? formatCurrency(set.customPrice) : ''}`
                    : ` · S ${formatCurrency(set.standardPrice)} · P ${formatCurrency(set.premiumPrice)}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={set.isActive}
                  onCheckedChange={(v) => handleToggle(set.id, v)}
                />
                <button
                  type="button"
                  onClick={() => setEditing(set)}
                  aria-label="Editar"
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(set)}
                  aria-label="Eliminar"
                  className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nuevo set"
        size="lg"
      >
        <StyleSetForm
          styleSlug={style.slug}
          styleSlugs={styleSlugs}
          galleryImages={galleryImages}
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar set"
        size="lg"
      >
        {editing && (
          <StyleSetForm
            styleSlug={style.slug}
            setSlug={editing.slug}
            styleSlugs={styleSlugs}
            galleryImages={galleryImages}
            initialData={{
              name: editing.name,
              slug: editing.slug,
              description: editing.description ?? '',
              coverImage: editing.coverImage ?? '',
              standardPrice: editing.standardPrice,
              premiumPrice: editing.premiumPrice,
              customPrice: editing.customPrice ?? null,
              isCustom: editing.isCustom,
              isActive: editing.isActive,
              displayOrder: editing.displayOrder,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title={`Eliminar ${pendingDelete?.name ?? ''}`}
        description="Si el set tiene reservas, usá el toggle en lugar de eliminar."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
