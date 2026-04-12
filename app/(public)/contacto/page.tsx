/**
 * app/(public)/contacto/page.tsx — Página de contacto
 *
 * Server Component: query de servicios → pasa a ContactForm (Client Component).
 * Layout: form izquierda + info derecha en desktop, stack en mobile.
 */

import type { Metadata } from 'next';
import { getServiceSlugs } from '@/lib/queries/services';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escribinos para consultas o para reservar tu sesión de fotografía infantil en MayuStudio. Respondemos en 24 a 48 horas.',
  openGraph: {
    title: 'Contacto — MayuStudio',
    description:
      'Escribinos para consultas o para reservar tu sesión de fotografía infantil en MayuStudio.',
    type: 'website',
  },
};

// ─── Íconos ──────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-5 w-5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-primary"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function ContactoPage() {
  const services = await getServiceSlugs();

  return (
    <main className="min-h-[100dvh]">
      {/* Header */}
      <section className="px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Hablemos"
            subtitle="Completá el formulario y te respondemos en las próximas 24 a 48 horas para coordinar todos los detalles de tu sesión."
            align="center"
          />
        </div>
      </section>

      {/* Contenido principal */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">

            {/* Formulario — 3/5 del ancho en desktop */}
            <div className="lg:col-span-3">
              <div className="glass-card px-6 py-8 sm:px-8 sm:py-10">
                <h2 className="mb-8 font-serif text-xl text-on-surface">
                  Enviar un mensaje
                </h2>
                <ContactForm services={services} />
              </div>
            </div>

            {/* Información de contacto — 2/5 en desktop */}
            <aside className="lg:col-span-2">
              <div className="space-y-8">

                {/* Datos de contacto */}
                <div className="glass-card px-6 py-8">
                  <h2 className="mb-6 font-serif text-lg text-on-surface">
                    Información de contacto
                  </h2>

                  <ul className="space-y-5" role="list">
                    <li className="flex items-start gap-3">
                      <MailIcon />
                      <div>
                        <p className="label-caps text-[color:var(--color-on-surface-variant)]">
                          Email
                        </p>
                        <a
                          href="mailto:hola@mayustudio.com"
                          className="font-sans text-sm text-on-surface transition-colors hover:text-primary"
                        >
                          hola@mayustudio.com
                        </a>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <PhoneIcon />
                      <div>
                        <p className="label-caps text-[color:var(--color-on-surface-variant)]">
                          WhatsApp
                        </p>
                        <a
                          href="https://wa.me/5491100000000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-sm text-on-surface transition-colors hover:text-primary"
                        >
                          +54 9 11 0000-0000
                        </a>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <InstagramIcon />
                      <div>
                        <p className="label-caps text-[color:var(--color-on-surface-variant)]">
                          Instagram
                        </p>
                        <a
                          href="https://instagram.com/mayustudio"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-sm text-on-surface transition-colors hover:text-primary"
                        >
                          @mayustudio
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Horarios */}
                <div className="glass-card px-6 py-8">
                  <div className="mb-4 flex items-center gap-2">
                    <ClockIcon />
                    <h2 className="font-serif text-lg text-on-surface">
                      Horarios de sesión
                    </h2>
                  </div>

                  <ul className="space-y-3" role="list">
                    <li className="flex items-center justify-between border-b border-[color:var(--color-outline-variant)]/30 pb-3">
                      <span className="font-sans text-sm text-[color:var(--color-on-surface-variant)]">
                        Lunes a viernes
                      </span>
                      <span className="font-sans text-sm font-medium text-on-surface">
                        9:00 — 17:00
                      </span>
                    </li>
                    <li className="flex items-center justify-between border-b border-[color:var(--color-outline-variant)]/30 pb-3">
                      <span className="font-sans text-sm text-[color:var(--color-on-surface-variant)]">
                        Sábados
                      </span>
                      <span className="font-sans text-sm font-medium text-on-surface">
                        9:00 — 13:00
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-sans text-sm text-[color:var(--color-on-surface-variant)]">
                        Domingos
                      </span>
                      <span className="font-sans text-sm text-[color:var(--color-on-surface-variant)]">
                        Cerrado
                      </span>
                    </li>
                  </ul>

                  <p className="mt-4 font-sans text-xs text-[color:var(--color-on-surface-variant)]/70">
                    Las sesiones duran entre 40 y 120 minutos según el servicio.
                    Coordinamos el horario exacto al confirmar la reserva.
                  </p>
                </div>

                {/* Ubicación placeholder */}
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-glass-border)]">
                  <div
                    className="flex h-40 items-center justify-center bg-surface-container"
                    aria-label="Mapa de ubicación — próximamente"
                    role="img"
                  >
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="mx-auto mb-2 h-8 w-8 text-[color:var(--color-primary-light)]"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      <p className="font-sans text-sm text-[color:var(--color-on-surface-variant)]">
                        Buenos Aires, Argentina
                      </p>
                      <p className="font-sans text-xs text-[color:var(--color-on-surface-variant)]/60">
                        Dirección exacta al confirmar la reserva
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
