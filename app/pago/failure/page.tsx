export default function PaymentFailurePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold text-rose-700">Pago rechazado</h1>
      <p className="mt-3 text-zinc-600">
        El pago no fue aprobado. Puedes reintentar desde el flujo de prueba.
      </p>
    </main>
  );
}
