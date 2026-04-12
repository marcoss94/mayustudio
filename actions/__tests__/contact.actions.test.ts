/**
 * actions/__tests__/contact.actions.test.ts
 * Tests del server action de contacto
 *
 * Mocks necesarios:
 *  - next/headers → headers() (Server Action infra)
 *  - resend       → Resend.emails.send
 *  - @sentry/nextjs → captureException
 *  - @/emails/*   → componentes React de email (no son relevantes para los tests)
 *  - react-dom/server → renderToStaticMarkup
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks de infraestructura (DEBEN ir antes del import del action) ──────────

// Mock de next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

// Mock de Resend — debe ser una clase (constructor function), no arrow fn
const mockEmailSend = vi.fn();
vi.mock('resend', () => {
  const ResendMock = function (this: unknown) {
    (this as { emails: { send: typeof mockEmailSend } }).emails = { send: mockEmailSend };
  };
  return { Resend: ResendMock };
});

// Mock de Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

// Mock de los templates de email (no testeamos su renderizado aquí)
vi.mock('@/emails/contact-notification', () => ({
  ContactNotificationEmail: vi.fn(() => null),
}));
vi.mock('@/emails/contact-confirmation', () => ({
  ContactConfirmationEmail: vi.fn(() => null),
}));

// Mock de renderToStaticMarkup para que no falle en jsdom
vi.mock('react-dom/server', () => ({
  renderToStaticMarkup: vi.fn(() => '<p>email html</p>'),
}));

// ─── Import del action DESPUÉS de los mocks ───────────────────────────────────

import { headers } from 'next/headers';
import { contactAction } from '@/actions/contact.actions';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Crea un ReadonlyHeaders mock minimalista */
function makeHeaders(ip = '1.2.3.4') {
  return {
    get: vi.fn((key: string) => {
      if (key === 'x-forwarded-for') return ip;
      if (key === 'x-real-ip') return null;
      return null;
    }),
  };
}

/** Crea FormData válida para el formulario de contacto */
function makeFormData(overrides: Record<string, string | undefined> = {}): FormData {
  const fd = new FormData();
  const defaults: Record<string, string> = {
    name: 'Ana García',
    email: 'ana@example.com',
    message: 'Me gustaría reservar una sesión para mi bebé en diciembre.',
    ...Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v !== undefined) as [string, string][],
    ),
  };

  // Si un override es undefined, simplemente no lo añadimos
  for (const [key, value] of Object.entries(defaults)) {
    fd.set(key, value);
  }

  return fd;
}

// ─── IP counter — cada test group usa su propia IP para evitar contaminación ──

let ipCounter = 1000;

