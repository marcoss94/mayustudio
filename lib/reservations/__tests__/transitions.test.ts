import { describe, it, expect } from 'vitest';
import type { ReservationStatus } from '@prisma/client';
import {
  STATUS_TRANSITIONS,
  getValidTransitions,
  isValidTransition,
} from '@/lib/reservations/transitions';

const ALL_STATUSES: ReservationStatus[] = [
  'DRAFT',
  'PENDING_PAYMENT',
  'CONFIRMED',
  'CANCELLED',
  'EXPIRED',
  'COMPLETED',
];

describe('STATUS_TRANSITIONS matrix', () => {
  it('CANCELLED es terminal (sin transitions)', () => {
    expect(STATUS_TRANSITIONS.CANCELLED).toEqual([]);
  });

  it('COMPLETED es terminal (sin transitions)', () => {
    expect(STATUS_TRANSITIONS.COMPLETED).toEqual([]);
  });

  it('DRAFT transiciona a PENDING_PAYMENT, CONFIRMED, CANCELLED', () => {
    expect(STATUS_TRANSITIONS.DRAFT).toEqual(
      expect.arrayContaining(['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED']),
    );
  });

  it('PENDING_PAYMENT transiciona a CONFIRMED, CANCELLED, EXPIRED', () => {
    expect(STATUS_TRANSITIONS.PENDING_PAYMENT).toEqual(
      expect.arrayContaining(['CONFIRMED', 'CANCELLED', 'EXPIRED']),
    );
  });

  it('CONFIRMED transiciona a CANCELLED, COMPLETED', () => {
    expect(STATUS_TRANSITIONS.CONFIRMED).toEqual(
      expect.arrayContaining(['CANCELLED', 'COMPLETED']),
    );
  });

  it('EXPIRED transiciona a CONFIRMED, CANCELLED', () => {
    expect(STATUS_TRANSITIONS.EXPIRED).toEqual(
      expect.arrayContaining(['CONFIRMED', 'CANCELLED']),
    );
  });
});

describe('getValidTransitions', () => {
  it('devuelve transitions para cada status válido', () => {
    for (const status of ALL_STATUSES) {
      const result = getValidTransitions(status);
      expect(Array.isArray(result)).toBe(true);
    }
  });

  it('devuelve [] para terminales', () => {
    expect(getValidTransitions('CANCELLED')).toEqual([]);
    expect(getValidTransitions('COMPLETED')).toEqual([]);
  });
});

describe('isValidTransition', () => {
  it('CONFIRMED → COMPLETED válido', () => {
    expect(isValidTransition('CONFIRMED', 'COMPLETED')).toBe(true);
  });

  it('COMPLETED → CONFIRMED inválido (terminal)', () => {
    expect(isValidTransition('COMPLETED', 'CONFIRMED')).toBe(false);
  });

  it('CANCELLED → cualquier inválido (terminal)', () => {
    for (const to of ALL_STATUSES) {
      expect(isValidTransition('CANCELLED', to)).toBe(false);
    }
  });

  it('DRAFT → COMPLETED inválido (no en matriz)', () => {
    expect(isValidTransition('DRAFT', 'COMPLETED')).toBe(false);
  });

  it('PENDING_PAYMENT → EXPIRED válido', () => {
    expect(isValidTransition('PENDING_PAYMENT', 'EXPIRED')).toBe(true);
  });

  it('EXPIRED → CONFIRMED válido (recovery tras pago tardío)', () => {
    expect(isValidTransition('EXPIRED', 'CONFIRMED')).toBe(true);
  });

  it('mismo status (no-op) inválido', () => {
    expect(isValidTransition('CONFIRMED', 'CONFIRMED')).toBe(false);
  });
});
