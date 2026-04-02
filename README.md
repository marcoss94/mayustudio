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
- `GET /api/webhooks/mercadopago?payment_id=...` (reconciliación manual)
- `GET /api/payments/:id/status`

## Flujo de prueba

1. Abrir `http://localhost:3000`
2. Crear pago de prueba
3. Completar checkout sandbox
4. Verificar actualización vía webhook en base de datos

## Nota crítica

La redirección (`success/pending/failure`) es solo experiencia de usuario.
La **confirmación real** del pago depende del webhook y conciliación backend.
