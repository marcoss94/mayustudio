import { User, Mail, Phone, Baby } from 'lucide-react';
import type { SerializedReservation } from './types';

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-on-surface-variant mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-on-surface-variant">{label}</p>
        <p className="text-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export function ClientBlock({ reservation }: { reservation: SerializedReservation }) {
  const { user, childName, childAge } = reservation;

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-lg italic text-on-surface mb-4">Cliente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          icon={User}
          label="Nombre"
          value={user.name ?? '—'}
        />
        <Field icon={Mail} label="Email" value={user.email} />
        {user.phone && <Field icon={Phone} label="Teléfono" value={user.phone} />}
        {childName && (
          <Field
            icon={Baby}
            label="Bebé"
            value={`${childName}${childAge ? ` · ${childAge} meses` : ''}`}
          />
        )}
      </div>
    </section>
  );
}
