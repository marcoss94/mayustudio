export default function PaymentPendingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold text-amber-700">Pago pendiente</h1>
      <p className="mt-3 text-zinc-600">
        El pago quedó en revisión o en proceso. Esperamos confirmación por webhook.
      </p>
    </main>
  );
}
