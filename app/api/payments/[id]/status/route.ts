import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
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
