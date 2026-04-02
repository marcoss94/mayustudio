import { PaymentStatus, ReservationStatus } from "@prisma/client";

export function mapMercadoPagoStatus(status?: string | null): PaymentStatus {
  switch (status) {
    case "approved":
      return PaymentStatus.approved;
    case "authorized":
      return PaymentStatus.authorized;
    case "in_process":
      return PaymentStatus.in_process;
    case "rejected":
      return PaymentStatus.rejected;
    case "cancelled":
      return PaymentStatus.cancelled;
    case "refunded":
      return PaymentStatus.refunded;
    case "charged_back":
      return PaymentStatus.chargeback;
    case "pending":
      return PaymentStatus.pending;
    default:
      return PaymentStatus.unknown;
  }
}

export function mapReservationStatusFromPayment(
  paymentStatus: PaymentStatus,
): ReservationStatus {
  switch (paymentStatus) {
    case PaymentStatus.approved:
    case PaymentStatus.authorized:
      return ReservationStatus.confirmed;
    case PaymentStatus.pending:
    case PaymentStatus.in_process:
      return ReservationStatus.payment_processing;
    case PaymentStatus.rejected:
    case PaymentStatus.cancelled:
      return ReservationStatus.pending_payment;
    case PaymentStatus.refunded:
    case PaymentStatus.chargeback:
      return ReservationStatus.cancelled;
    default:
      return ReservationStatus.pending_payment;
  }
}
