import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  applyRateLimit: vi.fn(),
  buildRateLimitHeaders: vi.fn(),
  getClientIp: vi.fn(),
  preferenceCreate: vi.fn(),
  reservationCreate: vi.fn(),
  paymentCreate: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_APP_URL: "http://localhost:3000" },
}));

vi.mock("@/lib/rate-limit", () => ({
  applyRateLimit: mocks.applyRateLimit,
  buildRateLimitHeaders: mocks.buildRateLimitHeaders,
  getClientIp: mocks.getClientIp,
}));

vi.mock("@/lib/mercadopago", () => ({
  mpPreference: {
    create: mocks.preferenceCreate,
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    reservation: { create: mocks.reservationCreate },
    payment: { create: mocks.paymentCreate },
  },
}));

import { POST } from "@/app/api/payments/mercadopago/preference/route";

describe("POST /api/payments/mercadopago/preference", () => {
  beforeEach(() => {
    mocks.getClientIp.mockReturnValue("1.2.3.4");
    mocks.buildRateLimitHeaders.mockReturnValue({
      "X-RateLimit-Remaining": "9",
      "X-RateLimit-Reset": "9999",
      "Retry-After": "60",
    });
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mocks.applyRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 1000,
      retryAfterSeconds: 1,
    });

    const response = await POST(
      new Request("http://localhost/api/payments/mercadopago/preference", {
        method: "POST",
        body: JSON.stringify({ amount: 1000, title: "Test" }),
      }),
    );

    expect(response.status).toBe(429);
    expect(mocks.reservationCreate).not.toHaveBeenCalled();
    expect(mocks.preferenceCreate).not.toHaveBeenCalled();
  });

  it("creates reservation, preference and payment successfully", async () => {
    mocks.applyRateLimit.mockReturnValue({
      allowed: true,
      remaining: 9,
      resetAt: Date.now() + 60_000,
      retryAfterSeconds: 60,
    });

    mocks.reservationCreate.mockResolvedValue({
      id: "res_1",
      externalReference: "ext_1",
    });

    mocks.preferenceCreate.mockResolvedValue({
      id: "pref_1",
      init_point: "https://checkout.example/init",
      sandbox_init_point: "https://checkout.example/sandbox",
    });

    mocks.paymentCreate.mockResolvedValue({ id: "pay_1" });

    const response = await POST(
      new Request("http://localhost/api/payments/mercadopago/preference", {
        method: "POST",
        body: JSON.stringify({ amount: 1500, title: "Reserva" }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload).toEqual({
      init_point: "https://checkout.example/init",
      sandbox_init_point: "https://checkout.example/sandbox",
    });

    expect(mocks.reservationCreate).toHaveBeenCalledOnce();
    expect(mocks.preferenceCreate).toHaveBeenCalledOnce();
    expect(mocks.paymentCreate).toHaveBeenCalledOnce();
  });
});
