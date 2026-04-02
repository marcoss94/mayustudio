type FailurePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function PaymentFailurePage({ searchParams }: FailurePageProps) {
  const params = await searchParams;
  const paymentId = pickParam(params, "payment_id");
  const merchantOrderId = pickParam(params, "merchant_order_id");
  const status = pickParam(params, "status") || pickParam(params, "collection_status");
  const externalReference = pickParam(params, "external_reference");
  const preferenceId = pickParam(params, "preference_id");

  const allNull =
    (!paymentId || paymentId === "null") &&
    (!merchantOrderId || merchantOrderId === "null") &&
    (!status || status === "null");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold text-rose-700">Pago rechazado</h1>
      <p className="mt-3 text-zinc-600">
        El pago no fue aprobado. Puedes reintentar desde el flujo de prueba.
      </p>

      <div className="mt-6 rounded-lg border border-zinc-200 p-4 text-sm">
        <h2 className="font-semibold">Debug del retorno</h2>
        <ul className="mt-3 space-y-1 text-zinc-700">
          <li>
            <span className="font-medium">payment_id:</span> {paymentId || "(vacío)"}
          </li>
          <li>
            <span className="font-medium">merchant_order_id:</span>{" "}
            {merchantOrderId || "(vacío)"}
          </li>
          <li>
            <span className="font-medium">status:</span> {status || "(vacío)"}
          </li>
          <li>
            <span className="font-medium">external_reference:</span>{" "}
            {externalReference || "(vacío)"}
          </li>
          <li>
            <span className="font-medium">preference_id:</span> {preferenceId || "(vacío)"}
          </li>
        </ul>
      </div>

      {allNull ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          No se creó un pago real en Mercado Pago (parámetros en null). Revisa que uses
          buyer/seller de prueba del mismo país y que el email enviado coincida con el buyer
          logueado.
        </p>
      ) : null}
    </main>
  );
}
