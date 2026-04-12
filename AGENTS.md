<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# MayuStudio — Guía para Agentes AI

Lee `CLAUDE.md` para el contexto completo del proyecto, estructura y convenciones.

## Archivos Sensibles — NO TOCAR sin consultar

| Archivo / Directorio | Razón |
|---------------------|-------|
| `.env`, `.env.local`, `.env.*.local` | Contienen secretos reales — nunca leer ni commitear |
| `prisma/migrations/` | Generado automáticamente por Prisma — no editar manualmente |
| `next.config.ts` | Configuración crítica de Sentry y Next.js — consultar antes de cambiar |
| `middleware.ts` | Corre en Edge Runtime — cambios incorrectos bloquean toda la app |
| `instrumentation.ts` | Hook de Sentry — no modificar sin entender el ciclo de vida |

## Flujo SDD (Spec-Driven Development)

Este proyecto usa SDD para cambios sustanciales:

1. `/sdd-explore <tema>` — investigar antes de proponer
2. `/sdd-new <cambio>` — crear propuesta + spec + diseño + tareas
3. `/sdd-apply` — implementar tareas en batches
4. `/sdd-verify` — validar contra la spec
5. `/sdd-archive` — cerrar el cambio

Para cambios menores (bug fixes, ajustes de estilo, agregar un test), SDD no es necesario.

## Reglas de Runtime

- **Edge Runtime** (middleware, config.ts): NO puede importar `PrismaClient`, `@auth/prisma-adapter`, ni módulos Node.js puros.
- **Node Runtime** (route handlers, server actions, server components): puede importar todo.
- Nunca importar `lib/auth/index.ts` desde `middleware.ts` — usar `lib/auth/config.ts`.

## Antes de Editar

1. Leer el archivo objetivo con la herramienta Read.
2. Verificar que el cambio no rompe TypeScript: `npx tsc --noEmit`.
3. Si se agregan dependencias: `npm install <pkg>` y verificar que `package.json` se actualizó.
4. Si se modifica el schema de Prisma: correr `npm run db:generate`.

## Referencia rápida

- Stack completo y convenciones: `CLAUDE.md`
- Modelos de datos: `prisma/schema.prisma`
- Tipos compartidos: `types/index.ts`
- Utilidades: `lib/utils.ts`
- Config de Auth: `lib/auth/config.ts` (edge) y `lib/auth/index.ts` (node)
