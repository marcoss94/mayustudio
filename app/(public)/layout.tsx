/**
 * PublicLayout — Zona pública: landing, catálogo, galería, sobre mí
 *
 * No requiere autenticación.
 * Estructura: Header glassmorphism (sticky) + main flexible + Footer.
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
