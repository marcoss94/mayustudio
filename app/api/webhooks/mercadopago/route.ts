/**
 * app/api/webhooks/mercadopago/route.ts — Webhook receptor de MercadoPago
 *
 * PLACEHOLDER — Phase 0
 *
 * En Phase 2 (payments) se implementará la lógica real:
 * - Verificar firma HMAC del webhook
 * - Parsear el evento (payment.created, payment.updated, etc.)
 * - Actualizar estado de Reservation y Payment en DB
 * - Disparar notificaciones (email via Resend)
 *
 * Por ahora simplemente retorna 200 para que MercadoPago no reintente.
 */

import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  // TODO Phase 2: implementar verificación de firma y procesamiento del evento
  return NextResponse.json({ received: true }, { status: 200 });
}
