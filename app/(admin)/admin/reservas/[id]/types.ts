import type { ReservationStatus } from '@prisma/client';

export interface SerializedReservation {
  id: string;
  status: ReservationStatus;
  startsAt: Date;
  endsAt: Date;
  childName: string | null;
  childAge: number | null;
  notes: string | null;
  totalAmount: number;
  expiresAt: Date | null;
  tier: string | null;
  customSetDescription: string | null;
  isExperienciaCompleta: boolean;
  eventDurationHours: number | null;
  eventPrice: number | null;
  comboDiscount: number | null;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  style: {
    name: string;
    slug: string;
    type: string;
  };
  styleSet: {
    name: string;
    slug: string;
    isCustom: boolean;
  } | null;
  payment: {
    status: string;
    amount: number;
    paidAt: Date | null;
    externalId: string | null;
  } | null;
}
