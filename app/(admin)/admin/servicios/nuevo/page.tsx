import { PageHeader } from '@/components/layout/PageHeader';
import { StyleCreateForm } from './StyleCreateForm';

export default function NuevoServicioPage() {
  return (
    <>
      <PageHeader
        title="Nuevo estilo"
        description="Creá un estilo fotográfico. Podés agregar sets y extras después."
      />
      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 md:p-8">
        <StyleCreateForm />
      </div>
    </>
  );
}
