"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("500");
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
        }),
      });

      const data = (await response.json()) as {
        init_point?: string;
        sandbox_init_point?: string;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Error al crear preferencia");
        return;
      }

      const checkoutUrl = data.sandbox_init_point ?? data.init_point;

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
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-6 py-10">
      <h1 className="text-3xl font-semibold">Mayu Studio · Pago Sandbox</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Flujo simple: preference → checkout → webhook → DB.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border p-6">
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm font-medium">
            Monto (UYU)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creando preferencia..." : "Pagar con Mercado Pago"}
        </button>
      </form>
    </main>
  );
}
