'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReservationStatus } from '@prisma/client';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  STATUS_LABELS,
  getValidTransitions,
} from '@/lib/reservations/transitions';
import { updateReservationStatus } from '@/actions/reservations.actions';

export function StatusChanger({
  reservationId,
  currentStatus,
}: {
  reservationId: string;
  currentStatus: ReservationStatus;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<ReservationStatus | ''>('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = getValidTransitions(currentStatus);
  const isTerminal = valid.length === 0;

  async function handleConfirm() {
    if (!target) return;
    setError(null);
    const res = await updateReservationStatus(reservationId, target);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setConfirming(false);
    setTarget('');
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-lg italic text-on-surface mb-3">Estado</h2>

      <div className="mb-4">
        <p className="text-xs uppercase tracking-wider text-on-surface-variant">Actual</p>
        <p className="text-sm font-medium text-on-surface">{STATUS_LABELS[currentStatus]}</p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-3 rounded-lg bg-error-container text-on-error-container px-3 py-2 text-sm"
        >
          {error}
        </div>
      )}

      {isTerminal ? (
        <p className="text-sm text-on-surface-variant italic">
          Estado terminal — no se puede cambiar.
        </p>
      ) : (
        <>
          <Select
            label="Cambiar a"
            value={target}
            onChange={(e) => setTarget(e.target.value as ReservationStatus | '')}
            placeholder="Elegí un estado…"
            options={valid.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="mt-3 w-full"
            disabled={!target}
            onClick={() => setConfirming(true)}
          >
            Aplicar cambio
          </Button>
        </>
      )}

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={handleConfirm}
        title="Confirmar cambio de estado"
        description={
          target
            ? `¿Cambiar de "${STATUS_LABELS[currentStatus]}" a "${STATUS_LABELS[target]}"?`
            : ''
        }
        confirmLabel="Confirmar"
      />
    </section>
  );
}
