import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    payment: {
      findUnique: mocks.findUnique,
    },
  },
}));

import { GET } from "@/app/api/payments/[id]/status/route";

describe("GET /api/payments/[id]/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when payment does not exist", async () => {
    mocks.findUnique.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "missing" }),
    });

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({ error: "Pago no encontrado" });
  });

  it("returns projected payment status payload", async () => {
    mocks.findUnique.mockResolvedValue({
      id: "pay_1",
      status: "approved",
      statusDetail: "accredited",
      providerPaymentId: "123",
      reservation: {
        id: "res_1",
        status: "confirmed",
      },
    });

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "pay_1" }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      id: "pay_1",
      status: "approved",
      statusDetail: "accredited",
      providerPaymentId: "123",
      reservation: {
        id: "res_1",
        status: "confirmed",
      },
    });
  });
});
