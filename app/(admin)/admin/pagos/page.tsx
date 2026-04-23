import { CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminPagosPage() {
  return (
    <>
      <PageHeader
        title="Pagos"
        description="Historial de pagos y conciliación con MercadoPago."
      />
      <EmptyState
        icon={CreditCard}
        title="Módulo en construcción"
        description="Vista de pagos (read-only) se activa en M6."
      />
    </>
  );
}
