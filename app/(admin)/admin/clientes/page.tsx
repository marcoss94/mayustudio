import { Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminClientesPage() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Listado de clientes, histórico de reservas y datos de contacto."
      />
      <EmptyState
        icon={Users}
        title="Módulo en construcción"
        description="Vista de clientes con filtros y detalle se activa en M7."
      />
    </>
  );
}
