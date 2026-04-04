import crypto from "node:crypto";

import { Prisma } from "@prisma/client";

import { env } from "@/lib/env";
import { mpPayment } from "@/lib/mercadopago";
import { mapMpStatus, reservationStatusFromPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

/**
 * Valida firma x-signature de Mercado Pago.
 * Docs: https://www.mercadopago.com/developers/es/docs/checkout-pro/payment-notifications
 *
 * Template: id:[data.id];request-id:[x-request-id];ts:[ts];
 * Se calcula HMAC SHA256 con el secret y se compara con v1 del header.
 */
function validateSignature(options: {
  xSignature: string;
  xRequestId: string;
  dataId: string;
  secret: string;
}): boolean {
  // 1. Extraer ts y v1 del header x-signature
  const parts = options.xSignature.split(",");
  let ts: string | undefined;
  let hash: string | undefined;

  for (const part of parts) {
    const [key, value] = part.split("=", 2);
    if (!key || !value) continue;
    const k = key.trim();
    const v = value.trim();
    if (k === "ts") ts = v;
    if (k === "v1") hash = v;
  }

  if (!ts || !hash) return false;

  // 2. Armar manifest con template oficial de MP
  const manifest = `id:${options.dataId};request-id:${options.xRequestId};ts:${ts};`;
  console.log("[webhook-debug] manifest:", manifest);

  // 3. Calcular HMAC SHA256
  const expected = crypto
    .createHmac("sha256", options.secret)
    .update(manifest)
    .digest("hex");

  // 4. Comparar (timing-safe)
  if (expected.length !== hash.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(hash, "hex"),
  );
}

/**
 * Webhook de Mercado Pago:
 * 1. Validar firma x-signature (si hay secret configurado)
 * 2. Leer query params (type, data.id)
 * 3. Si type === "payment", consultar API de MP por el ID real
 * 4. Persistir estado en DB
 * 5. Responder 204
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") ?? url.searchParams.get("topic");
    const dataId = url.searchParams.get("data.id");

    // --- Validación de firma ---
    if (env.MERCADOPAGO_WEBHOOK_SECRET && dataId) {
      const xSignature = request.headers.get("x-signature");
      const xRequestId = request.headers.get("x-request-id");

      if (!xSignature || !xRequestId) {
        console.warn("[webhook] Faltan headers x-signature o x-request-id");
        return new Response(null, { status: 401 });
      }

      const isValid = validateSignature({
        xSignature,
        xRequestId,
        dataId,
        secret: env.MERCADOPAGO_WEBHOOK_SECRET,
      });

      if (!isValid) {
        console.warn("[webhook] Firma inválida", {
          dataId,
          xRequestId,
          xSignature: xSignature.substring(0, 40) + "...",
          queryParams: url.search,
        });
        return new Response(null, { status: 401 });
      }

      console.log("[webhook] Firma validada OK");
    }

    // --- Procesar evento de pago ---
    console.log("[webhook] type:", type, "data.id:", dataId);

    if (type === "payment" && dataId) {
      const mpData = await mpPayment.get({ id: dataId });

      console.log("[webhook] MP status:", mpData.status, mpData.status_detail);

      const mappedStatus = mapMpStatus(mpData.status);

      // Auditoría
      await prisma.paymentEventLog.create({
        data: {
          providerEventId: `payment:${dataId}`,
          eventType: "payment",
          payload: JSON.parse(JSON.stringify(mpData)) as Prisma.InputJsonValue,
          processingState: "processed",
          processedAt: new Date(),
        },
      });

      // Actualizar Payment
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

      // Actualizar Reservation
      if (mpData.external_reference) {
        await prisma.reservation.updateMany({
          where: { externalReference: mpData.external_reference },
          data: { status: reservationStatusFromPayment(mappedStatus) },
        });
      }
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[webhook] Error procesando:", error);
    return new Response(null, { status: 200 });
  }
}
