import { NextResponse } from "next/server";
import { z } from "zod";

import { PaymentStatus, Prisma } from "@/app/generated/prisma/client";
import { env } from "@/lib/env";
import { mpPreferenceClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

const createPreferenceSchema = z.object({
  title: z.string().min(3).default("Reserva estudio fotográfico"),
  amount: z.number().positive(),
  currency: z.string().default("ARS"),
  payerEmail: z.string().email().optional(),
  reservationId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = createPreferenceSchema.parse(await request.json());

    const reservation = payload.reservationId
      ? await prisma.reservation.findUnique({ where: { id: payload.reservationId } })
      : await prisma.reservation.create({
          data: {
            externalReference: crypto.randomUUID(),
            totalAmount: payload.amount,
            currency: payload.currency,
          },
        });

    if (!reservation) {
      return NextResponse.json(
        { error: "No se encontró la reserva indicada" },
        { status: 404 },
      );
    }

    const response = await mpPreferenceClient.create({
      body: {
        external_reference: reservation.externalReference,
        payer: payload.payerEmail ? { email: payload.payerEmail } : undefined,
        items: [
          {
            id: reservation.id,
            title: payload.title,
            quantity: 1,
            unit_price: payload.amount,
            currency_id: payload.currency,
          },
        ],
        back_urls: {
          success: `${env.NEXT_PUBLIC_APP_URL}/pago/success`,
          pending: `${env.NEXT_PUBLIC_APP_URL}/pago/pending`,
          failure: `${env.NEXT_PUBLIC_APP_URL}/pago/failure`,
        },
        auto_return: "approved",
      },
    });

    const payment = await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        externalReference: reservation.externalReference,
        providerPreferenceId: response.id,
        amount: payload.amount,
        status: PaymentStatus.pending,
        rawLatestPayload: JSON.parse(
          JSON.stringify(response),
        ) as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      reservationId: reservation.id,
      paymentId: payment.id,
      preferenceId: response.id,
      checkoutUrl: response.init_point,
      checkoutSandboxUrl: response.sandbox_init_point,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Payload inválido", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "No se pudo crear la preferencia de pago",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
