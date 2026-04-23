'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';
import type { StyleType } from '@prisma/client';
import { Table } from '@/components/ui/Table';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency, cn } from '@/lib/utils';
import {
  deleteStyle,
  toggleStyleActive,
  toggleStyleVisible,
} from '@/actions/services.actions';

export interface StyleRow {
  id: string;
  name: string;
  slug: string;
  type: StyleType;
  priceLabel: string | null;
  setsCount: number;
  extrasCount: number;
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
}

const typeLabels: Record<StyleType, string> = {
  STANDARD: 'Standard',
  SETS_AND_TIERS: 'Sets & Tiers',
  SEASONAL: 'Temporada',
};

const typeBadgeClasses: Record<StyleType, string> = {
  STANDARD: 'bg-primary-container/60 text-primary',
  SETS_AND_TIERS: 'bg-secondary-container/60 text-on-secondary-container',
  SEASONAL: 'bg-tertiary-container/60 text-on-tertiary-container',
};

function TypeBadge({ type }: { type: StyleType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        typeBadgeClasses[type],
      )}
    >
      {typeLabels[type]}
    </span>
  );
}

function PriceCell({ row }: { row: StyleRow }) {
  if (!row.priceLabel) return <span className="text-on-surface-variant">—</span>;
  const parts = row.priceLabel.split(' – ');
  if (parts.length === 2) {
    return (
      <span className="text-sm">
        {formatCurrency(Number(parts[0]))} – {formatCurrency(Number(parts[1]))}
      </span>
    );
  }
  return <span className="text-sm">{formatCurrency(Number(row.priceLabel))}</span>;
}

export function StylesTable({ data }: { data: StyleRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<StyleRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const typeFilter = params.get('type') ?? '';
  const activeFilter = params.get('active') ?? '';

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (typeFilter && r.type !== typeFilter) return false;
      if (activeFilter === 'true' && !r.isActive) return false;
      if (activeFilter === 'false' && r.isActive) return false;
      return true;
    });
  }, [data, typeFilter, activeFilter]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`?${next.toString()}`, { scroll: false });
  }

  async function handleToggle(
    fn: typeof toggleStyleActive,
    id: string,
    value: boolean,
  ) {
    setError(null);
    const res = await fn(id, value);
    if (!res.success) {
      setError(res.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    setError(null);
    const res = await deleteStyle(pendingDelete.id);
    if (!res.success) {
      setError(res.error);
      return;
    }
    startTransition(() => router.refresh());
  }

  const columns = useMemo<ColumnDef<StyleRow, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
          <div>
            <Link
              href={`/admin/servicios/${row.original.id}`}
              className="font-medium text-on-surface hover:text-primary"
            >
              {row.original.name}
            </Link>
            <p className="text-xs text-on-surface-variant">/{row.original.slug}</p>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Tipo',
        cell: ({ row }) => <TypeBadge type={row.original.type} />,
      },
      {
        id: 'price',
        header: 'Precio',
        cell: ({ row }) => <PriceCell row={row.original} />,
        enableSorting: false,
      },
      {
        accessorKey: 'setsCount',
        header: 'Sets',
        cell: ({ row }) =>
          row.original.type === 'SETS_AND_TIERS' ? (
            <span>{row.original.setsCount}</span>
          ) : (
            <span className="text-on-surface-variant">—</span>
          ),
      },
      {
        accessorKey: 'extrasCount',
        header: 'Extras',
        cell: ({ row }) =>
          row.original.extrasCount > 0 ? (
            <span>{row.original.extrasCount}</span>
          ) : (
            <span className="text-on-surface-variant">—</span>
          ),
      },
      {
        accessorKey: 'isActive',
        header: 'Activo',
        enableSorting: false,
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive}
            onCheckedChange={(v) => handleToggle(toggleStyleActive, row.original.id, v)}
          />
        ),
      },
      {
        accessorKey: 'isVisible',
        header: 'Visible',
        enableSorting: false,
        cell: ({ row }) => (
          <Switch
            checked={row.original.isVisible}
            onCheckedChange={(v) => handleToggle(toggleStyleVisible, row.original.id, v)}
          />
        ),
      },
      {
        accessorKey: 'displayOrder',
        header: 'Orden',
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/admin/servicios/${row.original.id}`}
              aria-label="Editar"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <Pencil className="w-4 h-4" strokeWidth={1.75} />
            </Link>
            <button
              type="button"
              aria-label="Eliminar"
              onClick={() => setPendingDelete(row.original)}
              className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          label="Tipo"
          value={typeFilter}
          onChange={(e) => setParam('type', e.target.value)}
          placeholder="Todos"
          options={[
            { value: '', label: 'Todos' },
            { value: 'STANDARD', label: 'Standard' },
            { value: 'SETS_AND_TIERS', label: 'Sets & Tiers' },
            { value: 'SEASONAL', label: 'Temporada' },
          ]}
          containerClassName="sm:w-56"
        />
        <Select
          label="Estado"
          value={activeFilter}
          onChange={(e) => setParam('active', e.target.value)}
          options={[
            { value: '', label: 'Todos' },
            { value: 'true', label: 'Activos' },
            { value: 'false', label: 'Inactivos' },
          ]}
          containerClassName="sm:w-44"
        />
      </div>

      <Table
        data={filtered}
        columns={columns}
        emptyMessage="No hay estilos. Creá el primero."
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        title={`Eliminar ${pendingDelete?.name ?? ''}`}
        description="Esta acción no se puede deshacer. Si el estilo tiene reservas, usá el toggle de activo."
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
