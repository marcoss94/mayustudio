'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import type { ReservationStatus } from '@prisma/client';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/reservations/transitions';

export interface ReservationRow {
  id: string;
  customerName: string | null;
  customerEmail: string;
  styleName: string;
  setName: string | null;
  tier: string | null;
  isExperienciaCompleta: boolean;
  startsAt: string;
  totalAmount: number;
  status: ReservationStatus;
}

export interface ReservationsTableProps {
  rows: ReservationRow[];
  styles: { slug: string; name: string }[];
}

const STATUS_BADGE: Record<ReservationStatus, string> = {
  DRAFT: 'bg-surface-container-high text-on-surface-variant',
  PENDING_PAYMENT: 'bg-secondary-container/60 text-on-secondary-container',
  CONFIRMED: 'bg-tertiary-container/60 text-on-tertiary-container',
  CANCELLED: 'bg-error-container text-on-error-container',
  EXPIRED: 'bg-surface-container text-on-surface-variant line-through',
  COMPLETED: 'bg-primary-container/60 text-primary',
};

function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_BADGE[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

const STATUS_OPTIONS: ReservationStatus[] = [
  'DRAFT',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'COMPLETED',
];

export function ReservationsTable({ rows, styles }: ReservationsTableProps) {
  const router = useRouter();
  const params = useSearchParams();

  const statusFilter = params.get('status') ?? '';
  const fromFilter = params.get('from') ?? '';
  const toFilter = params.get('to') ?? '';
  const styleFilter = params.get('style') ?? '';
  const qParam = params.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(qParam);

  // Debounce search → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput === qParam) return;
      const next = new URLSearchParams(params);
      if (searchInput) next.set('q', searchInput);
      else next.delete('q');
      router.push(`?${next.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`?${next.toString()}`, { scroll: false });
  }

  const columns = useMemo<ColumnDef<ReservationRow, unknown>[]>(
    () => [
      {
        accessorKey: 'customerName',
        header: 'Cliente',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-on-surface">
              {row.original.customerName ?? row.original.customerEmail}
            </p>
            {row.original.customerName && (
              <p className="text-xs text-on-surface-variant">{row.original.customerEmail}</p>
            )}
          </div>
        ),
      },
      {
        id: 'session',
        header: 'Sesión',
        enableSorting: false,
        cell: ({ row }) => {
          const r = row.original;
          if (r.isExperienciaCompleta) {
            return <span className="text-sm">Experiencia Completa</span>;
          }
          const tier = r.tier
            ? r.tier === 'premium'
              ? ' · Premium'
              : ' · Standard'
            : '';
          const set = r.setName ? ` · ${r.setName}` : '';
          return (
            <span className="text-sm">
              {r.styleName}
              {set}
              {tier}
            </span>
          );
        },
      },
      {
        accessorKey: 'startsAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">
            {formatDate(row.original.startsAt, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: 'Monto',
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">{formatCurrency(row.original.totalAmount)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <Link
            href={`/admin/reservas/${row.original.id}`}
            aria-label="Ver detalle"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-primary hover:bg-surface-container transition-colors"
          >
            <Eye className="w-4 h-4" strokeWidth={1.75} />
            Ver
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Select
          label="Estado"
          value={statusFilter}
          onChange={(e) => setParam('status', e.target.value)}
          options={[
            { value: '', label: 'Todos' },
            ...STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
          ]}
        />
        <Input
          label="Desde"
          type="date"
          value={fromFilter}
          onChange={(e) => setParam('from', e.target.value)}
        />
        <Input
          label="Hasta"
          type="date"
          value={toFilter}
          onChange={(e) => setParam('to', e.target.value)}
        />
        <Select
          label="Estilo"
          value={styleFilter}
          onChange={(e) => setParam('style', e.target.value)}
          options={[
            { value: '', label: 'Todos' },
            ...styles.map((s) => ({ value: s.slug, label: s.name })),
          ]}
        />
        <Input
          label="Buscar cliente"
          placeholder="Nombre o email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <Table
        data={rows}
        columns={columns}
        emptyMessage="No hay reservas con estos filtros."
      />
    </div>
  );
}
