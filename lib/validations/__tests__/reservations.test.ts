import { describe, it, expect } from 'vitest';
import { notesSchema, reservationStatusEnum } from '@/lib/validations/reservations';

describe('notesSchema', () => {
  it('acepta string válido', () => {
    const res = notesSchema.safeParse('Cliente pidió luz natural');
    expect(res.success).toBe(true);
    if (res.success) expect(res.data).toBe('Cliente pidió luz natural');
  });

  it('acepta vacío y devuelve null', () => {
    const res = notesSchema.safeParse('');
    expect(res.success).toBe(true);
    if (res.success) expect(res.data).toBeNull();
  });

  it('acepta undefined → null', () => {
    const res = notesSchema.safeParse(undefined);
    expect(res.success).toBe(true);
  });

  it('acepta null → null', () => {
    const res = notesSchema.safeParse(null);
    expect(res.success).toBe(true);
  });

  it('rechaza más de 2000 chars', () => {
    const res = notesSchema.safeParse('a'.repeat(2001));
    expect(res.success).toBe(false);
  });

  it('acepta exactamente 2000 chars', () => {
    const res = notesSchema.safeParse('a'.repeat(2000));
    expect(res.success).toBe(true);
  });

  it('trimea whitespace', () => {
    const res = notesSchema.safeParse('  hola  ');
    expect(res.success).toBe(true);
    if (res.success) expect(res.data).toBe('hola');
  });
});

describe('reservationStatusEnum', () => {
  it('acepta status válidos', () => {
    expect(reservationStatusEnum.safeParse('CONFIRMED').success).toBe(true);
    expect(reservationStatusEnum.safeParse('CANCELLED').success).toBe(true);
  });

  it('rechaza status inválido', () => {
    expect(reservationStatusEnum.safeParse('INVALID').success).toBe(false);
  });
});
