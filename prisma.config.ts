import { defineConfig } from 'prisma/config';

/**
 * prisma.config.ts — Prisma v7 configuration
 *
 * NOTA: En Prisma v7, el adapter de conexión (PrismaNeon) se configura
 * directamente en PrismaClient (lib/db/client.ts), no aquí.
 * prisma.config.ts es para opciones del CLI: schema path, migrations, etc.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
});
