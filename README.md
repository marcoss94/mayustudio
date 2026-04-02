# Mayu Studio · Spike inicial de pagos

Este repo arranca con un **spike técnico** para validar primero:

1. Creación de preference en Mercado Pago (sandbox)
2. Checkout Pro
3. Webhook idempotente
4. Persistencia de estado de pago/reserva

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

- `DATABASE_URL`
- `MERCADOPAGO_ACCESS_TOKEN` (sandbox)
- `NEXT_PUBLIC_APP_URL` (por defecto `http://localhost:3000`)
- `MERCADOPAGO_WEBHOOK_URL` (URL pública al endpoint `/api/webhooks/mercadopago`)
- `MERCADOPAGO_WEBHOOK_SECRET` (clave secreta de Webhooks en panel de MP)
- `INTERNAL_API_TOKEN` (token interno para endpoints administrativos de pago)

## Comandos

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Endpoints implementados

- `POST /api/payments/mercadopago/preference`
- `POST /api/webhooks/mercadopago`
- `GET /api/webhooks/mercadopago?payment_id=...` (reconciliación manual, requiere header `x-internal-api-token`)
- `GET /api/payments/:id/status` (requiere header `x-internal-api-token`)

## Flujo de prueba

1. Abrir `http://localhost:3000`
2. Crear pago de prueba (email del buyer de prueba obligatorio)
3. Completar checkout sandbox
4. Verificar actualización vía webhook en base de datos

## Nota crítica

La redirección (`success/pending/failure`) es solo experiencia de usuario.
La **confirmación real** del pago depende del webhook y conciliación backend.

## Hardening de seguridad aplicado

- Validación opcional de firma `x-signature` (obligatoria si configuras `MERCADOPAGO_WEBHOOK_SECRET`)
- Validación de host confiable para `merchant_order.resource` (mitiga SSRF)
- Sanitización de headers persistidos en logs
- Rate limiting básico en endpoints de pagos/webhooks
- Endpoints de estado y reconciliación protegidos con `x-internal-api-token`
