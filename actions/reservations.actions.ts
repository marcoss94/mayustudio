'use server';

import { revalidatePath } from 'next/cache';
import { Prisma, type ReservationStatus } from '@prisma/client';
import { prisma } from '@/lib/db/client';
import { auth } from '@/lib/auth';
import { isValidTransition } from '@/lib/reservations/transitions';
import { notesSchema, reservationStatusEnum } from '@/lib/validations/reservations';
import type { ActionResult, Reservation } from '@/types';

async function requireAdmin(): Promise<{ success: false; error: string } | null> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
    return { success: false, error: 'No autorizado' };
  }
  return null;
}

function mapPrismaError(err: unknown, fallback = 'Error en la operación'): string {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return 'Reserva no encontrada';
    if (err.code === 'P2003') return 'Reserva con dependencias bloqueantes';
  }
  return fallback;
}

function revalidateReservations(id?: string) {
  revalidatePath('/admin/reservas');
  revalidatePath('/admin');
  if (id) revalidatePath(`/admin/reservas/${id}`);
}

export async function updateReservationStatus(
  id: string,
  rawStatus: ReservationStatus,
): Promise<ActionResult<Reservation>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = reservationStatusEnum.safeParse(rawStatus);
  if (!parsed.success) {
    return { success: false, error: 'Estado inválido' };
  }
  const newStatus = parsed.data;

  try {
    const current = await prisma.reservation.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current) return { success: false, error: 'Reserva no encontrada' };

    if (!isValidTransition(current.status, newStatus)) {
      return {
        success: false,
        error: `Transición no permitida (${current.status} → ${newStatus})`,
      };
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidateReservations(id);
    return { success: true, data: reservation };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudo actualizar el estado') };
  }
}

export async function updateReservationNotes(
  id: string,
  rawNotes: string | null,
): Promise<ActionResult<Reservation>> {
  const guard = await requireAdmin();
  if (guard) return guard;

  const parsed = notesSchema.safeParse(rawNotes);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Notas inválidas' };
  }

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { notes: parsed.data },
    });
    revalidateReservations(id);
    return { success: true, data: reservation };
  } catch (err) {
    return { success: false, error: mapPrismaError(err, 'No se pudieron guardar las notas') };
  }
}
