"use client";

import { FormEvent, useState } from "react";

type PreferenceResponse = {
  paymentId: string;
  checkoutUrl?: string;
  checkoutSandboxUrl?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("1000");
  const [email, setEmail] = useState("test_user_123456@testuser.com");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          title: "Reserva de prueba Mayu Studio",
          payerEmail: email,
        }),
      });

      const data = (await response.json()) as PreferenceResponse & {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Error al crear preferencia");
        return;
      }

      const checkoutUrl = data.checkoutSandboxUrl ?? data.checkoutUrl;

      if (!checkoutUrl) {
        setError("Mercado Pago no devolvió URL de checkout");
        return;
      }

      window.location.href = checkoutUrl;
    } catch {
      setError("No se pudo iniciar el checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold">Spike de pagos · Mercado Pago Sandbox</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Esta pantalla es solo para validar flujo preference → checkout → webhook.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border p-6">
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm font-medium">
            Monto (ARS)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email del pagador de prueba (obligatorio)
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          <p className="text-xs text-zinc-500">
            Usa el email del buyer de prueba que está logueado en Checkout Pro.
          </p>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creando preferencia..." : "Pagar en sandbox"}
        </button>
      </form>
    </main>
  );
}
