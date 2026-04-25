'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryVisible,
} from '@/actions/gallery.actions';
import type { GalleryImageInput } from '@/lib/validations/gallery';
import { GalleryImageForm } from '@/app/(admin)/admin/galeria/GalleryImageForm';
import type { GalleryImageRow } from '@/app/(admin)/admin/galeria/GalleryGrid';

export interface EmbeddedGalleryManagerProps {
  styleSlug: string | null;
  setSlug: string | null;
  enabled: boolean;
  images: GalleryImageRow[];
  styleSlugs: { slug: string; name: string }[];
  pendingMessage?: string;
  emptyMessage?: string;
}

export function EmbeddedGalleryManager({
  styleSlug,
  setSlug,
  enabled,
  images,
  styleSlugs,
  pendingMessage = 'Guardá primero para agregar fotos.',
  emptyMessage = 'Sin imágenes. Agregá la primera.',
}: EmbeddedGalleryManagerProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<GalleryImageRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GalleryImageRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-lowest/60 p-6 text-center">
        <p className="text-sm text-on-surface-variant">{pendingMessage}</p>
      </div>
    );
  }

  async function handleCreate(data: GalleryImageInput) {
    const payload: GalleryImageInput = {
      ...data,
      styleSlug,
      setSlug,
    };
    const res = await createGalleryImage(payload);
    if (!res.success) return { success: false, error: res.error };
    setCreating(false);
    router.refresh();
    return { success: true };
  }

  async function handleUpdate(data: GalleryImageInput) {
    if (!editing) return { success: false, error: 'No image' };
    const payload: GalleryImageInput = {
      ...data,
      styleSlug,
      setSlug,
    };
    const res = await updateGalleryImage(editing.id, payload);
    if (!res.success) return { success: false, error: res.error };
    setEditing(null);
    router.refresh();
    return { success: true };
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const res = await deleteGalleryImage(pendingDelete.id);
    if (!res.success) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleToggle(img: GalleryImageRow) {
    setError(null);
    const res = await toggleGalleryVisible(img.id, !img.isVisible);
    if (!res.success) setError(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
        </p>
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <Plus className="w-4 h-4" />
          Nueva imagen
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

      {images.length === 0 ? (
        <EmptyState title="Sin imágenes" description={emptyMessage} />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 list-none">
          {images.map((img) => (
            <li
              key={img.id}
              className={cn(
                'group relative aspect-square rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container',
                !img.isVisible && 'opacity-50',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-on-surface-variant">
                <ImageOff className="w-6 h-6" strokeWidth={1.5} />
              </div>

              <span className="absolute top-1.5 left-1.5 rounded-full bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-medium px-1.5 py-0.5 backdrop-blur-sm">
                #{img.order}
              </span>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleToggle(img)}
                  aria-label={img.isVisible ? 'Ocultar' : 'Mostrar'}
                  className="rounded-md p-1 bg-white/90 text-on-surface hover:bg-white"
                >
                  {img.isVisible ? (
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(img)}
                  aria-label="Editar"
                  className="rounded-md p-1 bg-white/90 text-on-surface hover:bg-white"
                >
                  <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(img)}
                  aria-label="Eliminar"
                  className="rounded-md p-1 bg-white/90 text-error hover:bg-white"
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nueva imagen"
        size="md"
      >
        <GalleryImageForm
          styleSlugs={styleSlugs}
          initialData={{ styleSlug, setSlug }}
          lockTags
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar imagen"
        size="md"
      >
        {editing && (
          <GalleryImageForm
            styleSlugs={styleSlugs}
            initialData={{
              url: editing.url,
              alt: editing.alt,
              caption: editing.caption ?? '',
              order: editing.order,
              isVisible: editing.isVisible,
              styleSlug,
              setSlug,
            }}
            lockTags
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar imagen"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
