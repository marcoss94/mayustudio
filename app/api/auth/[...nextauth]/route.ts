/**
 * app/api/auth/[...nextauth]/route.ts
 *
 * Route handler que delega todo a Auth.js v5.
 * GET  → handles session retrieval, OAuth callbacks, signout redirects
 * POST → handles credentials login, CSRF token
 *
 * Auth.js maneja internamente el routing de todos estos sub-paths:
 * /api/auth/session
 * /api/auth/signin
 * /api/auth/signout
 * /api/auth/callback/google
 * /api/auth/callback/credentials
 * /api/auth/csrf
 * /api/auth/providers
 */

import { handlers } from '@/lib/auth/index';

export const { GET, POST } = handlers;
