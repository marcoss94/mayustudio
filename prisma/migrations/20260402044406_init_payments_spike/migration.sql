-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('draft', 'pending_payment', 'payment_processing', 'confirmed', 'cancelled', 'expired', 'completed');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('mercadopago');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'authorized', 'in_process', 'rejected', 'cancelled', 'refunded', 'chargeback', 'unknown');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "externalReference" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending_payment',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'mercadopago',
    "providerPaymentId" TEXT,
    "providerPreferenceId" TEXT,
    "externalReference" TEXT,
    "amount" DECIMAL(10,2),
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "statusDetail" TEXT,
    "rawLatestPayload" JSONB,
    "reservationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEventLog" (
    "id" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'mercadopago',
    "providerEventId" TEXT NOT NULL,
    "eventType" TEXT,
    "action" TEXT,
    "liveMode" BOOLEAN,
    "payload" JSONB NOT NULL,
    "headers" JSONB,
    "processingState" TEXT NOT NULL DEFAULT 'received',
    "processingError" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentId" TEXT,

    CONSTRAINT "PaymentEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_externalReference_key" ON "Reservation"("externalReference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerPaymentId_key" ON "Payment"("providerPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerPreferenceId_key" ON "Payment"("providerPreferenceId");

-- CreateIndex
CREATE INDEX "Payment_externalReference_idx" ON "Payment"("externalReference");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "PaymentEventLog_eventType_idx" ON "PaymentEventLog"("eventType");

-- CreateIndex
CREATE INDEX "PaymentEventLog_createdAt_idx" ON "PaymentEventLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEventLog_provider_providerEventId_key" ON "PaymentEventLog"("provider", "providerEventId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEventLog" ADD CONSTRAINT "PaymentEventLog_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
