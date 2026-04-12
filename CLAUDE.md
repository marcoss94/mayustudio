@AGENTS.md

# MayuStudio — Convenciones del Proyecto

## Stack Técnico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Lenguaje | TypeScript strict | 5.x |
| Estilos | Tailwind CSS v4 + tokens custom | 4.x |
| ORM | Prisma + PrismaAdapter Neon | 7.x |
| Base de datos | PostgreSQL (Neon serverless) | — |
| Auth | Auth.js v5 (next-auth beta) | 5.x |
| Monitoring | Sentry | 10.x |
| Testing | Vitest + Testing Library | 4.x |
| Email | Resend | — |
| Pagos | MercadoPago | — |

## Estructura de Carpetas

```
mayustudio/
├── app/                        # App Router de Next.js
│   ├── (public)/               # Rutas públicas (home, galería, servicios)
│   ├── (auth)/                 # Rutas de autenticación (login, registro)
│   ├── (client)/               # Rutas de cliente autenticado (reservar, perfil)
│   ├── (admin)/                # Rutas de administración (dashboard, gestión)
│   ├── api/
│   │   ├── auth/[...nextauth]/ # Auth.js handlers
│   │   └── webhooks/
│   │       └── mercadopago/    # Receptor de webhooks de pagos
│   ├── layout.tsx              # RootLayout con fonts y providers
│   └── globals.css             # Tailwind + design tokens (@theme)
│
├── components/
│   ├── ui/                     # Componentes atómicos (Button, Input, Card…)
│   ├── layout/                 # Header, Footer, Sidebar, Nav
│   └── providers/              # SessionProvider y otros context providers
│
├── lib/
│   ├── auth/
│   │   ├── config.ts           # Edge-safe config (para middleware)
│   │   └── index.ts            # Full config con PrismaAdapter (Node only)
│   ├── db/
│   │   └── client.ts           # Singleton PrismaClient + Neon adapter
│   ├── validations/            # Schemas Zod (Phase 1+)
│   └── utils.ts                # cn(), formatCurrency(), formatDate()
│
├── types/
│   ├── auth.d.ts               # Module augmentation next-auth (role, id)
│   └── index.ts                # Barrel de tipos de dominio (re-export Prisma)
│
├── actions/                    # Server Actions (Phase 1+)
├── hooks/                      # Custom hooks de React (Phase 1+)
├── emails/                     # Templates de Resend (Phase 3+)
├── prisma/
│   └── schema.prisma           # Modelos: User, Service, Reservation, Payment…
├── middleware.ts               # Protección de rutas (Auth.js + Edge Runtime)
└── instrumentation.ts          # Sentry instrumentation hook
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor en http://localhost:3000

# Build y verificación
npm run build        # Compilar para producción
npx tsc --noEmit     # Verificar tipos sin compilar

# Calidad de código
npm run lint         # ESLint (next lint)
npm run format       # Prettier — formatear todos los archivos
npm run format:check # Prettier — verificar sin escribir

# Testing
npm test             # Vitest en modo watch
npm run test:run     # Vitest — un solo pase (CI)
npm run test:coverage # Reporte de cobertura

# Base de datos
npm run db:generate  # prisma generate — regenerar cliente
npm run db:push      # prisma db push — sincronizar schema sin migración
npm run db:migrate   # prisma migrate dev — crear migración
npm run db:studio    # Abrir Prisma Studio en el browser
```

## Convenciones de Código

### Componentes

- **Server Components por defecto** — solo agregar `'use client'` cuando se necesiten hooks o eventos del navegador.
- **Naming**: PascalCase para archivos de componentes (`UserCard.tsx`).
- **Barrel exports** dentro de carpetas: `components/ui/index.ts` re-exporta todo.
- **Atomic Design** como guía: `ui/` = átomos/moléculas, `layout/` = organismos.

### Imports

- Usar alias `@/` para imports absolutos desde la raíz del proyecto.
  ```ts
  import { cn } from '@/lib/utils';         // correcto
  import { cn } from '../../lib/utils';     // evitar
  ```
- Orden: externos → internos → relativos → tipos.

### Hooks y Utilidades

- **Naming de hooks**: prefijo `use` + PascalCase (`useReservation`, `useAuth`).
- **Naming de utils**: camelCase descriptivo (`formatCurrency`, `getAvailableSlots`).

### Server Actions

- Archivos en `actions/` con sufijo descriptivo (`reservation.actions.ts`).
- Retornar siempre `ActionResult<T>` de `@/types`.
- Validar inputs con Zod antes de tocar la DB.

### Estilos

- Usar clases utilitarias de Tailwind. Evitar CSS inline y módulos CSS.
- Usar `cn()` de `@/lib/utils` para clases condicionales.
- Design tokens disponibles: `bg-primary`, `text-on-primary`, `glass-card`, `glass-nav`, variables `--color-*`, `--font-*`.

### TypeScript

- `strict: true` — sin excepciones.
- No usar `any`. Si es inevitable, anotar `// eslint-disable-next-line @typescript-eslint/no-explicit-any` con justificación.
- Preferir tipos de Prisma re-exportados desde `@/types` sobre definir tipos manualmente.

### Commits

Formato: `<tipo>(<scope>): <descripción en inglés>`

```
feat(auth): add Google OAuth provider
fix(db): handle connection pool timeout
refactor(ui): extract Button to atomic component
test(utils): add formatCurrency edge cases
chore(deps): upgrade next-auth to v5.0.0-beta.25
```

## Design System — Referencia Rápida

### Colores principales (tokens `@theme`)

| Token | Variable CSS | Uso |
|-------|-------------|-----|
| `bg-primary` | `--color-primary` | Botones CTA, acentos |
| `bg-surface` | `--color-surface` | Fondo de tarjetas |
| `text-on-primary` | `--color-on-primary` | Texto sobre fondo primary |
| `text-on-surface` | `--color-on-surface` | Texto principal |
| `border-outline` | `--color-outline` | Bordes |

### Utilidades de glass

```tsx
<div className="glass-card">    // tarjeta con glassmorphism
<nav className="glass-nav">     // navbar sticky con glass
<div className="glass">         // solo el backdrop-filter base
<div className="gradient-cta">  // gradiente para hero/CTA
```

### Tipografía

- **Serif**: `font-serif` — Noto Serif Display — para títulos y headings.
- **Sans**: `font-sans` — Inter — para cuerpo y UI.

## Notas para Agentes AI

- No modificar `next.config.ts` sin consultar — tiene config de Sentry y otras opciones críticas.
- No modificar `prisma/schema.prisma` sin correr `npm run db:generate` después.
- No hacer `npm run build` después de cambios — el orquestador decide cuándo buildear.
- Los archivos `*.env*` son sensibles — nunca commitear valores reales.
- Middleware en `middleware.ts` corre en **Edge Runtime** — no puede importar `lib/auth/index.ts`.
- Para lógica de auth en Server Components, usar `auth()` de `@/lib/auth/index.ts`.
- Para protección de rutas en middleware, usar `authConfig` de `@/lib/auth/config.ts`.
