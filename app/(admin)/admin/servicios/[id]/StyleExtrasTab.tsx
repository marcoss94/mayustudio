'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/lib/utils';
import {
  createStyleExtra,
  updateStyleExtra,
  deleteStyleExtra,
  toggleStyleExtraActive,
} from '@/actions/services.actions';
import { styleExtraSchema, type StyleExtraInput } from '@/lib/validations/services';
import type { SerializedStyle, SerializedExtra } from './types';

function ExtraForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Partial<StyleExtraInput>;
  onSubmit: (data: StyleExtraInput) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StyleExtraInput>({
    resolver: zodResolver(styleExtraSchema) as unknown as Resolver<StyleExtraInput>,
    defaultValues: {
      name: initialData?.name ?? '',
      price: initialData?.price ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  async function submit(data: StyleExtraInput) {
    setServerError(null);
    const res = await onSubmit(data);
    if (!res.success) setServerError(res.error ?? 'Error');
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {serverError}
        </div>
      )}

      <Input
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Precio (ARS)"
        type="number"
        step="0.01"
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />
      <Switch
        checked={watch('isActive')}
        onCheckedChange={(v) => setValue('isActive', v, { shouldDirty: true })}
        label="Activo"
      />

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

export function StyleExtrasTab({ style }: { style: SerializedStyle }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SerializedExtra | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SerializedExtra | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(data: StyleExtraInput) {
    const res = await createStyleExtra(style.id, data);
    if (!res.success) return { success: false, error: res.error };
    setCreating(false);
    router.refresh();
    return { success: true };
  }

  async function handleUpdate(data: StyleExtraInput) {
    if (!editing) return { success: false, error: 'No extra' };
    const res = await updateStyleExtra(editing.id, data);
    if (!res.success) return { success: false, error: res.error };
    setEditing(null);
    router.refresh();
    return { success: true };
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    const res = await deleteStyleExtra(pendingDelete.id);
    if (!res.success) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleToggle(id: string, value: boolean) {
    setError(null);
    const res = await toggleStyleExtraActive(id, value);
    if (!res.success) setError(res.error);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-on-surface-variant">
          Extras/addons opcionales para este estilo.
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setCreating(true)}
        >
          <Plus className="w-4 h-4" />
          Nuevo extra
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

      {style.extras.length === 0 ? (
        <EmptyState
          title="Sin extras todavía"
          description="Creá el primer extra opcional."
        />
      ) : (
        <ul className="space-y-2 list-none">
          {style.extras.map((extra) => (
            <li
              key={extra.id}
              className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-on-surface truncate">{extra.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {formatCurrency(extra.price)}
                </p>
              </div>
              <Switch
                checked={extra.isActive}
                onCheckedChange={(v) => handleToggle(extra.id, v)}
              />
              <button
                type="button"
                onClick={() => setEditing(extra)}
                aria-label="Editar"
                className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(extra)}
                aria-label="Eliminar"
                className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Nuevo extra"
        size="md"
      >
        <ExtraForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title="Editar extra"
        size="md"
      >
        {editing && (
          <ExtraForm
            initialData={{
              name: editing.name,
              price: editing.price,
              isActive: editing.isActive,
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
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
