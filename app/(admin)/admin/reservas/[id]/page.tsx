import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { prisma } from '@/lib/db/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { STATUS_LABELS } from '@/lib/reservations/transitions';
import { ClientBlock } from './ClientBlock';
import { SessionBlock } from './SessionBlock';
import { PaymentBlock } from './PaymentBlock';
import { NotesBlock } from './NotesBlock';
import { StatusChanger } from './StatusChanger';
import type { SerializedReservation } from './types';

export const dynamic = 'force-dynamic';

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const r = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      style: { select: { name: true, slug: true, type: true } },
      styleSet: { select: { name: true, slug: true, isCustom: true } },
      payment: { select: { status: true, amount: true, paidAt: true, externalId: true } },
    },
  });

  if (!r) notFound();

  const serialized: SerializedReservation = {
    id: r.id,
    status: r.status,
    startsAt: r.startsAt,
    endsAt: r.endsAt,
    childName: r.childName,
    childAge: r.childAge,
    notes: r.notes,
    totalAmount: r.totalAmount.toNumber(),
    expiresAt: r.expiresAt,
    tier: r.tier,
    customSetDescription: r.customSetDescription,
    isExperienciaCompleta: r.isExperienciaCompleta,
    eventDurationHours: r.eventDurationHours,
    eventPrice: r.eventPrice?.toNumber() ?? null,
    comboDiscount: r.comboDiscount?.toNumber() ?? null,
    createdAt: r.createdAt,
    user: r.user,
    style: r.style,
    styleSet: r.styleSet,
    payment: r.payment
      ? {
          status: r.payment.status,
          amount: r.payment.amount.toNumber(),
          paidAt: r.payment.paidAt,
          externalId: r.payment.externalId,
        }
      : null,
  };

  return (
    <>
      <Link
        href="/admin/reservas"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface mb-4"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
        Volver a reservas
      </Link>

      <PageHeader
        title={`Reserva — ${r.user.name ?? r.user.email}`}
        description={`${r.style.name} · ${STATUS_LABELS[r.status]}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ClientBlock reservation={serialized} />
          <SessionBlock reservation={serialized} />
          <NotesBlock reservationId={r.id} initialNotes={r.notes} />
        </div>
        <div className="space-y-6">
          <StatusChanger reservationId={r.id} currentStatus={r.status} />
          <PaymentBlock reservation={serialized} />
        </div>
      </div>
    </>
  );
}
