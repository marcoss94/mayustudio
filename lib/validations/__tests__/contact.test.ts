/**
 * lib/validations/__tests__/contact.test.ts
 * Tests del schema Zod de contacto
 */

import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/validations/contact';

describe('contactSchema', () => {
  // ─── Caso feliz ─────────────────────────────────────────────────────────────

  describe('datos válidos', () => {
    it('acepta un objeto completo y correcto', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        phone: '+54 11 1234-5678',
        serviceSlug: 'cake-smash',
        message: 'Me gustaría reservar una sesión para mi bebé.',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Ana García');
        expect(result.data.email).toBe('ana@example.com');
        expect(result.data.serviceSlug).toBe('cake-smash');
      }
    });

    it('acepta sin campos opcionales (phone y serviceSlug omitidos)', () => {
      const result = contactSchema.safeParse({
        name: 'Pedro López',
        email: 'pedro@example.com',
        message: 'Consulta sobre sesiones de recién nacido.',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBeUndefined();
        expect(result.data.serviceSlug).toBeUndefined();
      }
    });
  });

  // ─── name ────────────────────────────────────────────────────────────────────

  describe('name', () => {
    it('falla si name está vacío', () => {
      const result = contactSchema.safeParse({
        name: '',
        email: 'test@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('falla si name tiene un solo carácter', () => {
      const result = contactSchema.safeParse({
        name: 'A',
        email: 'test@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'));
        expect(nameError?.message).toMatch(/al menos 2 caracteres/);
      }
    });

    it('falla si name supera 100 caracteres', () => {
      const result = contactSchema.safeParse({
        name: 'A'.repeat(101),
        email: 'test@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((i) => i.path.includes('name'));
        expect(nameError?.message).toMatch(/100 caracteres/);
      }
    });

    it('acepta name con exactamente 2 caracteres (límite inferior)', () => {
      const result = contactSchema.safeParse({
        name: 'Al',
        email: 'test@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(true);
    });

    it('acepta name con exactamente 100 caracteres (límite superior)', () => {
      const result = contactSchema.safeParse({
        name: 'B'.repeat(100),
        email: 'test@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(true);
    });
  });

  // ─── email ───────────────────────────────────────────────────────────────────

  describe('email', () => {
    it('falla si email no tiene formato válido', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'no-es-un-email',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find((i) => i.path.includes('email'));
        expect(emailError?.message).toMatch(/email válido/);
      }
    });

    it('falla si email está vacío', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: '',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
    });

    it('falla si email carece de dominio', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'usuario@',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(false);
    });

    it('acepta email con subdominio', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'contacto@mail.empresa.com.ar',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(true);
    });
  });

  // ─── message ─────────────────────────────────────────────────────────────────

  describe('message', () => {
    it('falla si mensaje tiene menos de 10 caracteres', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Corto',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const msgError = result.error.issues.find((i) => i.path.includes('message'));
        expect(msgError?.message).toMatch(/al menos 10 caracteres/);
      }
    });

    it('falla si mensaje está vacío', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: '',
      });

      expect(result.success).toBe(false);
    });

    it('falla si mensaje supera 2000 caracteres', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'X'.repeat(2001),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const msgError = result.error.issues.find((i) => i.path.includes('message'));
        expect(msgError?.message).toMatch(/2000 caracteres/);
      }
    });

    it('acepta mensaje con exactamente 10 caracteres (límite inferior)', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: '1234567890',
      });

      expect(result.success).toBe(true);
    });

    it('acepta mensaje con exactamente 2000 caracteres (límite superior)', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'M'.repeat(2000),
      });

      expect(result.success).toBe(true);
    });
  });

  // ─── phone (opcional) ────────────────────────────────────────────────────────

  describe('phone (opcional)', () => {
    it('acepta undefined sin error', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('acepta string vacío como "sin teléfono" (coerced a undefined por el action)', () => {
      // El schema marca phone como optional — string vacío pasa el optional check
      // pero el refine lo ignora porque !val es true para ''
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: '',
      });

      // '' → !val es true → refine retorna true → pasa
      expect(result.success).toBe(true);
    });

    it('acepta número de teléfono con formato argentino', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: '+54 11 1234-5678',
      });

      expect(result.success).toBe(true);
    });

    it('acepta número local sin código de país', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: '1134567890',
      });

      expect(result.success).toBe(true);
    });

    it('falla si phone tiene caracteres alfabéticos', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: 'abc12345',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const phoneError = result.error.issues.find((i) => i.path.includes('phone'));
        expect(phoneError?.message).toMatch(/número de teléfono válido/);
      }
    });

    it('falla si phone tiene menos de 7 dígitos', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        phone: '12345',
      });

      expect(result.success).toBe(false);
    });
  });

  // ─── serviceSlug (opcional) ──────────────────────────────────────────────────

  describe('serviceSlug (opcional)', () => {
    it('acepta undefined', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.serviceSlug).toBeUndefined();
      }
    });

    it('acepta un slug válido', () => {
      const result = contactSchema.safeParse({
        name: 'Ana García',
        email: 'ana@example.com',
        message: 'Mensaje con longitud suficiente.',
        serviceSlug: 'fine-art',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.serviceSlug).toBe('fine-art');
      }
    });
  });
});
