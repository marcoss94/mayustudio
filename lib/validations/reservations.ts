import { z } from 'zod';

export const reservationStatusEnum = z.enum([
  'DRAFT',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'COMPLETED',
]);

export const notesSchema = z
  .string()
  .trim()
  .max(2000, 'Las notas no pueden superar 2000 caracteres')
  .optional()
  .nullable()
  .transform((v) => (v === '' || v == null ? null : v));

export type ReservationNotesInput = z.input<typeof notesSchema>;
export type ReservationStatusInput = z.infer<typeof reservationStatusEnum>;
