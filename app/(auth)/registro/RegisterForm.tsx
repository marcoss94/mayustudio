'use client';

import { useActionState } from 'react';
import { registerAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';

export function RegisterForm() {
  const [state, action, isPending] = useActionState<ActionResult | null, FormData>(
    registerAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.success === false && state.error && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Nombre completo
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="reg-email"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="reg-password"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Contraseña
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2 text-base"
        />
        <p className="mt-1 text-xs text-on-surface-variant/70">
          Mínimo 8 caracteres
        </p>
      </div>

      <div>
        <label
          htmlFor="reg-confirm"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Confirmar contraseña
        </label>
        <input
          id="reg-confirm"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2 text-base"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isPending}
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
