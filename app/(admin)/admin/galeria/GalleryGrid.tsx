'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  toggleGalleryVisible,
} from '@/actions/gallery.actions';
import type { GalleryImageInput } from '@/lib/validations/gallery';
import { GalleryImageForm } from './GalleryImageForm';

export interface GalleryImageRow {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  order: number;
  isVisible: boolean;
  styleSlug: string | null;
  setSlug: string | null;
}

export interface StyleWithSets {
  slug: string;
  name: string;
  sets: { slug: string; name: string }[];
}

export interface GalleryGridProps {
  images: GalleryImageRow[];
  styleSlugs: StyleWithSets[];
}

export function GalleryGrid({ images, styleSlugs }: GalleryGridProps) {
  const router = useRouter();
  const params = useSearchParams();
  const styleFilter = params.get('style') ?? '';
  const setFilter = params.get('set') ?? '';

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<GalleryImageRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GalleryImageRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return images.filter((i) => {
      if (styleFilter === '__none__') {
        if (i.styleSlug) return false;
      } else if (styleFilter && i.styleSlug !== styleFilter) {
        return false;
      }
      if (setFilter === '__none__') {
        if (i.setSlug) return false;
      } else if (setFilter && i.setSlug !== setFilter) {
        return false;
      }
      return true;
    });
  }, [images, styleFilter, setFilter]);

  const availableSets = useMemo(() => {
    if (!styleFilter || styleFilter === '__none__') return [];
    return styleSlugs.find((s) => s.slug === styleFilter)?.sets ?? [];
  }, [styleFilter, styleSlugs]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === 'style') next.delete('set'); // reset set when style changes
    router.push(`?${next.toString()}`, { scroll: false });
  }

  const styleName = (slug: string | null) =>
    !slug ? 'Sin tag' : styleSlugs.find((s) => s.slug === slug)?.name ?? slug;

  async function handleCreate(data: GalleryImageInput) {
    const res = await createGalleryImage(data);
    if (!res.success) return { success: false, error: res.error };
    setCreating(false);
    router.refresh();
    return { success: true };
  }

  async function handleUpdate(data: GalleryImageInput) {
    if (!editing) return { success: false, error: 'No image' };
    const res = await updateGalleryImage(editing.id, data);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Select
            label="Estilo"
            value={styleFilter}
            onChange={(e) => setParam('style', e.target.value)}
            options={[
              { value: '', label: 'Todos' },
              { value: '__none__', label: 'Sin tag' },
              ...styleSlugs.map((s) => ({ value: s.slug, label: s.name })),
            ]}
            containerClassName="sm:w-56"
          />
          <Select
            label="Set"
            value={setFilter}
            onChange={(e) => setParam('set', e.target.value)}
            disabled={!styleFilter || styleFilter === '__none__' || availableSets.length === 0}
            options={[
              { value: '', label: 'Todos' },
              { value: '__none__', label: 'Sin set' },
              ...availableSets.map((s) => ({ value: s.slug, label: s.name })),
            ]}
            containerClassName="sm:w-56"
          />
        </div>
        <Button
          type="button"
          variant="primary"
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

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin imágenes"
          description={
            styleFilter
              ? 'No hay imágenes con este filtro. Cambiá el filtro o creá una nueva.'
              : 'Agregá la primera imagen al portfolio.'
          }
        />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 list-none">
          {filtered.map((img) => (
            <li
              key={img.id}
              className={cn(
                'group relative aspect-square rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container',
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
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.classList.add('bg-error-container');
                }}
              />
              {/* Fallback indicator cuando url rota */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center text-on-surface-variant">
                <ImageOff className="w-8 h-8" strokeWidth={1.5} />
              </div>

              {/* Top-left badge: orden */}
              <span className="absolute top-2 left-2 rounded-full bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-medium px-2 py-0.5 backdrop-blur-sm">
                #{img.order}
              </span>

              {/* Top-right badge: tag */}
              {img.styleSlug && (
                <span className="absolute top-2 right-2 rounded-full bg-inverse-surface/80 text-inverse-on-surface text-[10px] font-medium px-2 py-0.5 backdrop-blur-sm max-w-[60%] truncate">
                  {styleName(img.styleSlug)}
                </span>
              )}

              {/* Hover overlay con actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                <p className="text-xs text-white/90 line-clamp-2">{img.alt}</p>
                <div className="flex gap-1 justify-end">
                  <button
                    type="button"
                    onClick={() => handleToggle(img)}
                    aria-label={img.isVisible ? 'Ocultar' : 'Mostrar'}
                    className="rounded-lg p-1.5 bg-white/90 text-on-surface hover:bg-white transition-colors"
                  >
                    {img.isVisible ? (
                      <Eye className="w-4 h-4" strokeWidth={1.75} />
                    ) : (
                      <EyeOff className="w-4 h-4" strokeWidth={1.75} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(img)}
                    aria-label="Editar"
                    className="rounded-lg p-1.5 bg-white/90 text-on-surface hover:bg-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(img)}
                    aria-label="Eliminar"
                    className="rounded-lg p-1.5 bg-white/90 text-error hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
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
              styleSlug: editing.styleSlug,
              setSlug: editing.setSlug,
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
        title="Eliminar imagen"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
