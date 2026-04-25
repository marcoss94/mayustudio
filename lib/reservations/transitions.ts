import type { ReservationStatus } from '@prisma/client';

export const STATUS_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED'],
  PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED', 'EXPIRED'],
  CONFIRMED: ['CANCELLED', 'COMPLETED'],
  EXPIRED: ['CONFIRMED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
};

export function getValidTransitions(from: ReservationStatus): ReservationStatus[] {
  return STATUS_TRANSITIONS[from] ?? [];
}

export function isValidTransition(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  DRAFT: 'Borrador',
  PENDING_PAYMENT: 'Pago pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  EXPIRED: 'Expirada',
  COMPLETED: 'Completada',
};
