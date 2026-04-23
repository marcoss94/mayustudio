'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  emptyMessage?: string;
  enableSorting?: boolean;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  data,
  columns,
  emptyMessage = 'Sin datos.',
  enableSorting = true,
  className,
  onRowClick,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableSorting,
  });

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest',
        className,
      )}
    >
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-surface-container-low">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-outline-variant/20">
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={cn(
                      'px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold text-on-surface-variant',
                      canSort && 'cursor-pointer select-none',
                    )}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <span aria-hidden="true" className="text-on-surface-variant/70">
                          {sorted === 'asc' ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : sorted === 'desc' ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3" />
                          )}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-on-surface-variant"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  'border-b border-outline-variant/10 last:border-0 transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-surface-container/60',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle text-on-surface">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
