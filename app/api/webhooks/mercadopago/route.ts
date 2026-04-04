import { Prisma } from "@prisma/client";

import { mpPayment } from "@/lib/mercadopago";
import { mapMpStatus, reservationStatusFromPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

/**
 * Webhook de Mercado Pago — patrón simple (inspirado en Fazt):
 * 1. Leer query params (type, data.id)
 * 2. Si type === "payment", consultar API de MP por el ID real
 * 3. Persistir estado en DB
 * 4. Responder 204 (sin cuerpo)
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);

    // MP envía type y data.id como query params Y como body
    const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
    const dataId = url.searchParams.get("data.id");

    console.log("[webhook] type:", type, "data.id:", dataId);

    if (type === "payment" && dataId) {
      // Consultar pago real en API de Mercado Pago
      const mpData = await mpPayment.get({ id: dataId });

      console.log("[webhook] MP payment status:", mpData.status, mpData.status_detail);

      const mappedStatus = mapMpStatus(mpData.status);

      // Guardar evento para auditoría
      await prisma.paymentEventLog.create({
        data: {
          providerEventId: `payment:${dataId}`,
          eventType: "payment",
          payload: JSON.parse(JSON.stringify(mpData)) as Prisma.InputJsonValue,
          processingState: "processed",
          processedAt: new Date(),
        },
      });

      // Actualizar o crear Payment en DB
      await prisma.payment.upsert({
        where: { providerPaymentId: String(mpData.id) },
        update: {
          status: mappedStatus,
          statusDetail: mpData.status_detail ?? null,
          externalReference: mpData.external_reference ?? null,
          amount:
            typeof mpData.transaction_amount === "number"
              ? mpData.transaction_amount
              : undefined,
          rawLatestPayload: JSON.parse(
            JSON.stringify(mpData),
          ) as Prisma.InputJsonValue,
        },
        create: {
          providerPaymentId: String(mpData.id),
          status: mappedStatus,
          statusDetail: mpData.status_detail ?? null,
          externalReference: mpData.external_reference ?? null,
          amount:
            typeof mpData.transaction_amount === "number"
              ? mpData.transaction_amount
              : undefined,
          rawLatestPayload: JSON.parse(
            JSON.stringify(mpData),
          ) as Prisma.InputJsonValue,
        },
      });

      // Actualizar reserva si corresponde
      if (mpData.external_reference) {
        await prisma.reservation.updateMany({
          where: { externalReference: mpData.external_reference },
          data: { status: reservationStatusFromPayment(mappedStatus) },
        });
      }
    }

    // Siempre responder 204 para que MP no reintente
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[webhook] Error procesando:", error);
    // Aun con error, devolver 200 para evitar reintentos infinitos
    return new Response(null, { status: 200 });
  }
}
