import type { Metadata } from 'next';
import { Young_Serif, Onest } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';
import { websiteJsonLd } from '@/lib/seo/json-ld';

/* ─── Fonts ─────────────────────────────────────────────────────────────────
   Young Serif — display cálido con carácter (titulares, hero)
   Onest       — body humanista variable (UI, párrafos)
─────────────────────────────────────────────────────────────────────────── */

const youngSerif = Young_Serif({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400'],
});

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

/* ─── Metadata ──────────────────────────────────────────────────────────────
   title.template se propaga a todas las páginas hijas via generateMetadata()
─────────────────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    template: '%s | MayuStudio',
    default: 'MayuStudio — Fotografía Infantil Boutique',
  },
  description:
    'Estudio de fotografía infantil boutique. Cake Smash, Fine Art, sesiones minimalistas y experiencias completas. Reservá tu sesión.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'MayuStudio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ─── Root Layout ───────────────────────────────────────────────────────────
   - Server Component (sin "use client")
   - Carga las font variables en <html> — disponibles globalmente via CSS vars
   - SessionProvider es Client Component; se wrappea AQUÍ para cubrir toda la app
─────────────────────────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${youngSerif.variable} ${onest.variable}`}
    >
      <body>
        {/* JSON-LD: WebSite — presente en todas las páginas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
