import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/50 bg-surface-container-lowest p-12 text-center">
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-primary-container/60 text-primary flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-serif text-lg italic font-semibold text-on-surface">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm text-on-surface-variant max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
