'use server';

/**
 * actions/contact.actions.ts — Server Action para el formulario de contacto
 *
 * Flujo:
 * 1. Rate limit por IP (Map en memoria — válido para estudio boutique)
 * 2. Validación Zod server-side
 * 3. Envío de email de notificación a la fotógrafa (Resend)
 * 4. Envío de email de confirmación al cliente (Resend)
 * 5. Retorna ActionResult<void>
 */

import { headers } from 'next/headers';
import * as Sentry from '@sentry/nextjs';
import { Resend } from 'resend';
import React from 'react';

import { contactSchema } from '@/lib/validations/contact';
import { ContactNotificationEmail } from '@/emails/contact-notification';
import { ContactConfirmationEmail } from '@/emails/contact-confirmation';
import type { ActionResult } from '@/types';

// ─── Rate limiting ───────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true; // Permitido
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false; // Bloqueado
  }

  entry.count += 1;
  return true; // Permitido
}

// ─── Server Action ───────────────────────────────────────────────────────────

export async function contactAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // 1. Obtener IP del cliente
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  // 2. Rate limiting
  if (!checkRateLimit(ip)) {
    return {
      success: false,
      error: 'Demasiados mensajes enviados. Intentá de nuevo en una hora.',
    };
  }

  // 3. Parsear datos del formulario
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    serviceSlug: formData.get('serviceSlug') || undefined,
    message: formData.get('message'),
  };

  // 4. Validación Zod server-side
  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    const firstError = result.error.issues[0];
    return {
      success: false,
      error: firstError?.message ?? 'Datos inválidos. Revisá el formulario.',
    };
  }

  const data = result.data;

  // 5. Envío de emails via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  if (!resendApiKey || !contactEmail) {
    // En desarrollo sin credenciales: solo loguear
    console.log('[ContactAction] Email omitido (sin credenciales Resend):', {
      to: contactEmail,
      from: data.name,
      email: data.email,
      serviceSlug: data.serviceSlug,
      message: data.message.slice(0, 100),
    });
    return { success: true, data: undefined };
  }

  try {
    const resend = new Resend(resendApiKey);

    // Email a la fotógrafa
    await resend.emails.send({
      from: `MayuStudio <noreply@${new URL(appUrl).hostname}>`,
      to: contactEmail,
      subject: `Nuevo mensaje de contacto — ${data.name}`,
      react: React.createElement(ContactNotificationEmail, { data }),
      replyTo: data.email,
    });

    // Email de confirmación al cliente
    await resend.emails.send({
      from: `MayuStudio <noreply@${new URL(appUrl).hostname}>`,
      to: data.email,
      subject: 'Recibimos tu mensaje — MayuStudio',
      react: React.createElement(ContactConfirmationEmail, { name: data.name, appUrl }),
    });

    return { success: true, data: undefined };
  } catch (error) {
    Sentry.captureException(error, {
      tags: { action: 'contactAction' },
      extra: { ip, serviceSlug: data.serviceSlug },
    });

    console.error('[ContactAction] Error al enviar email:', error);

    return {
      success: false,
      error:
        'Hubo un problema al enviar tu mensaje. Por favor, intentá de nuevo o escribinos directamente.',
    };
  }
}
