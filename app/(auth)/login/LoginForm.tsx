'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError(null);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!email || !password) {
      setError('Completá todos los campos');
      return;
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!res || res.error) {
      setError('Credenciales inválidas');
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const dest =
      role === 'ADMIN' || role === 'SUPERADMIN' ? '/admin' : '/mis-reservas';

    startTransition(() => {
      router.push(dest);
      router.refresh();
    });
  }

  return (
    <form
      action={(fd) => {
        void onSubmit(fd);
      }}
      className="space-y-5"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg bg-error-container text-on-error-container px-4 py-3 text-sm"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary focus:outline-none transition-colors py-2 text-base"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2 font-semibold"
        >
          Contraseña
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
