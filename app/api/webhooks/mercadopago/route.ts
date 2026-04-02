import { NextResponse } from "next/server";

import { PaymentStatus, Prisma } from "@/app/generated/prisma/client";
import { mpPaymentClient } from "@/lib/mercadopago";
import { mapMercadoPagoStatus, mapReservationStatusFromPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

type MercadoPagoWebhookPayload = {
  id?: number;
  action?: string;
  type?: string;
  live_mode?: boolean;
  data?: {
    id?: string;
  };
};

function parseEventIdFromRequest(
  payload: MercadoPagoWebhookPayload,
  url: URL,
): string | null {
  const queryDataId = url.searchParams.get("data.id");
  const queryId = url.searchParams.get("id");
  const bodyDataId = payload.data?.id;
  const bodyId = payload.id;
  const fallbackBodyId = bodyId === undefined || bodyId === null ? null : String(bodyId);

  return queryDataId ?? queryId ?? bodyDataId ?? fallbackBodyId;
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const rawBody = await request.text();
  const payload = (rawBody ? JSON.parse(rawBody) : {}) as MercadoPagoWebhookPayload;
  const eventType = payload.type ?? url.searchParams.get("topic") ?? "unknown";
  const eventId = parseEventIdFromRequest(payload, url);

  if (!eventId) {
    return NextResponse.json(
      { error: "Webhook sin event/payment id" },
      { status: 400 },
    );
  }

  const providerEventId = `${eventType}:${eventId}`;
  const headers = Object.fromEntries(request.headers.entries());

  const existingEvent = await prisma.paymentEventLog.findUnique({
    where: {
      provider_providerEventId: {
        provider: "mercadopago",
        providerEventId,
      },
    },
  });

  if (existingEvent) {
    return NextResponse.json({ received: true, deduplicated: true });
  }

  const eventLog = await prisma.paymentEventLog.create({
    data: {
      providerEventId,
      eventType,
      action: payload.action,
      liveMode: payload.live_mode,
      payload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
      headers: JSON.parse(JSON.stringify(headers)) as Prisma.InputJsonValue,
      processingState: "received",
    },
  });

  try {
    const mpPayment = await mpPaymentClient.get({ id: eventId });
    const mappedStatus = mapMercadoPagoStatus(mpPayment.status);

    const payment = await prisma.payment.upsert({
      where: {
        providerPaymentId: String(mpPayment.id),
      },
      update: {
        status: mappedStatus,
        statusDetail: mpPayment.status_detail ?? null,
        externalReference: mpPayment.external_reference ?? null,
        amount:
          typeof mpPayment.transaction_amount === "number"
            ? mpPayment.transaction_amount
            : null,
        rawLatestPayload: JSON.parse(
          JSON.stringify(mpPayment),
        ) as Prisma.InputJsonValue,
      },
      create: {
        providerPaymentId: String(mpPayment.id),
        status: mappedStatus,
        statusDetail: mpPayment.status_detail ?? null,
        externalReference: mpPayment.external_reference ?? null,
        amount:
          typeof mpPayment.transaction_amount === "number"
            ? mpPayment.transaction_amount
            : null,
        rawLatestPayload: JSON.parse(
          JSON.stringify(mpPayment),
        ) as Prisma.InputJsonValue,
      },
    });

    if (payment.externalReference) {
      await prisma.reservation.updateMany({
        where: { externalReference: payment.externalReference },
        data: {
          status: mapReservationStatusFromPayment(mappedStatus),
        },
      });
    }

    await prisma.paymentEventLog.update({
      where: { id: eventLog.id },
      data: {
        processingState: "processed",
        processedAt: new Date(),
        paymentId: payment.id,
      },
    });

    return NextResponse.json({
      received: true,
      eventId: providerEventId,
      paymentId: payment.id,
      paymentStatus: mappedStatus,
    });
  } catch (error) {
    await prisma.paymentEventLog.update({
      where: { id: eventLog.id },
      data: {
        processingState: "failed",
        processingError: error instanceof Error ? error.message : "unknown",
      },
    });

    return NextResponse.json(
      {
        received: false,
        eventId: providerEventId,
        error: "No se pudo procesar el webhook",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.json(
      { error: "Debes enviar payment_id para reconciliar" },
      { status: 400 },
    );
  }

  const mpPayment = await mpPaymentClient.get({ id: paymentId });
  const mappedStatus: PaymentStatus = mapMercadoPagoStatus(mpPayment.status);

  const payment = await prisma.payment.upsert({
    where: {
      providerPaymentId: String(mpPayment.id),
    },
    update: {
      status: mappedStatus,
      statusDetail: mpPayment.status_detail ?? null,
      externalReference: mpPayment.external_reference ?? null,
      amount:
        typeof mpPayment.transaction_amount === "number"
          ? mpPayment.transaction_amount
          : null,
      rawLatestPayload: JSON.parse(
        JSON.stringify(mpPayment),
      ) as Prisma.InputJsonValue,
    },
    create: {
      providerPaymentId: String(mpPayment.id),
      status: mappedStatus,
      statusDetail: mpPayment.status_detail ?? null,
      externalReference: mpPayment.external_reference ?? null,
      amount:
        typeof mpPayment.transaction_amount === "number"
          ? mpPayment.transaction_amount
          : null,
      rawLatestPayload: JSON.parse(
        JSON.stringify(mpPayment),
      ) as Prisma.InputJsonValue,
    },
  });

  if (payment.externalReference) {
    await prisma.reservation.updateMany({
      where: { externalReference: payment.externalReference },
      data: {
        status: mapReservationStatusFromPayment(mappedStatus),
      },
    });
  }

  return NextResponse.json({
    paymentId: payment.id,
    providerPaymentId: payment.providerPaymentId,
    status: payment.status,
  });
}