function nextUniqueIp(): string {
  ipCounter += 1;
  return `192.168.${Math.floor(ipCounter / 256)}.${ipCounter % 256}`;
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  // Cada test usa una IP fresca para no acumular hits en el rateLimitMap modular
  vi.mocked(headers).mockResolvedValue(
    makeHeaders(nextUniqueIp()) as unknown as Awaited<ReturnType<typeof headers>>,
  );
  // Por defecto: sin credenciales de Resend (modo desarrollo)
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_EMAIL;
  delete process.env.NEXT_PUBLIC_APP_URL;
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('contactAction', () => {
  // ─── FormData válida ───────────────────────────────────────────────────────

  describe('FormData válida (sin credenciales Resend)', () => {
    it('retorna success: true cuando los datos son válidos y no hay credenciales Resend', async () => {
      const result = await contactAction(null, makeFormData());

      expect(result.success).toBe(true);
    });

    it('no llama a Resend.emails.send cuando no hay RESEND_API_KEY', async () => {
      await contactAction(null, makeFormData());

      expect(mockEmailSend).not.toHaveBeenCalled();
    });

    it('retorna data: undefined en el objeto de éxito', async () => {
      const result = await contactAction(null, makeFormData());

      if (result.success) {
        expect(result.data).toBeUndefined();
      }
    });

    it('acepta serviceSlug opcional en FormData', async () => {
      const fd = makeFormData({ serviceSlug: 'cake-smash' });
      const result = await contactAction(null, fd);

      expect(result.success).toBe(true);
    });

    it('acepta phone opcional en FormData', async () => {
      const fd = makeFormData({ phone: '+54 11 9876-5432' });
      const result = await contactAction(null, fd);

      expect(result.success).toBe(true);
    });
  });

  // ─── Envío de emails (con credenciales Resend) ─────────────────────────────

  describe('envío de emails (con credenciales Resend)', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-key-abc';
      process.env.CONTACT_EMAIL = 'fotografa@mayustudio.com';
      process.env.NEXT_PUBLIC_APP_URL = 'https://mayustudio.com';
      mockEmailSend.mockResolvedValue({ id: 'email-id-001' });
    });

    it('envía dos emails cuando las credenciales están presentes', async () => {
      const result = await contactAction(null, makeFormData());

      expect(result.success).toBe(true);
      expect(mockEmailSend).toHaveBeenCalledTimes(2);
    });

    it('retorna success: true cuando Resend responde OK', async () => {
      const result = await contactAction(null, makeFormData());

      expect(result.success).toBe(true);
    });

    it('retorna success: false y mensaje de error cuando Resend falla', async () => {
      mockEmailSend.mockRejectedValue(new Error('Resend network error'));

      const result = await contactAction(null, makeFormData());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/problema al enviar/i);
      }
    });
  });

  // ─── FormData inválida ─────────────────────────────────────────────────────

  describe('FormData inválida', () => {
    it('retorna success: false con error cuando name está vacío', async () => {
      const fd = new FormData();
      fd.set('name', '');
      fd.set('email', 'ana@example.com');
      fd.set('message', 'Mensaje con suficiente longitud para pasar validación.');

      const result = await contactAction(null, fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe('string');
        expect(result.error.length).toBeGreaterThan(0);
      }
    });

    it('retorna success: false con error cuando email es inválido', async () => {
      const fd = new FormData();
      fd.set('name', 'Ana García');
      fd.set('email', 'no-es-email');
      fd.set('message', 'Mensaje con suficiente longitud para pasar validación.');

      const result = await contactAction(null, fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/email válido/);
      }
    });

    it('retorna success: false cuando message tiene menos de 10 caracteres', async () => {
      const fd = new FormData();
      fd.set('name', 'Ana García');
      fd.set('email', 'ana@example.com');
      fd.set('message', 'Corto');

      const result = await contactAction(null, fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toMatch(/10 caracteres/);
      }
    });

    it('retorna success: false cuando name tiene un solo carácter', async () => {
      const fd = new FormData();
      fd.set('name', 'A');
      fd.set('email', 'ana@example.com');
      fd.set('message', 'Mensaje con suficiente longitud para pasar validación.');

      const result = await contactAction(null, fd);

      expect(result.success).toBe(false);
    });

    it('el error retornado es string (no un objeto Zod)', async () => {
      const fd = new FormData();
      fd.set('name', '');
      fd.set('email', '');
      fd.set('message', '');

      const result = await contactAction(null, fd);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe('string');
      }
    });
  });

  // ─── Rate limiting ─────────────────────────────────────────────────────────

  describe('rate limiting', () => {
    it('bloquea la 4ª llamada desde la misma IP en la misma ventana', async () => {
      // IPs únicas por test para no contaminar otras suites
      const uniqueIp = `203.0.113.${Math.floor(Math.random() * 200) + 10}`;
      const setIp = (ip: string) =>
        vi.mocked(headers).mockResolvedValue(
          makeHeaders(ip) as unknown as Awaited<ReturnType<typeof headers>>,
        );

      setIp(uniqueIp);
      const fd = makeFormData();

      // Primeras 3 llamadas deben ser permitidas
      const r1 = await contactAction(null, fd);
      const r2 = await contactAction(null, fd);
      const r3 = await contactAction(null, fd);

      expect(r1.success).toBe(true);
      expect(r2.success).toBe(true);
      expect(r3.success).toBe(true);

      // La 4ª debe ser bloqueada por rate limit
      const r4 = await contactAction(null, fd);

      expect(r4.success).toBe(false);
      if (!r4.success) {
        expect(r4.error).toMatch(/Demasiados mensajes/);
      }
    });

    it('permite la llamada cuando la IP es diferente', async () => {
      // Usar IPs en rango de documentación (TEST-NET-3) — únicas por run
      const base = Math.floor(Math.random() * 100) + 100;
      const ipA = `198.51.${base}.1`;
      const ipB = `198.51.${base}.2`;

      const setIp = (ip: string) =>
        vi.mocked(headers).mockResolvedValue(
          makeHeaders(ip) as unknown as Awaited<ReturnType<typeof headers>>,
        );

      setIp(ipA);

      // Agotar rate limit de ipA
      await contactAction(null, makeFormData());
      await contactAction(null, makeFormData());
      await contactAction(null, makeFormData());
      const blockedA = await contactAction(null, makeFormData());
      expect(blockedA.success).toBe(false);

      // ipB debe tener su propia cuota
      setIp(ipB);
      const resultB = await contactAction(null, makeFormData());
      expect(resultB.success).toBe(true);
    });

    it('usa IP "unknown" cuando no hay cabecera de IP', async () => {
      // "unknown" es una IP fija — solo ejecutar una vez para no agotarla
      // Reset la mock ANTES para que use null (no el nextUniqueIp del beforeEach)
      vi.mocked(headers).mockResolvedValue({
        get: vi.fn(() => null),
      } as unknown as Awaited<ReturnType<typeof headers>>);

      const result = await contactAction(null, makeFormData());

      // La acción debe seguir funcionando (no crashear)
      expect(typeof result.success).toBe('boolean');
    });
  });
});
