import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(63,43,34,0.04)]">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-primary-container/60 text-primary flex items-center justify-center">
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-on-surface">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
}
