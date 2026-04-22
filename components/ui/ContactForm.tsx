'use client';

/**
 * ContactForm.tsx — Formulario de contacto con useActionState (React 19)
 *
 * Client Component — gestiona estado del formulario y validación client-side.
 *
 * Diseño:
 * - Inputs con bottom-border only (sin fondo), float label on focus
 * - Mobile-first: campos full-width, stacked
 * - Estados: idle → submitting → success / error
 */

import { useActionState, useState, useCallback } from 'react';
import { contactSchema } from '@/lib/validations/contact';
import { contactAction } from '@/actions/contact.actions';
import { cn } from '@/lib/utils';
import type { ActionResult } from '@/types';

export interface ContactFormService {
  slug: string;
  name: string;
}

export interface ContactFormProps {
  services: ContactFormService[];
}

// ─── Componentes internos ────────────────────────────────────────────────────

interface FloatFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

function FloatField({
  id,
  name,
  label,
  type = 'text',
  required = false,
  autoComplete,
  error,
}: FloatFieldProps) {
  return (
    <div className="group relative pt-5">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          'peer w-full bg-transparent px-0 pb-2.5 pt-1',
          'font-sans text-base text-on-surface',
          'border-0 border-b transition-colors duration-300',
          'outline-none focus:outline-none',
          'placeholder-shown:border-b-outline-variant/40',
          error
            ? 'border-b-error'
            : 'border-b-[color:var(--color-outline-variant)] focus:border-b-[color:var(--color-secondary)]',
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          'pointer-events-none absolute left-0 top-0',
          'font-sans text-xs font-medium transition-all duration-300',
          'peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal',
          error
            ? 'text-error'
            : 'text-[color:var(--color-on-surface-variant)] peer-focus:text-[color:var(--color-secondary)]',
        )}
      >
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

interface FloatSelectProps {
  id: string;
  name: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}

function FloatSelect({ id, name, label, children, error }: FloatSelectProps) {
  return (
    <div className="relative pt-5">
      <label
        htmlFor={id}
        className={cn(
          'absolute left-0 top-0',
          'font-sans text-xs font-medium',
          error
            ? 'text-error'
            : 'text-[color:var(--color-on-surface-variant)]',
        )}
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className={cn(
          'w-full bg-transparent px-0 pb-2.5 pt-1',
          'font-sans text-base text-on-surface',
          'border-0 border-b transition-colors duration-300',
          'outline-none focus:outline-none',
          'appearance-none cursor-pointer',
          error
            ? 'border-b-error'
            : 'border-b-[color:var(--color-outline-variant)] focus:border-b-[color:var(--color-secondary)]',
        )}
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Validación client-side ──────────────────────────────────────────────────

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function validateField(name: string, value: string): string | undefined {
  const partial = { [name]: value || undefined };
  const result = contactSchema.partial().safeParse(partial);
  if (!result.success) {
    const fieldError = result.error.issues.find(
      (issue) => String(issue.path[0]) === name,
    );
    return fieldError?.message;
  }
  return undefined;
}

// ─── Componente principal ────────────────────────────────────────────────────

export function ContactForm({ services }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    contactAction,
    null,
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const isSuccess = state?.success === true;
  const serverError = state?.success === false ? state.error : undefined;

  // Éxito: mostrar mensaje en lugar del formulario
  if (isSuccess) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] bg-surface-container-low p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-tertiary-container)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-8 w-8 text-[color:var(--color-on-tertiary)]"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mb-2 font-serif text-xl text-on-surface">
          Mensaje enviado
        </h3>
        <p className="font-sans text-base text-[color:var(--color-on-surface-variant)]">
          Gracias por escribirnos. Te responderemos en las próximas 24 a 48
          horas para coordinar todos los detalles de tu sesión.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {/* Error global del servidor */}
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-error/20 bg-[color:var(--color-error-container)] px-4 py-3"
        >
          <p className="font-sans text-sm text-error">{serverError}</p>
        </div>
      )}

      {/* Nombre */}
      <FloatField
        id="contact-name"
        name="name"
        label="Nombre completo"
        required
        autoComplete="name"
        error={fieldErrors.name}
      />

      {/* Email */}
      <FloatField
        id="contact-email"
        name="email"
        type="email"
        label="Email"
        required
        autoComplete="email"
        error={fieldErrors.email}
      />

      {/* Teléfono (opcional) */}
      <div className="group relative pt-5">
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder=" "
          onBlur={handleBlur}
          className={cn(
            'peer w-full bg-transparent px-0 pb-2.5 pt-1',
            'font-sans text-base text-on-surface',
            'border-0 border-b border-b-[color:var(--color-outline-variant)] transition-colors duration-300',
            'outline-none focus:outline-none focus:border-b-[color:var(--color-secondary)]',
          )}
        />
        <label
          htmlFor="contact-phone"
          className="pointer-events-none absolute left-0 top-0 font-sans text-xs font-medium text-[color:var(--color-on-surface-variant)] transition-all duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal"
        >
          Teléfono{' '}
          <span className="text-[color:var(--color-on-surface-variant)]/60">(opcional)</span>
        </label>
        {fieldErrors.phone && (
          <p role="alert" className="mt-1.5 text-xs text-error">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      {/* Sesión de interés */}
      {services.length > 0 && (
        <FloatSelect
          id="contact-service"
          name="serviceSlug"
          label="Sesión de interés"
        >
          <option value="">Elegí una sesión...</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </FloatSelect>
      )}

      {/* Mensaje */}
      <div className="relative pt-5">
        <label
          htmlFor="contact-message"
          className="absolute left-0 top-0 font-sans text-xs font-medium text-[color:var(--color-on-surface-variant)]"
        >
          Mensaje{' '}
          <span className="text-error" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          onBlur={handleBlur}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          aria-invalid={!!fieldErrors.message}
          placeholder="Contanos sobre tu bebé, la fecha que tenés en mente, qué sesión te interesa..."
          className={cn(
            'w-full bg-transparent px-0 pb-2.5 pt-1',
            'min-h-[120px] resize-y',
            'font-sans text-base text-on-surface placeholder:text-[color:var(--color-on-surface-variant)]/50',
            'border-0 border-b transition-colors duration-300',
            'outline-none focus:outline-none',
            fieldErrors.message
              ? 'border-b-error'
              : 'border-b-[color:var(--color-outline-variant)] focus:border-b-[color:var(--color-secondary)]',
          )}
        />
        {fieldErrors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-error">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className={cn(
            'btn-primary w-full px-6 py-2.5',
            'font-sans text-base font-medium',
            'min-h-[44px]',
            'flex items-center justify-center gap-2',
            'transition-all duration-200',
            'active:scale-[0.98]',
            isPending && 'cursor-not-allowed opacity-70',
          )}
        >
          {isPending ? (
            <>
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Enviando...
            </>
          ) : (
            'Enviar mensaje'
          )}
        </button>
        <p className="mt-3 text-center font-sans text-xs text-[color:var(--color-on-surface-variant)]/70">
          Te responderemos en 24 a 48 horas
        </p>
      </div>
    </form>
  );
}

export default ContactForm;
