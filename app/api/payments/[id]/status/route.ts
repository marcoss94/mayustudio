import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, getClientIp } from "@/lib/security";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const token = request.headers.get("x-internal-api-token");
  if (!env.INTERNAL_API_TOKEN || token !== env.INTERNAL_API_TOKEN) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientIp = getClientIp(request.headers);
  const rateLimit = enforceRateLimit({
    key: `payment-status:${clientIp}`,
    limit: 60,
    windowMs: 60_000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit excedido" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const { id } = await context.params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      reservation: true,
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: payment.id,
    status: payment.status,
    statusDetail: payment.statusDetail,
    providerPaymentId: payment.providerPaymentId,
    reservation: payment.reservation
      ? {
          id: payment.reservation.id,
          status: payment.reservation.status,
          externalReference: payment.reservation.externalReference,
        }
      : null,
  });
}
