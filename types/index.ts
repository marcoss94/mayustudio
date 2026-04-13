/**
 * types/index.ts — Barrel de tipos compartidos del dominio
 *
 * Re-exporta tipos de Prisma Client que se usan frecuentemente en
 * Server Components, Server Actions y utilidades de la app.
 *
 * NOTA: Los tipos de dominio completos se agregarán en fases posteriores
 * (Phase 1: reservations flow, Phase 2: payments, etc.)
 *
 * Uso:
 *   import type { User, Service, Reservation } from '@/types';
 */

export type {
  User,
  Style,
  StyleSet,
  StyleExtra,
  ExperienciaCompletaConfig,
  Reservation,
  Payment,
  GalleryImage,
  WebhookEvent,
  // Enums
  UserRole,
  StyleType,
  ReservationStatus,
  PaymentStatus,
} from '@prisma/client';

// ─── Tipos de utilidad compartidos ────────────────────────────────────────────

/**
 * Extrae los campos públicos de un User (sin password ni datos sensibles).
 * Se completará en Phase 1 cuando se implemente el perfil de usuario.
 */
export type PublicUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: import('@prisma/client').UserRole;
};

/**
 * Tipo de respuesta estándar para Server Actions.
 * Permite discriminar éxito/error de forma typesafe.
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
