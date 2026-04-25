import { CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { SerializedReservation } from './types';

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  REFUNDED: 'Reintegrado',
  IN_PROCESS: 'En proceso',
};

export function PaymentBlock({ reservation }: { reservation: SerializedReservation }) {
  const p = reservation.payment;

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-lg italic text-on-surface">Pago</h2>
        <CreditCard className="w-4 h-4 text-on-surface-variant" strokeWidth={1.75} />
      </div>

      {!p ? (
        <p className="text-sm text-on-surface-variant">Sin información de pago todavía.</p>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">Estado</p>
            <p className="text-sm text-on-surface">{PAYMENT_LABELS[p.status] ?? p.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">Monto</p>
            <p className="text-sm text-on-surface">{formatCurrency(p.amount)}</p>
          </div>
          {p.paidAt && (
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">Pagado</p>
              <p className="text-sm text-on-surface">{formatDate(p.paidAt)}</p>
            </div>
          )}
          {p.externalId && (
            <div>
              <p className="text-xs uppercase tracking-wider text-on-surface-variant">ID externo</p>
              <p className="text-xs font-mono text-on-surface">{p.externalId}</p>
            </div>
          )}
        </div>
      )}

      <p className="mt-4 text-xs text-on-surface-variant italic">
        Gestión completa de pagos disponible en M6.
      </p>
    </section>
  );
}
