import { describe, expect, it } from "vitest";

import { mapMpStatus, reservationStatusFromPayment } from "@/lib/payments";

describe("mapMpStatus", () => {
  it("maps known Mercado Pago statuses", () => {
    expect(mapMpStatus("approved")).toBe("approved");
    expect(mapMpStatus("in_process")).toBe("in_process");
    expect(mapMpStatus("charged_back")).toBe("chargeback");
  });

  it("falls back to unknown for undefined or unsupported status", () => {
    expect(mapMpStatus(undefined)).toBe("unknown");
    expect(mapMpStatus("foo_bar")).toBe("unknown");
  });
});

describe("reservationStatusFromPayment", () => {
  it("returns confirmed for approved and authorized", () => {
    expect(reservationStatusFromPayment("approved")).toBe("confirmed");
    expect(reservationStatusFromPayment("authorized")).toBe("confirmed");
  });

  it("returns payment_processing for pending and in_process", () => {
    expect(reservationStatusFromPayment("pending")).toBe("payment_processing");
    expect(reservationStatusFromPayment("in_process")).toBe(
      "payment_processing",
    );
  });

  it("returns cancelled for refunded and chargeback", () => {
    expect(reservationStatusFromPayment("refunded")).toBe("cancelled");
    expect(reservationStatusFromPayment("chargeback")).toBe("cancelled");
  });

  it("returns pending_payment as default branch", () => {
    expect(reservationStatusFromPayment("unknown")).toBe("pending_payment");
    expect(reservationStatusFromPayment("rejected")).toBe("pending_payment");
  });
});
