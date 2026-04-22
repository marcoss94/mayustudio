'use client';

import { useState } from 'react';

export interface CustomSetFormProps {
  setSlug: string;
  price: number;
}

export function CustomSetForm({ setSlug }: CustomSetFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vision, setVision] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: en Phase 2 conectamos con flujo de pago
    const params = new URLSearchParams({
      servicio: 'cake-smash',
      set: setSlug,
      name,
      email,
      phone,
      vision,
    });
    window.location.href = `/reservar?${params.toString()}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="custom-name"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Nombre completo
        </label>
        <input
          id="custom-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="custom-email"
            className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
          >
            Email
          </label>
          <input
            id="custom-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2"
          />
        </div>
        <div>
          <label
            htmlFor="custom-phone"
            className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
          >
            Teléfono
          </label>
          <input
            id="custom-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="custom-vision"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Describí tu set ideal
        </label>
        <textarea
          id="custom-vision"
          required
          rows={6}
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="Contanos la temática, colores, referencias, objetos importantes, atmósfera que imaginás..."
          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl focus:ring-0 focus:border-secondary focus:outline-none transition-colors p-4 text-sm leading-relaxed resize-none"
        />
        <p className="mt-2 text-xs text-on-surface-variant/70">
          Cuanto más detalle nos des, mejor podremos hacerlo realidad.
        </p>
      </div>

      <button
        type="submit"
        className="w-full md:w-auto inline-flex px-8 md:px-10 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-sans uppercase text-sm tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/10 min-h-[44px] items-center justify-center active:scale-[0.98]"
      >
        Continuar con la reserva
      </button>
    </form>
  );
}
