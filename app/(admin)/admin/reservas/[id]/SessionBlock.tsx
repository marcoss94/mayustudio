import { Calendar, Clock, Tag, DollarSign, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { SerializedReservation } from './types';

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-on-surface-variant mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</p>
        <div className="text-sm text-on-surface">{value}</div>
      </div>
    </div>
  );
}

export function SessionBlock({ reservation }: { reservation: SerializedReservation }) {
  const r = reservation;
  const tierLabel = r.tier === 'premium' ? 'Premium' : r.tier === 'standard' ? 'Standard' : null;

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-lg italic text-on-surface mb-4">Sesión</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Row
          icon={Tag}
          label="Estilo"
          value={
            <>
              <span>{r.style.name}</span>
              {r.styleSet && (
                <span className="text-on-surface-variant"> · {r.styleSet.name}</span>
              )}
              {tierLabel && <span className="text-on-surface-variant"> · {tierLabel}</span>}
            </>
          }
        />
        {r.isExperienciaCompleta && (
          <Row
            icon={Sparkles}
            label="Experiencia Completa"
            value={
              <span>
                {r.eventDurationHours}h
                {r.eventPrice && ` · ${formatCurrency(r.eventPrice)}`}
                {r.comboDiscount && (
                  <span className="text-tertiary"> · −{formatCurrency(r.comboDiscount)} combo</span>
                )}
              </span>
            }
          />
        )}
        <Row
          icon={Calendar}
          label="Inicio"
          value={formatDate(r.startsAt, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <Row
          icon={Clock}
          label="Fin"
          value={formatDate(r.endsAt, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <Row
          icon={DollarSign}
          label="Monto total"
          value={
            <span className="font-medium text-on-surface text-base">
              {formatCurrency(r.totalAmount)}
            </span>
          }
        />
      </div>

      {r.styleSet?.isCustom && r.customSetDescription && (
        <div className="mt-5 rounded-lg border border-outline-variant/30 bg-surface-container-low p-4">
          <p className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
            Descripción set personalizado
          </p>
          <p className="text-sm text-on-surface whitespace-pre-wrap">{r.customSetDescription}</p>
        </div>
      )}
    </section>
  );
}
