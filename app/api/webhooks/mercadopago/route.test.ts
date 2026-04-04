import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  applyRateLimit: vi.fn(),
  buildRateLimitHeaders: vi.fn(),
  getClientIp: vi.fn(),
  paymentGet: vi.fn(),
  eventLogCreate: vi.fn(),
  paymentUpsert: vi.fn(),
  reservationUpdateMany: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  env: {
    MERCADOPAGO_WEBHOOK_SECRET: "secret",
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  applyRateLimit: mocks.applyRateLimit,
  buildRateLimitHeaders: mocks.buildRateLimitHeaders,
  getClientIp: mocks.getClientIp,
}));

vi.mock("@/lib/mercadopago", () => ({
  mpPayment: {
    get: mocks.paymentGet,
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    paymentEventLog: {
      create: mocks.eventLogCreate,
    },
    payment: {
      upsert: mocks.paymentUpsert,
    },
    reservation: {
      updateMany: mocks.reservationUpdateMany,
    },
  },
}));

import { POST } from "@/app/api/webhooks/mercadopago/route";

describe("POST /api/webhooks/mercadopago", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientIp.mockReturnValue("200.1.1.1");
    mocks.buildRateLimitHeaders.mockReturnValue({
      "X-RateLimit-Remaining": "100",
      "X-RateLimit-Reset": "9999",
      "Retry-After": "60",
    });
  });

  it("returns 429 when webhook rate limit is exceeded", async () => {
    mocks.applyRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 1000,
      retryAfterSeconds: 1,
    });

    const response = await POST(
      new Request("http://localhost/api/webhooks/mercadopago?type=payment&data.id=1", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(429);
    expect(mocks.paymentGet).not.toHaveBeenCalled();
  });

  it("processes payment webhook and updates payment + reservation", async () => {
    mocks.applyRateLimit.mockReturnValue({
      allowed: true,
      remaining: 119,
      resetAt: Date.now() + 60_000,
      retryAfterSeconds: 60,
    });

    mocks.paymentGet.mockResolvedValue({
      id: 123,
      status: "approved",
      status_detail: "accredited",
      external_reference: "ext_123",
      transaction_amount: 2500,
    });

    mocks.eventLogCreate.mockResolvedValue({});
    mocks.paymentUpsert.mockResolvedValue({});
    mocks.reservationUpdateMany.mockResolvedValue({ count: 1 });

    const response = await POST(
      new Request("http://localhost/api/webhooks/mercadopago?type=payment&data.id=123", {
        method: "POST",
        headers: {
          "x-signature": "ts=1,v1=abc",
          "x-request-id": "req_1",
        },
      }),
    );

    expect(response.status).toBe(204);
    expect(mocks.paymentGet).toHaveBeenCalledWith({ id: "123" });
    expect(mocks.eventLogCreate).toHaveBeenCalledOnce();
    expect(mocks.paymentUpsert).toHaveBeenCalledOnce();
    expect(mocks.reservationUpdateMany).toHaveBeenCalledOnce();
  });

  it("ignores non-payment events and still returns 204", async () => {
    mocks.applyRateLimit.mockReturnValue({
      allowed: true,
      remaining: 119,
      resetAt: Date.now() + 60_000,
      retryAfterSeconds: 60,
    });

    const response = await POST(
      new Request("http://localhost/api/webhooks/mercadopago?type=merchant_order", {
        method: "POST",
      }),
    );

    expect(response.status).toBe(204);
    expect(mocks.paymentGet).not.toHaveBeenCalled();
  });
});
