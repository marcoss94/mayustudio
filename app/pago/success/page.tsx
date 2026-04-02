export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold text-emerald-700">Pago aprobado</h1>
      <p className="mt-3 text-zinc-600">
        Redirección completada. La confirmación real queda sujeta al webhook.
      </p>
    </main>
  );
}
