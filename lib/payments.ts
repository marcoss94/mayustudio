import { PaymentStatus, ReservationStatus } from "@prisma/client";

const MP_STATUS_MAP: Record<string, PaymentStatus> = {
  approved: "approved",
  authorized: "authorized",
  in_process: "in_process",
  pending: "pending",
  rejected: "rejected",
  cancelled: "cancelled",
  refunded: "refunded",
  charged_back: "chargeback",
};

export function mapMpStatus(mpStatus?: string | null): PaymentStatus {
  return MP_STATUS_MAP[mpStatus ?? ""] ?? "unknown";
}

export function reservationStatusFromPayment(
  ps: PaymentStatus,
): ReservationStatus {
  if (ps === "approved" || ps === "authorized") return "confirmed";
  if (ps === "pending" || ps === "in_process") return "payment_processing";
  if (ps === "refunded" || ps === "chargeback") return "cancelled";
  return "pending_payment";
}
