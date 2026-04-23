/**
 * ClientLayout — Zona autenticada: reservar, mis reservas, perfil
 *
 * Usa el mismo Header/Footer que el layout público.
 * La autenticación ya está protegida por middleware.ts.
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex-1 pt-24 px-4 md:px-8 max-w-7xl w-full mx-auto">{children}</div>
      <Footer />
    </div>
  );
}
