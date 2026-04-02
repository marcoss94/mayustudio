import { NextResponse } from "next/server";

import { PaymentStatus, Prisma } from "@prisma/client";
import { env } from "@/lib/env";
import { mpPaymentClient } from "@/lib/mercadopago";
import { mapMercadoPagoStatus, mapReservationStatusFromPayment } from "@/lib/payments";
import { prisma } from "@/lib/prisma";

type MercadoPagoWebhookPayload = {
  id?: number;
  action?: string;
  type?: string;
  topic?: string;
  resource?: string;
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
  const eventType =
    payload.type ?? payload.topic ?? url.searchParams.get("topic") ?? "unknown";
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
    let paymentIdForLookup = eventId;

    if (eventType === "merchant_order" && payload.resource) {
      const merchantOrderResponse = await fetch(payload.resource, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!merchantOrderResponse.ok) {
        throw new Error(
          `merchant_order lookup failed (${merchantOrderResponse.status})`,
        );
      }

      const merchantOrder = (await merchantOrderResponse.json()) as {
        payments?: Array<{ id?: number | string }>;
      };

      const firstPaymentId = merchantOrder.payments?.[0]?.id;

      if (!firstPaymentId) {
        throw new Error("merchant_order sin payments asociadas");
      }

      paymentIdForLookup = String(firstPaymentId);
    }

    const mpPayment = await mpPaymentClient.get({ id: paymentIdForLookup });
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
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error);

    await prisma.paymentEventLog.update({
      where: { id: eventLog.id },
      data: {
        processingState: "failed",
        processingError: errorMessage,
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
