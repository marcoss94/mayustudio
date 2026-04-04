import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { mpPreference } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      amount?: number;
    };

    const amount = body.amount ?? 1000;
    const title = body.title ?? "Reserva Mayu Studio";

    // 1. Crear reserva en DB
    const reservation = await prisma.reservation.create({
      data: {
        externalReference: crypto.randomUUID(),
        totalAmount: amount,
        currency: "UYU",
      },
    });

    // 2. Crear preference en Mercado Pago (patrón Fazt adaptado a SDK v2)
    const preference = await mpPreference.create({
      body: {
        external_reference: reservation.externalReference,
        notification_url: `${env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        items: [
          {
            id: reservation.id,
            title,
            quantity: 1,
            unit_price: amount,
            currency_id: "UYU",
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

    // 3. Guardar payment pendiente
    await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        externalReference: reservation.externalReference,
        providerPreferenceId: preference.id,
        amount,
        status: "pending",
      },
    });

    // 4. Devolver URLs de checkout
    return NextResponse.json({
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creando preference:", error);
    return NextResponse.json(
      { error: "No se pudo crear la preferencia" },
      { status: 500 },
    );
  }
}
