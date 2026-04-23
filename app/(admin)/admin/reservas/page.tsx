import { Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AdminReservasPage() {
  return (
    <>
      <PageHeader
        title="Reservas"
        description="Gestioná las reservas del estudio — filtrá por estado, editá estados y revisá pagos."
      />
      <EmptyState
        icon={Calendar}
        title="Módulo en construcción"
        description="Listado, filtros y edición de estados se activan en el siguiente milestone (M5)."
      />
    </>
  );
}
